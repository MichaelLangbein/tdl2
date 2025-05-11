import { createDatabase } from '../db/db';
import { Database } from 'sqlite';
import { TaskRow, TaskService } from './task.service';
import { KanbanService } from './kanban.service';



let db: Database;
let ts: TaskService;
let ks: KanbanService;
let firstTask: TaskRow;
beforeAll(async () => {
    db = await createDatabase(':memory:');
    ts = new TaskService(db);
    await ts.init();
    ks = new KanbanService(db, ts);
    await ks.init();
    firstTask = await ts.createTask("testtask");
});

afterAll(async () => {
    db.close();
});


describe("Kanban service", () => {

    test("Kanban create board", async () => {
        const title = "testboard";
        const date = new Date().getTime();
        const columns = ["column1", "column2"];
        const board = await ks.createBoard(title, date, columns);

        expect(board.boardId).toBeDefined();
        expect(board.title).toEqual(title);
        expect(board.created).toEqual(date);
        expect(board.columns.map(c => c.name)).toEqual(columns);

        const tasks = board.columns.map(c => c.tasks).flat();
        expect(tasks.length).toEqual(0);

        const firstColumnId = board.columns[0].id;
        const firstTaskId = firstTask.id;
        const updatedBoard = await ks.addTask(board.boardId, firstColumnId, firstTaskId);
        const updatedColumn = updatedBoard.columns.find(c => c.id === firstColumnId);
        expect(updatedColumn.tasks[0].id).toEqual(firstTaskId);
    })

});