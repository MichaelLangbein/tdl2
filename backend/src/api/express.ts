import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { TaskService, TaskTree } from '../model/task.service';
import { listFilesInDirRecursive, readJsonFile, readTextFile } from '../files/files';
import { estimateTime } from "../stats/estimates";
import { FileService } from '../files/fileService';
import { CardService } from '../model/card.service';

export function appFactory(taskService: TaskService, fileService: FileService, cardService: CardService) {
    const app = express();

    app.use(cors());
    app.use(fileUpload());
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
        const data = req.body;
        const task = await taskService.createTask(data.title, data.description, data.parent, data.deadline);
        res.send(task);
    });

    // cRud - Read
    app.post("/tasks/search", async (req, res) => {
        const searchFor = req.body;
        const results = await taskService.search(searchFor.searchString);
        res.send(results);
    });

    // crUd - Update
    app.patch("/tasks/update", async (req, res) => {
        const data = req.body;
        const updatedTask = await taskService.updateTask(data.id, data.title, data.description, data.parent, data.secondsActive, data.completed, data.deadline);
        res.send(updatedTask);
    });

    app.post("/tasks/:id/addFile", async (req, res) => {
        const taskId = +req.params.id;
        if (req.files) {
            for (const key in req.files) {
                const file = req.files[key];
                if (Array.isArray(file)) {
                    for (const ffile of file) {
                        const localFilePath = await fileService.storeFile(ffile);
                        await taskService.addFileAttachment(taskId, localFilePath);
                    }
                } else {
                    const localFilePath = await fileService.storeFile(file);
                    await taskService.addFileAttachment(taskId, localFilePath);    
                }
            }
            
        }
        const tree = await taskService.getSubtree(taskId, 1);
        res.send(tree);
    });

    // cruD - Delete
    app.delete("/tasks/delete/:id", async (req, res) => {
        const id = +req.params.id;
        const parent = await taskService.getParent(id);
        await taskService.deleteTree(id, true);
        res.send(parent);
    });

    app.delete("/tasks/:taskId/removeFile/:fileId", async (req, res) => {
        const taskId = +req.params.taskId;
        const fileId = +req.params.fileId;
        const fileRow = await taskService.getFileAttachment(fileId);
        await fileService.removeFile(fileRow.path);
        await taskService.deleteFileAttachment(fileId);
        const tree = await taskService.getSubtree(taskId, 1);
        res.send(tree);
    });


    app.get("/tasks/:id/estimate", async (req, res) => {
        const id = +req.params.id;
        const fullTree = await taskService.getSubtree(1, 30, true);
        if (fullTree) {
            const estimates = estimateTime(id, fullTree!);
            res.send(estimates);
        } else {
            res.send({});
        }
    });

    app.get("/tasks/upcoming", async (req, res) => {
        const list = await taskService.upcoming();
        res.send(list);
    });


    /***********************************************************************
     * TaskTrees
     **********************************************************************/

    app.get("/subtree/:taskId/:depth", async (req, res) => {
        const subTree = await taskService.getSubtree(+req.params.taskId, +req.params.depth);
        res.send(subTree);
    });

    app.get("/subtree/pathTo/:targetTaskId/:extraDepth", async (req, res) => {
        const subTree = await taskService.getSubtreePathTo(+req.params.targetTaskId, +req.params.extraDepth);
        res.send(subTree);
    });

    app.post("/subtree/treeDiff", async (req, res) => {
        const frontendTree: TaskTree = req.body;
        const backendTree = await taskService.treeDiff(frontendTree);
        res.send(backendTree);
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



    /***********************************************************************
     * Misc
     **********************************************************************/
    app.get("/statistics/completionTimes", async (req, res) => {
        const times = await taskService.completionTimes();
        res.send(times);
    });


    
    /***********************************************************************
     * Cards
     **********************************************************************/
    app.get("/cards/topics", async (req, res) => {
        const topics = await cardService.getTopics();
        res.send(topics);
    });

    app.get("/cards/topics/:topicId/cards", async (req, res) => {
        const topicId = +req.params.topicId;
        const cards = await cardService.getCards(topicId);
        res.send(cards);
    });

    app.post("/cards/topics/new", async (req, res) => {
        const body = req.body;
        const topic = await cardService.createTopic(body.title);
        res.send(topic);
    });

    app.post("/cards/topics/:topicId/cards/new", async (req, res) => {
        const topicId = +req.params.topicId;
        const body = req.body;
        const card = await cardService.createCard(topicId, body.front, body.back);
        res.send(card);
    });

    app.patch("/cards/topics/:topicId/cards/:cardId/update", async (req, res) => {
        const topicId = +req.params.topicId;
        const cardId = +req.params.cardId;
        const body = req.body;
        const updated = await cardService.updateCard(cardId, topicId, body.front, body.back, body.goodAnswers, body.okAnswers, body.badAnswers);
        res.send(updated);
    });

    return app;
}