import { Database } from "sqlite";
import { createDatabase } from "../db/db";
import { TaskService, TaskTree } from "../model/task.service";
import { estimateTime } from "./estimates";


let db: Database;
let ts: TaskService;
beforeAll(async () => {
    db = await createDatabase(':memory:');
    ts = new TaskService(db);
    await ts.init();

});

afterAll(async () => {
    db.close();
});


describe("Estimates", () => {

    test("Basic functionality", async () => {

        const parent = await ts.createTask("parent", "", null, null);
        const child = await ts.createTask("child", "", parent.id, null);
        await ts.updateTask(parent.id, parent.title, parent.description, null, 100, null, null);
        const tree = await ts.getSubtree(parent.id, 2);

        const estimate = estimateTime(parent.id, tree!);
        expect(estimate).toBeTruthy();
        expect(estimate['tdvs']).toBeDefined();
        expect(estimate['buvs']).toBeDefined();
    });


    test("Return reasonable estimate", async () => {
        const tree: TaskTree = {
            id: 1,
            title: '',
            description: '',
            attachments: [],
            created: 1,
            secondsActive: 10,
            completed: undefined,
            deadline: undefined,
            parent: undefined,
            children: [{
                id: 2,
                title: '',
                description: '',
                attachments: [],
                created: 5,
                completed: undefined,
                secondsActive: 100,   // child 2 has been active as long as child 3 ... so an estimate should say that child 2 should be done soon.
                deadline: undefined,
                parent: 1,
                children: []
            }, {
                id: 3,
                title: '',
                description: '',
                attachments: [],
                created: 10,
                completed: 200,
                secondsActive: 100,
                deadline: undefined,
                parent: 1,
                children: []
            }]
        };

        const estimates = estimateTime(2, tree);
        expect(estimates).toBeTruthy();
        expect(estimates['tdvs']).toBeDefined();
        expect(estimates['buvs']).toBeDefined();
    });

});