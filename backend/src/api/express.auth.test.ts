import axios from "axios";
import { randomBytes, scryptSync } from "crypto";
import { Express } from "express";
import { Database } from "sqlite";

import { createDatabase } from "../db/db";
import { FileService } from "../files/fileService";
import { CardService } from "../model/card.service";
import { TaskService } from "../model/task.service";
import { appFactory } from "./express";


function createUser(username: string, password: string) {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');
  const userData = { username, saltedHashedPassword: `${salt}:${hashedPassword}` };
  return userData;
}

describe('rest api authentication', () => {
  let database: Database;
  let taskService: TaskService;
  let fileService: FileService;
  let cardService: CardService;
  let app: Express;
  const username = 'admin';
  const password = 'admin';
  const port = 1412;

  beforeAll(async () => {
    database = await createDatabase(':memory:');

    taskService = new TaskService(database);
    await taskService.init();

    cardService = new CardService(database);
    await cardService.init();

    fileService = new FileService('./data/tmp/');
    await fileService.init();

    const userData = createUser(username, password);
    const authenticationData = {
      userName: userData.username,
      saltedHashedPassword: userData.saltedHashedPassword,
      sessionSecret: 'session secret',
      requireHttps: false,
    };

    app = appFactory(taskService, fileService, cardService, authenticationData);

    app.listen(port);
  });

  afterAll(async () => {
    await database.close();
  });

  test('GET works as normal', async () => {
    const response = await axios.get(`http://localhost:${port}/`);
    expect(response.status).toBe(200);
    expect(response.data).toBe('tdl-backend running.');
  });

  test('POST fails without auth', async () => {
    const task = {
      title: 'first task',
      parent: null,
    };
    try {
      const response = await axios.post(`http://localhost:${port}/tasks/create`, task);
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });

  test('POST works with auth', async () => {
    const authResponse = await axios.post(
      `http://localhost:${port}/login/password`,
      { username, password },
      { withCredentials: true }
    );
    expect(authResponse.status).toBe(200);
    const setCookieHeader = authResponse.headers['set-cookie'][0];

    const task = {
      title: 'first task',
      parent: null,
    };
    const response = await axios.post(`http://localhost:${port}/tasks/create`, task, {
      withCredentials: true,
      headers: { Cookie: setCookieHeader },
    });
    expect(response.status).toBe(200);
    expect(response.data).toBeTruthy();
    expect(response.data.title).toBe(task.title);

    const getResponse = await axios.get(`http://localhost:${port}/subtree/${response.data.id}/3`, {
      withCredentials: true,
      headers: { Cookie: setCookieHeader },
    });
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.title).toBe(task.title);
    expect(getResponse.data.children.length).toBe(0);
  });
});
