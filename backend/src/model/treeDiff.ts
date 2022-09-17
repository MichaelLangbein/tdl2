import { TaskTree } from './task.service';



export interface DbAction {
    /**
     * - *create*
     * - *update*
     *   - update also includes *move*s (change to parent-property) and *delete*s (setting deleted-property)
     */
    type: 'create' | 'update',
    args: any
}

/**
 * Updates backend-tree based on frontend-tree.
 * Every task has a `lastUpdate` field. Always prefers the latest update.
 */
export function treeDiff(frontendTree: TaskTree, backendTree: TaskTree): DbAction[] {
    if (frontendTree.id !== backendTree.id) throw Error(`Error in tree-diff. Expects root-ids to always be the same. Got: ${frontendTree.id}/${frontendTree.title}, ${backendTree.id}/${backendTree.title}`);

    const actions: DbAction[] = [];

    if (frontendTree.lastUpdate > backendTree.lastUpdate) {
        actions.push({
            type: 'update',
            args: {
                taskId: backendTree.id,
                values: frontendTree
            }
        })
    }

    const frontendChildIds = frontendTree.children.map(c => c.id);
    const backendChildIds = backendTree.children.map(c => c.id);
    const commonChildIds: number[] = listIntersection(frontendChildIds, backendChildIds);
    const newChildIds: number[] = listExcept(frontendChildIds, commonChildIds);
    // const oldChildIds: number[] = listExcept(backendChildIds, commonChildIds);

    for (const childId of commonChildIds) {
        const backendChild = backendTree.children.find(c => c.id === childId)!;
        const frontendChild = frontendTree.children.find(c => c.id === childId)!;
        const furtherActions = treeDiff(frontendChild, backendChild);
        actions.push(... furtherActions);
    }

    for (const childId of newChildIds) {
        const frontendChild = frontendTree.children.find(c => c.id === childId)!;
        const foundBackendChild = findInTree(childId, backendTree);
        if (foundBackendChild) {
            const furtherActions = treeDiff(frontendChild, foundBackendChild);
            actions.push(...furtherActions);
        } else {
            actions.push({
                type: 'create',
                args: frontendChild
            });
        }

    }

    // NO NEED TO HANDLE `oldChildIds`.
    // for missingChild in missingChildren:
    //     if not findInFullTree(missingChild, newTree):
    //         # edits += f"remove/{missingChild.id}"
    //         # Not necessary: backend can have items that the frontend doesn't know about, because we lazy load.
    //     else:
    //         # Else: node is somewhere else in newTree. 
    //         # There it will be listed as a `newChild`; so no need to handle that case here.
    //         continue

    return actions;
}



function findInTree(id: number, tree: TaskTree): TaskTree | undefined {
    if (tree.id === id) return tree;
    for (const child of tree.children) {
        const found = findInTree(id, child);
        if (found) return found;
    }
}


function listIntersection(l1: number[], l2: number[]): number[] {
    const intersection: number[] = [];
    for (const i1 of l1) {
        for (const i2 of l2) {
            if (i1 === i2) {
                intersection.push(i1);
                break;
            }
        }
    }
    return intersection;
}

function listExcept(list: number[], expect: number[]): number[] {
    const remainder: number[] = [];
    for (const i of list) {
        let  insert = true;
        for (const e of expect) {
            if (i === e) {
                insert = false;
                break;
            }
        }
        if (insert) {
            remainder.push(i);
        }
    }
    return remainder;
}

