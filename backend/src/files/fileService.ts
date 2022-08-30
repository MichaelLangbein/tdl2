import { UploadedFile } from 'express-fileupload';
import { createDirIfNotExists, getPathTo } from './files';
import { writeFile } from 'fs/promises';


export class FileService {

    constructor(private filePath: string) {}

    public async init() {
        await createDirIfNotExists(this.filePath);
    }

    public async storeFile(data: UploadedFile): Promise<string> {
        const localPath = getPathTo(`${this.filePath}/${data.name}`);
        await writeFile(localPath, data.data);
        return localPath;
    }
}