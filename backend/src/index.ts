import { appFactory } from './api/express';
import { createDatabase } from './db/db';
import { FileService } from './files/fileService';
import { TaskService } from './model/task.service';




async function main() {
    const database = await createDatabase("./data/tdl.db");

    const taskService = new TaskService(database);
    await taskService.init();
    
    const fileService = new FileService("./data/files");
    await fileService.init();

    const app = appFactory(taskService, fileService);
    
    const port = 1410;
    app.listen(port, () => {
        console.log(`Server listening on ${port}`);
    })
}

main();