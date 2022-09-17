import { TaskTree } from './task.service';
import { treeDiff } from './treeDiff';


describe('Tree diff', () => {

    test('Trees are identical', () => {
    
        const frontendTree: TaskTree = {
            id: 1,
            title: '', description: '', attachments: [],
            created: 0, completed: undefined, deadline: undefined, secondsActive: 1000, lastUpdate: 1000, deleted: undefined,
            parent: undefined,
            children: [],
        };
    
        const backendTree: TaskTree = { ... frontendTree };
        
        const actions = treeDiff(frontendTree, backendTree);
    
        expect(actions.length).toBe(0);
    });

    
    test('Backend missed one edit, one creation, and one deletion', () => {

    });


    test('Backend missed one edit, frontend missed on deletion', () => {

    });
})
