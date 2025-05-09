import { Database } from "sqlite";
import { TaskService } from "./task.service";

export class KanbanService {

    constructor(private db: Database, private taskSvc: TaskService) {}

    public async init() {

        // create boards
        const boardsTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='kanbanBoards';
        `);
        if (!boardsTable) {
            await this.db.exec(`
                create table kanbanBoards (
                    id              integer primary key autoincrement,
                    parentTaskId    integer not null,
                    title           text    not null,
                    created         Date,
                    completed       Date,
                    foreign key (parentTaskId) references tasks (id)
                );
            `);
        }

        // create columns
        const columnsTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='kanbanColumns';
        `);
        if (!columnsTable) {
            await this.db.exec(`
                create table kanbanColumns (
                    id              integer primary key autoincrement,
                    boardId         integer not null,
                    columnName      text    not null,
                    foreign key (boardId) references kanbanBoards (id)
                );
            `);
        }

        // relate tasks to columns
        const columnContentsTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='kanbanColumnContents';
        `);
        if (!columnContentsTable) {
            await this.db.exec(`
                create table kanbanColumnContents (
                    columnId         integer not null,
                    taskId           integer not null,
                    foreign key (columnId) references kanbanColumns (id),
                    foreign key (taskId) references tasks (id)
                );
            `);
        }
    }


    public async createBoard(parentId: number, title: string, creationTime: number = new Date().getTime(), columnNames: string[] = ["backlog", "busy", "waiting", "done"]) {
        await this.db.run(`
            insert into kanbanBoards (parentTaskId, title, created)
            values ($parentTaskId, $title, $created);
        `, {
            "$parentTaskId": parentId,
            "$title": title,
            "$created": creationTime
        });
        const boardId = await this.taskSvc.getLastInsertId();

        for (const columnName of columnNames) {
            await this.db.run(`
                insert into kanbanColumns (boardId, columnName) 
                values ($boardId, $columnName);
            `, {
                "$boardId": boardId,
                "$columnName": columnName
            });
        }

        const board = await this.getBoard(boardId);
        return board;
    }


    public async getBoard(boardId: number) {
        const boardRow = await this.db.get(`
            select * from kanbanBoards
            where id = $boardId;
        `, {
            '$boardId': boardId
        });
        const columnRows = await this.db.get(`
            select * from kanbanColumns
            where boardId = $boardId;    
        `, {
            "$boardId": boardId
        });
        const taskIds = await this.db.get(`
            select * from kanbanColumnContents
            where 
        `);

        return out;
    }


}