import { readFile, writeFile, unlink, stat, mkdir, appendFile, readdir } from 'fs/promises';
import { existsSync, statSync } from 'fs';
import path from 'path';



export function getPathTo(filePath: string) {
    return path.dirname(filePath);
}

export function isDir(path: string) {
    return statSync(path).isDirectory();
}

export function fileExists(path: string): boolean {
    return existsSync(path);
}

export async function readTextFile(filePath: string) {
    const contents = await readFile(filePath, {encoding: 'utf-8', flag: 'r'});
    return contents;
}

export async function writeTextFile(filePath: string, data: string) {
    const dir = filePath.substring(0, filePath.lastIndexOf(path.sep));
    await createDirIfNotExists(dir);
    await writeFile(filePath, data);
    return true;
}

export async function appendTextFile(filePath: string, data: string) {
    const dir = filePath.substring(0, filePath.lastIndexOf(path.sep));
    await createDirIfNotExists(dir);
    await appendFile(filePath, data);
    return true;
}

export async function deleteFile(filePath: string) {
    if (fileExists(filePath)) {
        await unlink(filePath);
    }
}

export async function getFileAge(filePath: string): Promise<number> {
    try {
        const statistics = await stat(filePath);
        const lastChange = statistics.ctime;
        const currentTime = new Date();
        const secondsSinceChange = (currentTime.getTime() - lastChange.getTime()) / 1000;
        return secondsSinceChange;
    } catch (e) {
        return -1;
    }
}

export async function createDirIfNotExists(dir: string) {
    if (!fileExists(dir)) {
        await mkdir(dir, {recursive: true});
    }
    return true;
}


export async function writeJsonFile(filePath: string, data: any) {
    return writeTextFile(filePath, JSON.stringify(data));
}

export async function appendJsonFile(filePath: string, data: any) {
    return appendTextFile(filePath, JSON.stringify(data));
}

export async function readJsonFile(filePath: string) {
    const content = await readTextFile(filePath);
    return JSON.parse(content);
}

export async function listFilesInDir(path: string): Promise<string[]> {
    const contents = await readdir(path);
    return contents;
}

export async function listFilesInDirRecursive(path: string): Promise<string[]> {
    const out: string[] = [];
    const contents = await readdir(path);
    for (const entry of contents) {
        const entryPath = path + "/" + entry;
        if (isDir(entryPath)) {
            const subEntries = await listFilesInDirRecursive(entryPath);
            out.push(...subEntries);
        } else {
            out.push(entryPath);
        }
    }
    return out;
}

