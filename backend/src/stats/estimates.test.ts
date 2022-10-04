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

        const time = new Date().getTime();
        const parent = await ts.createTask("parent", null, time);
        const child = await ts.createTask("child", parent.id, time);
        parent.secondsActive = 100;
        await ts.updateTask(parent);
        const tree = await ts.getSubtree(parent.id, 2);

        const estimate = estimateTime(parent.id, tree!);
        expect(estimate).toBeTruthy();
        expect(estimate['tdvs']).toBeDefined();
        expect(estimate['buvs']).toBeDefined();
    });


    test("Return reasonable estimate", async () => {
        const tree: TaskTree = {
            id: 1,
            title: '', description: '', attachments: [],
            created: 1, secondsActive: 10, completed: undefined, deadline: undefined,
            parent: undefined,
            children: [{
                id: 2,
                title: '', description: '', attachments: [],
                created: 10, completed: 110, secondsActive: 100, deadline: undefined,
                parent: 1,
                children: []
            }, {
                id: 3,
                title: '', description: '', attachments: [],
                created: 110, completed: undefined, deadline: undefined,
                secondsActive: 100,  // task-3 has been active as long as task-2 ... so an estimate should say that task-3 should be done soon.
                parent: 1,
                children: []
            }, {
                id: 4,
                title: '', description: '', attachments: [],
                created: 110, completed: undefined,
                secondsActive: 0,  // task-4 has not been active yet ... an estimate should say that task-4 should take about as long as task-2.
                deadline: undefined,
                parent: 1,
                children: []
            }]
        };

        // task-3 has been active as long as task-2 ... so an estimate should say that task-3 should be done soon.
        const estimates3 = estimateTime(3, tree);
        console.log(estimates3)
        expect(estimates3).toBeTruthy();
        expect(estimates3['tdvs']).toBeDefined();
        expect(estimates3['buvs']).toBeDefined();
        expect(estimates3['tdvs']).toBeLessThan(300);
        expect(estimates3['buvs']).toBeLessThan(300);

        // task-4 has not been active yet ... an estimate should say that task-4 should take about as long as task-2.
        const estimates4 = estimateTime(4, tree);
        console.log(estimates4)
        expect(estimates4).toBeTruthy();
        expect(estimates4['tdvs']).toBeDefined();
        expect(estimates4['buvs']).toBeDefined();
        expect(estimates4['tdvs']).toBeCloseTo(tree.children[1].secondsActive);
        expect(estimates4['buvs']).toBeCloseTo(tree.children[1].secondsActive);
    });

});