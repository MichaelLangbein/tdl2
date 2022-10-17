import { TaskTree } from "../model/task.service";
import { estimateTree } from './buvs';


describe('buvs', () => {

    test('recursive', () => {

        const tree: TaskTree = {
            id: 0,
            parent: null,
            created: 1, completed: null, secondsActive: 100, deadline: null,
            attachments: [], description: "", title: "",
            children: [{
                id: 1,
                parent: 0, 
                created: 1, completed: 1, deadline: null,
                secondsActive: 75,
                children: [],
                attachments: [], description: "", title: "",
            }, {
                id: 2,
                parent: 0,
                created: 1, completed: null, deadline: null,
                secondsActive: 60,
                description: "", title: "",
                attachments: [],
                children: [{
                    id: 3,
                    parent: 2,
                    secondsActive: 10,
                    created: 1, completed: 1, deadline: null,
                    children: [],
                    attachments: [],
                    description: "", title: "",
                }]
            }]
        };


        const estimatedTree = estimateTree(tree);
        expect(estimatedTree.estimates.buvs);
        expect(estimatedTree.estimates.buvs).toBeGreaterThan(0.0);
        expect(estimatedTree.children[0].estimates.buvs).toEqual(estimatedTree.children[0].secondsActive);
        expect(estimatedTree.children[1].estimates.buvs).toBeLessThan(estimatedTree.estimates.buvs);
        expect(estimatedTree.children[1].children[0].estimates.buvs).toBeLessThan(estimatedTree.children[1].estimates.buvs);

    })

});