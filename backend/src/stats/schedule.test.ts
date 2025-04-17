import { createSchedule, EstimatedTask } from "./schedule";

describe('schedule', () => {

    test('simple', () => {

        const testTasks: EstimatedTask[] = [{
            task: { id: 1, deadline: Date.now() + 7*60*60*1000, secondsActive: 0, title: "", description: "", completed: undefined, created: undefined, parent: undefined },
            estimate: 2,
        }, {
            task: { id: 2, deadline: Date.now() + 5*60*60*1000, secondsActive: 0, title: "", description: "", completed: undefined, created: undefined, parent: undefined },
            estimate: 3,
        }, {
            task: { id: 3, deadline: Date.now() + 2*60*60*1000, secondsActive: 0, title: "", description: "", completed: undefined, created: undefined, parent: undefined },
            estimate: 2
        }];
        const schedule = createSchedule(testTasks);
        expect(schedule.sequence).toEqual([3, 3, 2, 2, 2, 1, 1]);
    });
})