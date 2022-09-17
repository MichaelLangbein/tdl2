import { TaskTree } from './task.service';


/**
 * Updates backend-tree based on frontend-tree.
 * Every task has a `lastUpdate` field. Always prefers the latest update.
 */
export function treeDiff(frontendTree: TaskTree, backendTree: TaskTree): TaskTree {
    if (frontendTree.id !== backendTree.id) throw Error(`Error in tree-diff. Expects root-ids to always be the same. Got: ${frontendTree.id}/${frontendTree.title}, ${backendTree.id}/${backendTree.title}`);

    if (frontendTree.lastUpdate > backendTree.lastUpdate) {
        backendTree = {
            ... frontendTree,
            children: backendTree.children
        };
    }

    let missingChildIds: number[] = [];
    for (let i = 0; i < backendTree.children.length; i++) {
        const backendChild = backendTree.children[i];
        const frontendChild = frontendTree.children.find(c => c.id === backendChild.id);
        if (!frontendChild) {
            missingChildIds.push(backendChild.id);
        }
        const mergedChild = treeDiff(frontendChild, backendChild);
        backendTree.children[i] = mergedChild;
    }

    let newChildIds: number[] = [];
    for (let i = 0; i < frontendTree.children.length; i++) {
        const frontendChild = frontendTree.children[i];
        const backendChild = backendTree.children.find(c => c.id === frontendChild.id);
        if (!backendChild) {
            newChildIds.push(frontendChild.id);
        }
    }

    return backendTree;
}

