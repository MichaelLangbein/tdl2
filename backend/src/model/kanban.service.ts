import { Database } from "sqlite";
import { TaskRow, TaskService } from "./task.service";

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
                    title           text    not null,
                    created         Date,
                    completed       Date
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


    public async listBoards() {
        return this.db.all(`
            select b.id, b.title from kanbanBoards
        `);
    }


    public async createBoard(title: string, creationTime: number = new Date().getTime(), columnNames: string[] = ["backlog", "busy", "waiting", "done"]) {
        await this.db.run(`
            insert into kanbanBoards (title, created)
            values ($title, $created);
        `, {
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


    public async getBoard(boardId: number): Promise<KanbanBoard> {
        const boardRows = await this.db.all(`
            select b.id as boardId, b.created, b.completed, c.columnName, d.taskId
            from kanbanBoards as b
            join kanbanColumns as c on c.boardId = b.id
            join kanbanColumnContents as d on d.columnId = c.id
            where b.id = $boardId;
        `, {
            '$boardId': boardId
        });
        
        if (boardRows.length <= 0) throw Error(`No such Kanban-board with id ${boardId}`);

        const title = boardRows[0].title;
        const created = boardRows[0].created;
        const completed = boardRows[0].completed;
        const columnIds = unique(boardRows.map(br => br.columnId));

        const taskIds = boardRows.map(r => r.taskId);
        const taskRows = await this.taskSvc.getTasks(taskIds);
        const board: KanbanBoard = {
            boardId, title, completed, created,
            columns: []
        }

        for (const columnId of columnIds) {
            board.columns.push({
                id: columnId, name: "", tasks: []
            })
        }

        for (const boardRow of boardRows) {
            const columnId = boardRow.columnId;
            const columnName = boardRow.columnName;
            const taskId = boardRow.taskId;
            const taskRow = taskRows.find(tr => tr.id === taskId);
            
            const boardColumnData = board.columns.find(c => c.id = columnId);
            boardColumnData.name = columnName;
            boardColumnData.tasks.push(taskRow);
        }

        return board;
    }


    public async moveTaskToColumn(boardId: number, taskId: number, sourceColumnId: number, targetColumnId: number): Promise<KanbanBoard> {
        await this.db.run(`
                update kanbanColumnContents 
                set columnId = $targetColumnId
                where columnId = $sourceColumnId and taskId = $taskId
            `, {
                "$taskId": taskId,
                "$sourceColumnId": sourceColumnId,
                "$targetColumnId": targetColumnId
            });
        return this.getBoard(boardId);
    }


    public async completeBoard(boardId: number, completedTimestamp: number) {
        await this.db.run(`
            update kanbanBoards
            set completed = $completed
            where boardId = $boardId
        `, {
            "$boardId": boardId,
            "$completed": completedTimestamp
        });
        return this.getBoard(boardId);
    }


    public async addTask(boardId: number, columnId: number, taskId: number) {
        await this.db.run(`
            insert into kanbanColumnContents (columnId, taskId)
            values ($columnId, $taskId);
        `, {
            "$columnId": columnId,
            "$taskId": taskId,
        });
        return this.getBoard(boardId);
    }


    public async removeTask(boardId: number, taskId: number, columnId: number) {
        await this.db.run(`
            delete from kanbanColumnContents
            where columnId = $columnId and taskId = $taskId;
        `, {
            "$columnId": columnId,
            "$taskId": taskId
        });
        return this.getBoard(boardId);
    }

    public async addColumn(boardId: number, columnName: string) {
        await this.db.run(`
            insert into kanbanColumns (boardId, columnName)
            values ($boardId, $columnName)
        `, {
            "$boardId": boardId, 
            "$columnName": columnName
        });
        return this.getBoard(boardId);
    }


    public async renameColumn(boardId: number, columnId: number, newName: string) {
        await this.db.run(`
            update kanbanColumns
            set name = $newName
            where columnId = $columnId
        `, {
            "$columnId": columnId,
            "$newName": newName
        });
        return this.getBoard(boardId);
    }


    public async removeColumn(boardId: number, columnId: number) {
        await this.db.run(`
            delete from kanbanColumns
            where columnId = $columnId
        `, {
            "$columnId": columnId
        });
        return this.getBoard(boardId);
    }
}

export interface KanbanBoard {
    boardId: number,
    title: string,
    created: Date,
    completed: Date,
    columns: KanbanColumn[]
}

export interface KanbanColumn {
    id: number,
    name: string,
    tasks: TaskRow[]
}


function unique<T>(lst: T[]): T[] {
    const set = new Set(lst);
    return [... set];
}