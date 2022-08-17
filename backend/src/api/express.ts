import express from "express";
import cors from "cors";
import { TaskService } from '../model/taskService';

export function appFactory(taskService: TaskService) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("tdl-backend running.");
    });

    app.get("/subtree/:taskId/:depth", async (req, res) => {
        const subTree = await taskService.getSubtree(+req.params.taskId, +req.params.depth);
        res.send(subTree);
    });

    app.post("/tasks/create", async (req, res) => {
        const taskData = req.body;
        const task = await taskService.createTask(taskData.title, taskData.description, taskData.parent ? taskData.parent : null);
        res.send(task);
    });

    app.delete("/tasks/delete/:id", async (req, res) => {
        const id = +req.params.id;
        const parent = await taskService.getParent(id);
        await taskService.deleteTree(id, true);
        res.send(parent);
    });

    return app;
}