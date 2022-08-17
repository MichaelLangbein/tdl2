import { appFactory } from './api/express';
import { createDatabase } from './db/db';
import { TaskService } from './model/taskService';




async function main() {
    const database = await createDatabase("./data/tdl.db");
    const taskService = new TaskService(database);
    await taskService.init();
    const app = appFactory(taskService);
    
    const port = 1410;
    app.listen(port, () => {
        console.log(`Server listening on ${port}`);
    })
}

main();