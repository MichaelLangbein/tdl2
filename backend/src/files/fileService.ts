import { UploadedFile } from 'express-fileupload';
import { createDirIfNotExists, getPathTo, getPathToDir, deleteFile, writeBinaryFile, pathJoin } from './files';
import {extname, normalize, resolve} from "path";
import { readFile } from 'fs/promises';
import { createReadStream } from 'fs';



export class FileService {

    private filePath: string;

    constructor(filePath: string) {
        this.filePath = getPathToDir(filePath);
    }

    public async init() {
        await createDirIfNotExists(this.filePath);
    }

    public async storeFile(data: UploadedFile): Promise<string> {
        const targetPath = pathJoin([this.filePath, data.name]);
        await writeBinaryFile(targetPath, data.data);
        return targetPath;
    }

    public async removeFile(targetFilePath: string): Promise<void> {
        const localTargetFilePath = getPathTo(targetFilePath);
        if (localTargetFilePath !== this.filePath) throw new Error(`Cannot delete files outside the file directory. ${this.filePath} != ${localTargetFilePath}`);
        return await deleteFile(targetFilePath);
    }

    public async getFile(filePath: string) {
        const safeFilePath = normalize(filePath);
        const absolutePath = resolve(__dirname, safeFilePath);
        if (!absolutePath.startsWith(this.filePath)) {
            throw new Error(`Access to file outside of the allowed directory is not permitted: ${filePath}`);
        }
        const file = await readFile(absolutePath);
        const contentType = this.estimateContentType(filePath);
        return {file, contentType};
    }

    public getFileStream(filePath: string) {
        const safeFilePath = normalize(filePath);
        const absolutePath = resolve(__dirname, safeFilePath);
        if (!absolutePath.startsWith(this.filePath)) {
            throw new Error(`Access to file outside of the allowed directory is not permitted: ${filePath}`);
        }
        const contentType = this.estimateContentType(filePath);
        const fileStream = createReadStream(absolutePath);
        return {fileStream, contentType};
    }

    private estimateContentType(filePath: string): string {
        let contentType = 'application/octet-stream'; // Default binary type
        const fileExtension = extname(filePath).toLowerCase();
        switch (fileExtension) {
            case '.txt':
                contentType = 'text/plain';
                break;
            case '.html':
                contentType = 'text/html';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            // Add more cases as needed
        }
        return contentType;
    }
}