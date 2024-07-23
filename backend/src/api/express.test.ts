import axios from "axios";
import { Express } from "express";
import { Database } from "sqlite";

import { createDatabase } from "../db/db";
import { FileService } from "../files/fileService";
import { CardService } from "../model/card.service";
import { TaskRow, TaskService } from "../model/task.service";
import { appFactory } from "./express";


describe('rest api', () => {
  let database: Database;
  let taskService: TaskService;
  let fileService: FileService;
  let cardService: CardService;
  let app: Express;
  const port = 1411;

  beforeAll(async () => {
    database = await createDatabase(':memory:');

    taskService = new TaskService(database);
    await taskService.init();

    cardService = new CardService(database);
    await cardService.init();

    fileService = new FileService('./data/tmp/');
    await fileService.init();

    app = appFactory(taskService, fileService, cardService, {});

    app.listen(port);
  });

  afterAll(async () => {
    await database.close();
  });

  test('GET /subtree', async () => {
    const response = await axios.get(`http://localhost:${port}/subtree/0/3`);
    expect(response.status).toBe(200);
    expect(response.data).toBe('');
  });

  test('POST /tasks', async () => {
    const task = {
      title: 'first task',
      parent: null,
    };
    const response = await axios.post(`http://localhost:${port}/tasks/create`, task);
    expect(response.status).toBe(200);
    expect(response.data).toBeTruthy();
    expect(response.data.title).toBe(task.title);

    const getResponse = await axios.get(`http://localhost:${port}/subtree/${response.data.id}/3`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.title).toBe(task.title);
    expect(getResponse.data.children.length).toBe(0);
  });

  test('PATCH /tasks/update', async () => {
    const task = {
      title: 'first task',
      description: '...',
      parent: null,
    };
    const response = await axios.post(`http://localhost:${port}/tasks/create`, task);
    const originalTask: TaskRow = response.data;

    originalTask.deadline = new Date().getTime();
    originalTask.description = 'This task is going to be simple.';

    const updateResponse = await axios.patch(`http://localhost:${port}/tasks/update`, originalTask);
    expect(updateResponse.status).toBe(200);
    const updatedTask = updateResponse.data;
    expect(updatedTask.description).toBe(originalTask.description);
    expect(updatedTask.deadline).toBe(originalTask.deadline);
  });
});
