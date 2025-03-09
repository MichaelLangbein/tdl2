import { deleteFile } from "./files";
import { FileService } from "./fileService";


describe('file service', () => {

    // "." will be resolved relative to where the node-binary is being executed, i.e. to /backend/
    const fileDir = "./testdata/tmp/";
    let fileService;
    
    beforeAll(async () => {
        fileService = new FileService(fileDir);
        await fileService.init();
    });


    test('store file', async () => {
        const data = {
            name: 'test.txt',
            data: Buffer.from('hello world')
        }
        const path = await fileService.storeFile(data);
        expect(path.includes("testdata")).toBe(true);
        expect(path.includes("tmp")).toBe(true);
        expect(path.includes("test.txt")).toBe(true);
    });

    afterAll(async () => {
        deleteFile(fileDir);
    });
});