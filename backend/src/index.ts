import { appFactory } from "./api/express";
import { createDatabase } from "./db/db";
import { FileService } from "./files/fileService";
import { CardService } from "./model/card.service";
import { KanbanService } from "./model/kanban.service";
import { TaskService } from "./model/task.service";


async function main() {
  const database = await createDatabase('./data/tdl.db');

  const taskService = new TaskService(database);
  await taskService.init();
  const cardService = new CardService(database);
  await cardService.init();
  const fileService = new FileService('./data/files/');
  await fileService.init();
  const kanbanService = new KanbanService(database, taskService);
  await kanbanService.init();

  const useAuthentication = process.env.USE_AUTHENTICATION === 'true';
  let authenticationData = undefined;
  if (useAuthentication) {
    authenticationData = {
      userName: process.env.TDL2_USERNAME,
      saltedHashedPassword: process.env.SALTED_HASHED_PASSWORD,
      sessionSecret: process.env.SESSION_SECRET,
      requireHttps: process.env.REQUIRE_HTTPS === 'true',
    };
  }

  const corsOrigin = process.env.CORS_ORIGIN;

  const app = appFactory(taskService, fileService, cardService, kanbanService, {
    withAuthentication: useAuthentication ? authenticationData : undefined,
    cors: { origin: corsOrigin },
  });

  const port = 1410;
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

main();
