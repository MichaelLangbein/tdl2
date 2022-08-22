import { Database } from 'sqlite';
import { createDatabase } from '../db/db';
import { TaskRow, TaskService } from '../model/taskService';
import { appFactory } from './express';
import { Express } from "express";
import axios from "axios";

describe("rest api", () => {

    let database: Database;
    let taskService: TaskService;
    let app: Express;
    beforeAll(async () => {
        database = await createDatabase(":memory:");
        taskService = new TaskService(database);
        await taskService.init();
        app = appFactory(taskService);
        
        const port = 1411;
        app.listen(port);
    });

    afterAll(async () => {
        await database.close();
    });

    test("GET /subtree", async () => {
        const response = await axios.get("http://localhost:1411/subtree/0/3");
        expect(response.status).toBe(200);
        expect(response.data).toBe("");
    });

    test("POST /tasks", async () => {
        const task = {
            title: "first task",
            description: "...",
            parent: null
        }
        const response = await axios.post("http://localhost:1411/tasks/create", task);
        expect(response.status).toBe(200);
        expect(response.data).toBeTruthy();
        expect(response.data.title).toBe(task.title);

        const getResponse = await axios.get(`http://localhost:1411/subtree/${response.data.id}/3`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.data.title).toBe(task.title);
        expect(getResponse.data.children.length).toBe(0);
    });

    test("PATCH /tasks/update", async () => {
        // app.patch("/tasks/update",
        const task = {
            title: "first task",
            description: "...",
            parent: null
        }
        const response = await axios.post("http://localhost:1411/tasks/create", task);
        const originalTask: TaskRow = response.data;

        originalTask.deadline = new Date().getTime();
        originalTask.description = "This task is going to be simple.";

        const updateResponse = await axios.patch(`http://localhost:1411/tasks/update`, originalTask);
        expect(updateResponse.status).toBe(200);
        const updatedTask = updateResponse.data;
        expect(updatedTask.description).toBe(originalTask.description);
        expect(updatedTask.deadline).toBe(originalTask.deadline);
        
    });
});