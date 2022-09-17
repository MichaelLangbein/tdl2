import { TaskTree } from '../model/task.service';
import { estimateTime } from './tdvs';


describe("Top-down variable structure", () => {

    test("basics", () => {

        const tree: TaskTree = {
            id: 0,
            parent: null,
            created: 1, completed: null, deleted: null, secondsActive: 100, deadline: null,
            attachments: [], description: "", title: "",
            children: [{
                id: 1,
                parent: 0, 
                created: 1, completed: 1, lastUpdate: 1, deleted: null, deadline: null,
                secondsActive: 75,
                children: [],
                attachments: [], description: "", title: "",
            }, {
                id: 2,
                parent: 0,
                created: 1, completed: null, lastUpdate: 1, deleted: null, deadline: null,
                secondsActive: 60,
                description: "", title: "",
                attachments: [],
                children: [{
                    id: 3,
                    parent: 2,
                    secondsActive: 10,
                    created: 1, completed: 1, lastUpdate: 1, deleted: null, deadline: null,
                    children: [],
                    attachments: [],
                    description: "", title: "",
                }]
            }]
        };
        
        // estimation of already completed task
        const e = estimateTime(1, tree);
        expect(e).toEqual(tree.children[0].secondsActive);

        // estimation of not completed task
        const e2 = estimateTime(0, tree);
        expect(e2).toBeGreaterThan(0.0);
    });

});