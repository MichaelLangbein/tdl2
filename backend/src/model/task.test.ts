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
        const task = await ts.createTask("some task", "", null, null);
        expect(task).toBeTruthy();
        const taskFetched = await ts.getTask(task.id);
        expect(taskFetched).toBeTruthy();
        if (taskFetched) {
            expect(taskFetched.title).toBe("some task");
        }
    
        const childTask = await ts.createTask("some child task", "", task.id, null);
        expect(childTask).toBeTruthy();
        expect(childTask.parent).toBe(task.id);
    });


    test("read", async () => {
        const task = await ts.createTask("some task", "", null, null);
        const child = await ts.createTask("child task", "", task.id, null);
        const child2 = await ts.createTask("another task", "", task.id, null);
        const grandChild = await ts.createTask("grandchild", "", child.id, null);

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
        const task = await ts.createTask("some task", "", null, null);
        task.description = "new description";
        const updatedTask = await ts.updateTask(task.id, task.title, task.description, task.parent, task.secondsActive, null, null, null);

        expect(updatedTask.description).toBe("new description");
    });


    test("delete", async () => {
        const task = await ts.createTask("base task", "", null, null);
        const child1 = await ts.createTask("child1", "", task.id, null);
        const child2 = await ts.createTask("child2", "", task.id, null);
        const grandChild = await ts.createTask("grandChild", "", child1.id, null);
        await ts.deleteTree(child1.id);
        
        const tree = await ts.getSubtree(task.id, 2);
        expect(tree).toBeDefined();
        expect(tree!.children.length).toBe(1);
        expect(tree!.children[0].id).toBe(child2.id);

    });


    test("attachments", async () => {
        const task = await ts.createTask("base task", "", null, null);
        await ts.addFileAttachment(task.id, "/some/file/path.txt");
        const tree = await ts.getSubtree(task.id);
        expect(tree).toBeDefined();
        expect(tree!.attachments[0].path).toBe("/some/file/path.txt");
    });

    test("path to subtree", async () => {
        const baseTask = await ts.createTask("base", "", null, null);
        const child1 = await ts.createTask("child1", "", baseTask.id, null);
        const child2 = await ts.createTask("child2", "", baseTask.id, null);
        const grandChild1 = await ts.createTask("otherGrandChild", "", child1.id, null);
        const grandChild2 = await ts.createTask("grandChild", "", child2.id, null);
        const grandGrandChild = await ts.createTask("grandGrandChild", "", grandChild2.id, null);

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
        const baseTask = await ts.createTask("Title with Alf in it", "", null, null);
        const child1 = await ts.createTask("", "Description with Alf in it", baseTask.id, null);
        const child2 = await ts.createTask("", "Descralf with the searchterm in it", baseTask.id, null);
        const grandChild = await ts.createTask("Nothing in title", "Nothing in description", child2.id, null);

        const hits = await ts.search('Alf');
        expect(hits.length).toBe(3);
    });

});



