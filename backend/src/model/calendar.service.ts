import { Database } from 'sqlite';


export interface CalendarRow {
    taskId: number,
    from: number,
    to: number
}


export class CalendarService {

    constructor(private db: Database) {}

    public async init() {
        const calendarTable = await this.db.get(`
            select name from sqlite_master where type='table' and name='calendar';
        `);
        if (!calendarTable) {
            await this.db.exec(`
                create table calendar (
                    taskId  integer primary key,
                    from    Date,
                    to      Date
                );
            `);
        }
    }

    public async getLastActivity(): Promise<CalendarRow> {
        throw new Error(`method 'getLastActivity' not implemented`)
    }
    
    public async pushActivity(taskId: number, secondsActive: number): Promise<CalendarRow> {
        throw new Error(`method 'pushActivity' not implemented`)
    }

    public async scheduleTask(taskId, deadline: number): Promise<CalendarRow> {
        throw new Error(`method 'scheduleTask' not implemented`)
    }
    
    public async updateTask(taskId: number, from: number, to: number): Promise<CalendarRow> {
        throw new Error(`method 'updateTask' not implemented`)
    }

    public async getActivity(from: number, to: number): Promise<CalendarRow[]> {
        throw new Error(`method 'getActivity' not implemented`)
    }
}