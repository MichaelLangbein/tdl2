import cors from "cors";
import { scryptSync, timingSafeEqual } from "crypto";
import express, { NextFunction, Request, Response } from "express";
import fileUpload, { FileArray } from "express-fileupload";
import session from "express-session";
import passport, { Request as PassportRequest } from "passport";
import { Strategy } from "passport-local";

import { listFilesInDirRecursive, readJsonFile, readTextFile } from "../files/files";
import { FileService } from "../files/fileService";
import { CardService } from "../model/card.service";
import { DbAction, TaskRow, TaskService } from "../model/task.service";
import { filterToParentNode, filterTree } from "../model/taskTree.utils";
import { estimateTime, estimateTreeTime } from "../stats/estimates";


export interface AppConfig {
  withAuthentication?: { userName: string; saltedHashedPassword: string; sessionSecret: string; requireHttps: boolean };
  cors?: { origin: string };
}

export function appFactory(
  taskService: TaskService,
  fileService: FileService,
  cardService: CardService,
  appConfig: AppConfig
) {
  const app = express();

  if (appConfig.cors) {
    app.use(
      cors({
        origin: appConfig.cors.origin,
        credentials: appConfig.withAuthentication ? true : false,
      })
    );
  } else {
    app.use(cors());
  }
  app.use(fileUpload());
  app.use(express.json());

  /***********************************************************************
   * Authentication
   **********************************************************************/
  if (appConfig.withAuthentication) {
    // sessions: https://www.youtube.com/watch?v=oExWh86IgHA&t=398s
    // passport-local: https://www.youtube.com/watch?v=_lZUq39FGv0
    // local authentication

    passport.use(
      new Strategy(
        {
          usernameField: 'username',
          passwordField: 'password',
          session: true,
        },
        (username: string, password: string, callback) => {
          /** callback(error: Error | null, user: User | false, responseData?: any) */

          const trueUserName = appConfig.withAuthentication.userName;
          if (username !== trueUserName) return callback(null, false, { message: 'Incorrect username.' });

          try {
            const saltedHashedTruePassword = appConfig.withAuthentication.saltedHashedPassword;
            const [saltHex, hashedTruePasswordHex] = saltedHashedTruePassword.split(':');
            const hashedTruePassword = Buffer.from(hashedTruePasswordHex, 'hex');
            const hashedGivenPassword = scryptSync(password, saltHex, 64);
            const match = timingSafeEqual(hashedTruePassword, hashedGivenPassword);

            if (!match) return callback(null, false, { message: 'Incorrect password.' });
            else return callback(null, { username: trueUserName });
          } catch (error) {
            return callback(error);
          }
        }
      )
    );
    // once authenticated, store user in session
    // should serialize something that is unique to the user
    passport.serializeUser(function (user, callback) {
      // user-object into session
      // it's bad practice to serialize the whole user-object:
      // this information might be sensitive
      // or get stale while it changes on the server.
      return callback(null, {
        username: user.username,
      });
    });
    passport.deserializeUser(function (user, callback) {
      // session into user-object
      return callback(null, user);
    });

    app.use(
      session({
        secret: appConfig.withAuthentication.sessionSecret,
        // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
        resave: false,
        saveUninitialized: true,
        cookie: {
          // if maxAge is commented out, cookie won't persist across browser restarts
          maxAge: 24 * 60 * 60 * 1000,
          // https://stackoverflow.com/questions/40324121/express-session-secure-true
          // https://expressjs.com/en/resources/middleware/cookie-session.html
          secure: appConfig.withAuthentication.requireHttps,
          // if httpOnly, cookie can't be accessed through JS
          httpOnly: true,
        },
      })
    );

    // position is important:
    // after `app.use(session)`
    // before routes
    app.use(passport.initialize());
    app.use(passport.session()); // attaches `user` to `req`
    const authWithSession = passport.authenticate('session', { failureMessage: true });
    app.use(authWithSession);

    function requireHTTPS(req: Request, res: Response, next: NextFunction) {
      if (!appConfig.withAuthentication.requireHttps) return next();
      if (!req.secure) {
        return res.redirect('https://' + req.get('host') + req.url);
      }
      next();
    }

    const authWithPassword = passport.authenticate('local', { failureMessage: true });
    app.post('/login/password', requireHTTPS, authWithPassword, (req, res) => res.send({ success: true }));

    app.get('/login/logout', requireHTTPS, (req: PassportRequest, res) => {
      if (!req.user) return res.status(401).send({ error: 'already logged out' });
      req.logout((err) => {
        if (err) return res.status(400).send({ error: err });
        return res.status(200).send({ success: 'logged out' });
      });
    });

    app.get(`/login/status`, requireHTTPS, (req: PassportRequest, res) => {
      if (!req.user) return res.status(200).send({ loggedIn: false });
      if (req.user) return res.status(200).send({ loggedIn: true });
    });
  }

  function checkAuthenticated(req: PassportRequest, res: Response, next: NextFunction) {
    if (!appConfig.withAuthentication) return next();
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(401);
  }

  /***********************************************************************
   * Heartbeat
   **********************************************************************/

  app.get('/', (req, res) => {
    res.send('tdl-backend running.');
  });

  /***********************************************************************
   * Tasks
   * This API will soon be deprecated in favor of the subtree-API
   * with its TreeDiff algorithm.
   **********************************************************************/

  // Crud - Create
  app.post('/tasks/create', checkAuthenticated, async (req, res) => {
    const data = req.body;
    const task = await taskService.createTask(data.title, data.parent, data.created);
    res.send(task);
  });

  // cRud - Read
  app.post('/tasks/search', async (req, res) => {
    const searchFor = req.body;
    const results = await taskService.search(searchFor.searchString);
    res.send(results);
  });

  // crUd - Update
  app.patch('/tasks/update', checkAuthenticated, async (req, res) => {
    const taskRow: TaskRow = req.body;
    const updatedTask = await taskService.updateTask(taskRow);
    res.send(updatedTask);
  });

  async function saveOneOrMoreFiles(taskId: number, fileArray: FileArray) {
    for (const key in fileArray) {
      const files = fileArray[key];
      if (Array.isArray(files)) {
        for (const file of files) {
          const localFilePath = await fileService.storeFile(file);
          await taskService.addFileAttachment(taskId, localFilePath);
        }
      } else {
        const localFilePath = await fileService.storeFile(files);
        await taskService.addFileAttachment(taskId, localFilePath);
      }
    }
  }

  app.post('/tasks/:id/addFile', checkAuthenticated, async (req, res) => {
    const taskId = +req.params.id;
    if (req.files) {
      saveOneOrMoreFiles(taskId, req.files);
    }
    const tree = await taskService.getSubtree(taskId, 1);
    res.send(tree);
  });

  // cruD - Delete
  app.delete('/tasks/delete/:id', checkAuthenticated, async (req, res) => {
    const id = +req.params.id;
    const parent = await taskService.getParent(id);
    await taskService.deleteTree(id, true);
    res.send(parent);
  });

  app.delete('/tasks/:taskId/removeFile/:fileId', checkAuthenticated, async (req, res) => {
    const taskId = +req.params.taskId;
    const fileId = +req.params.fileId;
    const fileRow = await taskService.getFileAttachment(fileId);
    await fileService.removeFile(fileRow.path);
    await taskService.deleteFileAttachment(fileId);
    const tree = await taskService.getSubtree(taskId, 1);
    res.send(tree);
  });

  app.get('/tasks/:id/estimate', checkAuthenticated, async (req, res) => {
    const id = +req.params.id;
    const fullTree = await taskService.getSubtree(1, 30, true);
    if (fullTree) {
      const estimates = estimateTime(id, fullTree!);
      res.send(estimates);
    } else {
      res.send({});
    }
  });

  app.get('/tasks/upcoming', async (req, res) => {
    const list = await taskService.upcoming();
    res.send(list);
  });

  /***********************************************************************
   * TaskTrees
   **********************************************************************/

  app.get('/subtree/:taskId/:depth', async (req, res) => {
    const subTree = await taskService.getSubtree(+req.params.taskId, +req.params.depth);
    res.send(subTree);
  });

  app.get('/subtree/pathTo/:targetTaskId/:extraDepth', async (req, res) => {
    const subTree = await taskService.getSubtreePathTo(+req.params.targetTaskId, +req.params.extraDepth);
    res.send(subTree);
  });

  app.post('/subtree/actionQueue', checkAuthenticated, async (req, res) => {
    const actions: DbAction[] = req.body;
    const ids: number[] = [];
    for (const action of actions) {
      switch (action.type) {
        case 'create':
          const trc = await taskService.createTask(action.args.title, action.args.parentId, action.args.created);
          ids.push(trc.id);
        case 'update':
          const updatedRow: TaskRow = action.args;
          const tru = await taskService.updateTask(updatedRow);
          ids.push(tru.id);
        case 'delete':
          await taskService.deleteTask(action.args.id);
        case 'addFile':
          await saveOneOrMoreFiles(action.args.id, action.args.files);
        default:
          console.error(`No such DbAction: ${action.type}`);
      }
    }

    const fullTree = await taskService.getSubtree(1, 30, true);
    const minimumSpanningTree = filterToParentNode(ids, fullTree);
    const estimatedTree = estimateTreeTime(minimumSpanningTree);
    const estimatedUnfinishedTree = filterTree(estimatedTree, (node) => !node.completed);

    res.send(estimatedUnfinishedTree);
  });

  /***********************************************************************
   * Wisecracker
   **********************************************************************/
  app.get('/wisecracker', async (req, res) => {
    const contents = await readJsonFile('data/wisecracker/wisecracker.json');
    res.send(contents);
  });

  /***********************************************************************
   * Wiki
   **********************************************************************/
  app.get('/wiki/list', async (req, res) => {
    const contents = await listFilesInDirRecursive('data/wiki');
    const contentsStripped = contents.map((c) => c.replace('data/wiki/', ''));
    res.send(contentsStripped);
  });

  app.get('/wiki/*', async (req, res) => {
    const fileName = (req.params as any)[0];
    const content = await readTextFile(`data/wiki/${fileName}`);
    res.send(content);
  });

  /***********************************************************************
   * Misc
   **********************************************************************/
  app.get('/statistics/completionTimes', async (req, res) => {
    const times = await taskService.completionTimes();
    res.send(times);
  });

  /***********************************************************************
   * Cards
   **********************************************************************/
  app.get('/cards/topics', async (req, res) => {
    const topics = await cardService.getTopics();
    res.send(topics);
  });

  app.get('/cards/topics/:topicId/cards', async (req, res) => {
    const topicId = +req.params.topicId;
    const cards = await cardService.getCards(topicId);
    res.send(cards);
  });

  app.post('/cards/topics/new', checkAuthenticated, async (req, res) => {
    const body = req.body;
    const topic = await cardService.createTopic(body.title);
    res.send(topic);
  });

  app.post('/cards/topics/:topicId/cards/new', checkAuthenticated, async (req, res) => {
    const topicId = +req.params.topicId;
    const body = req.body;
    const card = await cardService.createCard(topicId, body.front, body.back);
    res.send(card);
  });

  app.patch('/cards/topics/:topicId/cards/:cardId/update', checkAuthenticated, async (req, res) => {
    const topicId = +req.params.topicId;
    const cardId = +req.params.cardId;
    const body = req.body;
    const updated = await cardService.updateCard(
      cardId,
      topicId,
      body.front,
      body.back,
      body.goodAnswers,
      body.okAnswers,
      body.badAnswers
    );
    res.send(updated);
  });

  return app;
}
