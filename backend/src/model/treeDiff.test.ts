import { TaskTree } from './task.service';
import { treeDiff } from './treeDiff';


describe('Tree diff', () => {

    test('Trees are identical', () => {
    
        const frontendTree: TaskTree = {
            id: 1,
            title: '', description: '', attachments: [],
            created: 0, completed: undefined, deadline: undefined, secondsActive: 1000,
            parent: undefined,
            children: [],
        };
    
        const backendTree: TaskTree = { ... frontendTree };
        
        const updatedBackendTree = treeDiff(frontendTree, backendTree);
    
        expect(updatedBackendTree.id).toBe(frontendTree.id);
        expect(updatedBackendTree.children.length).toBe(frontendTree.children.length);
    });

    
    test('Backend missed one edit, one creation, and one deletion', () => {

    });


    test('Backend missed one edit, frontend missed on deletion', () => {

    });
})
