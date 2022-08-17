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
    app.put("/tasks/update", async (req, res) => {
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

    return app;
}