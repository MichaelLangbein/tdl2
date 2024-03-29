import { createDatabase } from '../db/db';
import { Database } from 'sqlite';
import { TaskService } from './task.service';



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


describe("Task service", () => {

    test("create", async () => {
        const task = await ts.createTask("some task", null, 0);
        expect(task).toBeTruthy();
        const taskFetched = await ts.getTask(task.id);
        expect(taskFetched).toBeTruthy();
        if (taskFetched) {
            expect(taskFetched.title).toBe("some task");
        }
    
        const childTask = await ts.createTask("some child task", task.id, 0);
        expect(childTask).toBeTruthy();
        expect(childTask.parent).toBe(task.id);
    });


    test("read", async () => {
        const task = await ts.createTask("some task", null, 0);
        const child = await ts.createTask("child task", task.id, 0);
        const child2 = await ts.createTask("another task", task.id, 0);
        const grandChild = await ts.createTask("grandchild", child.id, 0);

        const tree = await ts.getSubtree(task.id, 1);
        expect(tree).toBeDefined();
        expect(tree!.children[0].title).toBe("child task");
        expect(tree!.children[1].title).toBe("another task");
        expect(tree!.children[0].children.length).toBe(0);
        
        const biggerTree = await ts.getSubtree(task.id, 2);
        expect(biggerTree).toBeDefined();
        expect(biggerTree!.children[0].children.length).toBe(1);

        const subTree = await ts.getSubtree(child.id, 1);
        expect(subTree).toBeDefined();
        expect(subTree!.id).toBe(child.id);
        expect(subTree!.children[0].id).toBe(grandChild.id);
    });


    test("update", async () => {
        const task = await ts.createTask("some task", null, 0);
        task.description = "new description";
        const updatedTask = await ts.updateTask(task);

        expect(updatedTask.description).toBe("new description");
    });


    test("delete", async () => {
        const task = await ts.createTask("base task", null, 0);
        const child1 = await ts.createTask("child1", task.id, 0);
        const child2 = await ts.createTask("child2", task.id, 0);
        const grandChild = await ts.createTask("grandChild", child1.id, 0);
        await ts.deleteTree(child1.id);
        
        const tree = await ts.getSubtree(task.id, 2);
        expect(tree).toBeDefined();
        expect(tree!.children.length).toBe(1);
        expect(tree!.children[0].id).toBe(child2.id);

    });


    test("attachments", async () => {
        const task = await ts.createTask("base task", null, 0);
        await ts.addFileAttachment(task.id, "/some/file/path.txt");
        const tree = await ts.getSubtree(task.id);
        expect(tree).toBeDefined();
        expect(tree!.attachments[0].path).toBe("/some/file/path.txt");
    });

    test("path to subtree", async () => {
        const time = new Date().getTime();
        const baseTask = await ts.createTask("base", null, time);
        const child1 = await ts.createTask("child1", baseTask.id, time);
        const child2 = await ts.createTask("child2", baseTask.id, time);
        const grandChild1 = await ts.createTask("otherGrandChild", child1.id, time);
        const grandChild2 = await ts.createTask("grandChild", child2.id, time);
        const grandGrandChild = await ts.createTask("grandGrandChild", grandChild2.id, time);

        const path = await ts.getSubtreePathTo(grandChild2.id, 1, baseTask.id);
        expect(path).toBeTruthy();
        expect(path!.id).toBe(baseTask.id);
        // should include all direct siblings
        expect(path!.children.length).toBe(2);
        // should include the target-task
        expect(path!.children[1].children[0].id).toBe(grandChild2.id);
        // should include the target-task's children
        expect(path!.children[1].children[0].children[0].id).toBe(grandGrandChild.id);
        // should not include other branches
        expect(path!.children[0].children.length).toBe(0);
    });


    test("search", async () => {
        const time = new Date().getTime();
        const baseTask = await ts.createTask("Title with Alf in it", null, time);
        const child1 = await ts.createTask("", baseTask.id, time);
        const child2 = await ts.createTask("", baseTask.id, time);
        const grandChild = await ts.createTask("Nothing in title", child2.id, time);
        child2.description = 'Alf in description';
        const updatedChild2 = await ts.updateTask(child2);
        grandChild.description = 'Ralf in description';
        const updatedGrand = await ts.updateTask(grandChild);

        const hits = await ts.search('Alf');
        expect(hits.length).toBe(3);
    });

});



