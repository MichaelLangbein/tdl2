import { Database } from 'sqlite';


export interface TaskTree {
    id: number,
    title: string,
    description: string,
    parent: number | null,
    children: TaskTree[]
    created: number,
    completed: number | null,
    secondsActive: number,
    attachments: FileRow[],
    deadline: number | null,
    lastUpdate: number
}

export interface TaskRow {
    id: number,
    title: string,
    description: string,
    parent: number,
    created: number,
    completed: number | null,
    secondsActive: number,
    deadline: number | null,
    lastUpdate: number
}

export interface FileRow {
    id: number,
    path: string,
    taskId: number
}

export interface DbAction {
    /**
     * - *create*
     * - *update*
     *   - update also includes *move*s (change to parent-property)
     * - *delete*
     * - *file*
     */
    type: 'create' | 'update' | 'delete' | 'addFile',
    args: any
}


export class TaskService {

    // @TODO: use prepared statements

    constructor(private db: Database) {}

    public async init() {
        const tasksTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='tasks';
        `);
        if (!tasksTable) {
            await this.db.exec(`
                create table tasks (
                    id              integer primary key autoincrement,
                    title           text    not null,
                    description     text,
                    parent          integer,
                    created         Date,
                    completed       Date,
                    secondsActive   integer,
                    deadline        Date,
                    lastUpdate      Date
                );
                create index parent_task on tasks(parent);
            `);
            await this.createTask('root');
        }
        const fileTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='files';
        `);
        if (!fileTable) {
            await this.db.exec(`
                create table files (
                    id      integer primary key autoincrement,
                    taskId  integer not null,
                    path    char(500),
                    foreign key (taskId) references tasks (id)
                )
            `);
        }
    }
    
    public async getTask(taskId: number) {
        const result = await this.db.get<TaskRow>(`
            select * from tasks 
                where id = $id;
        `, { 
            '$id': taskId 
        });
        return result;
    }

    
    public async getParent(taskId: number) {
        const task = await this.getTask(taskId);
        if (task) {
            const result = await this.db.get<TaskRow>(`
                select * from tasks where id = $id;
            `, { 
                '$id': task?.parent 
            });
            return result;
        }
    }

    public async getChildIds(taskId: number) {
        const results = await this.db.all<{id: number}[]>(`
            select id from tasks 
                where parent = $parent;
        `, {
            '$parent': taskId
        });
        return results.map(v => v.id);
    }

    public async getLastInsertId() {
        const result = await this.db.get(`SELECT last_insert_rowid()`);
        return result['last_insert_rowid()'];
    }

    public async createTask(title: string = '', parentId: number | null  = null, creationTime: number | null = new Date().getTime()) {
        await this.db.run(`
            insert into tasks (title, parent, created, secondsActive, lastUpdate)
            values ($title, $parent, $created, $secondsActive, $lastUpdate);
        `, {
            "$title": title,
            "$parent": parentId,
            "$created": creationTime,
            "$lastUpdate": creationTime,
            "$secondsActive": 0,
        });
        const id = await this.getLastInsertId();
        const task = await this.getTask(id);
        return task!;
    }
    
    public async updateTask(task: TaskRow, ensureNewestUpdate = true) {

        if (ensureNewestUpdate) {
            const latestState = await this.getTask(task.id);
            if (latestState.lastUpdate > task.lastUpdate) {
                console.error(`Cannot update - There's a newer version of this task in the db: ${task.id}/${task.title}`);
                return latestState;
            }
        }

        await this.db.run(`
            update tasks
            set title = $title,
                description = $description,
                parent = $parent,
                secondsActive = $secondsActive,
                completed = $completed,
                deadline = $deadline,
                lastUpdate = $lastUpdate
            where id = $id;
        `, {
            '$id': task.id,
            '$title': task.title,
            '$description': task.description,
            '$parent': task.parent,
            '$secondsActive': task.secondsActive,
            '$completed': task.completed,
            '$deadline': task.deadline,
            '$lastUpdate': task.lastUpdate
        });
        const updatedTask = await this.getTask(task.id);
        return updatedTask!;
    }

    public async deleteTask(taskId: number) {
        await this.db.run(`
            delete from tasks
            where id = $id;
        `, {
            '$id': taskId
        });
    }


    public async getFileAttachment(fileId: number): Promise<FileRow> {
        const out = await this.db.get(`
            select * from files
            where id = $fileId;
        `, {
            '$fileId': fileId
        });
        return out;
    }

    public async getFileAttachments(taskId: number): Promise<FileRow[]> {
        const out = await this.db.all(`
            select * from files
            where taskId = $taskId;
        `, {
            '$taskId': taskId
        });
        return out;
    }

    public async addFileAttachment(taskId: number, path: string) {
        await this.db.run(`
            insert into files (path, taskId)
            values ($path, $taskId);
        `, {
            '$taskId': taskId,
            '$path': path
        });
    }

    public async deleteFileAttachment(attachmentId: number) {
        await this.db.run(`
            delete from files
            where id = $id;
        `, {
            '$id': attachmentId
        });
    }


    /*-----------------------------------------------------*
     * Higher level methods
     *-----------------------------------------------------*/

    public async getSubtree(id: number, level: number = 0, includeCompleted = false): Promise<TaskTree | undefined> {
        const root = await this.getTask(id);
        if (!root) return undefined;

        const taskTree: TaskTree = {
            ... root,
            attachments: await this.getFileAttachments(id),
            children: []
        };

        if (level > 0) {
            const childIds = await this.getChildIds(id);
            for (const childId of childIds) {
                const childTree = await this.getSubtree(childId, level - 1); // @TODO: do in parallel?
                if (childTree) {
                    if (!childTree!.completed || includeCompleted) {
                        taskTree.children.push(childTree);
                    }
                }
            }
        }
        return taskTree;
    }

    public async getSubtreePathTo(targetTaskId: number, extraDepth: number, startId = 1) {
        // @TODO: maybe better recursive sql-query: https://stackoverflow.com/questions/7456957/basic-recursive-query-on-sqlite3

        if (startId === targetTaskId) return await this.getSubtree(startId, extraDepth);

        const childIds = await this.getChildIds(startId);
        for (const childId of childIds) {
            const subTree = await this.getSubtreePathTo(targetTaskId, extraDepth, childId);
            if (subTree) {
                const tree = await this.getSubtree(startId, 1);
                // tree!.children.push(subTree); <-- this would not include direct siblings of the target's ancestors
                for (let i = 0; i < tree!.children.length; i++) {
                    if (tree!.children[i].id == subTree.id) {
                        tree!.children[i] = subTree;
                    }
                }
                return tree;
            }
        }
    }

    public async deleteTree(taskId: number, recursive=true) {
        if (recursive) {
            const childIds = await this.getChildIds(taskId);
            for (const childId of childIds) {
                await this.deleteTree(childId, recursive);
            }
        }
        this.deleteTask(taskId);
    }


    public async actionQueue(actions: DbAction[]) {
        for (const action of actions) {
            switch (action.type) {
                case 'create':
                    await this.createTask(
                        action.args.title, action.args.parentId, action.args.created);
                case 'update':
                    const updatedRow: TaskRow = action.args;
                    await this.updateTask(updatedRow);
                case 'delete':
                    await this.deleteTask(action.args.id);
                case 'addFile':
                    await this.addFileAttachment(action.args.taskId, action.args.filePath);
                default:
                    console.error(`No such DbAction: ${action.type}`);
            }
        }
    }



    public addAttachment() {
        throw new Error(`Method not implemented: addAttachment`);
    }

    
    public async upcoming() {
        const tasks = await this.db.all<TaskRow[]>(`
            select * from tasks
            where deadline and completed is null
            order by deadline asc;
        `);
        return tasks;
    }

    public async search(searchFor: string, incompleteOnly = false) {
        const tasks = await this.db.all<TaskRow[]>(`
            select * from tasks
            where 
            (title like $searchTerm
            or description like $searchTerm)
            ${ incompleteOnly ? 'and completed is null' : '' }
            collate nocase
            order by deadline asc;
        `, {
            '$searchTerm': '%' + searchFor + '%'
        });
        return tasks;
    }

    public async completionTimes() {
        const data = await this.db.all(`
            select id, title, secondsActive
            from tasks 
            where completed
            order by secondsActive desc;
        `);
        return data;
    }
}