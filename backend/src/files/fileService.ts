import { UploadedFile } from 'express-fileupload';
import { createDirIfNotExists, getPathTo, deleteFile, writeBinaryFile, pathJoin } from './files';



export class FileService {

    private filePath: string;

    constructor(filePath: string) {
        this.filePath = getPathTo(filePath);
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
}