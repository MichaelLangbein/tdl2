import express from "express";
import cors from "cors";
import { TaskService } from '../model/taskService';
import { listFilesInDirRecursive, readJsonFile, readTextFile } from '../files/files';

export function appFactory(taskService: TaskService) {
    const app = express();

    app.use(cors());
    app.use(express.json());


    /***********************************************************************
     * Heartbeat
     **********************************************************************/

    app.get("/", (req, res) => {
        res.send("tdl-backend running.");
    });

    /***********************************************************************
     * Tasks
     **********************************************************************/

    // Crud - Create
    app.post("/tasks/create", async (req, res) => {
        const taskData = req.body;
        const task = await taskService.createTask(taskData.title, taskData.description, taskData.parent ? taskData.parent : null);
        res.send(task);
    });

    // cRud - Read
    app.get("/subtree/:taskId/:depth", async (req, res) => {
        const subTree = await taskService.getSubtree(+req.params.taskId, +req.params.depth);
        res.send(subTree);
    });

    // crUd - Update
    app.patch("/tasks/update", async (req, res) => {
        const data = req.body;
        const updatedTask = await taskService.updateTask(data.id, data.title, data.description, data.parent, data.secondsActive, data.completed);
        res.send(updatedTask);
    });

    // cruD - Delete
    app.delete("/tasks/delete/:id", async (req, res) => {
        const id = +req.params.id;
        const parent = await taskService.getParent(id);
        await taskService.deleteTree(id, true);
        res.send(parent);
    });

    
    /***********************************************************************
     * Wisecracker
     **********************************************************************/
    app.get("/wisecracker", async (req, res) => {
        const contents = await readJsonFile('data/wisecracker/wisecracker.json');
        res.send(contents);
    });
    
    /***********************************************************************
     * Wiki
     **********************************************************************/
    app.get("/wiki/list", async (req, res) => {
        const contents = await listFilesInDirRecursive('data/wiki');
        const contentsStripped = contents.map(c => c.replace("data/wiki/", ""));
        res.send(contentsStripped);
    });

    app.get("/wiki/*", async (req, res) => {
        const fileName = (req.params as any)[0];
        const content = await readTextFile(`data/wiki/${fileName}`);
        res.send(content);
    });


    return app;
}