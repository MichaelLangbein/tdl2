import { TaskTree } from "./task.service";



export function filterTree(tree: TaskTree, predicate: (node: TaskTree) => boolean): TaskTree {
    if (!predicate(tree)) return undefined;

    const filteredChildren: TaskTree[] = [];
    for (let i = 0; i < tree.children.length; i++) {
        const child = tree.children[i];
        const filteredChild = filterTree(child, predicate);
        if (filteredChild) filteredChildren.push(filteredChild);
    }

    tree.children = filteredChildren;
    return tree;
}

export function filterToParentNode(ids: number[], fullTree: TaskTree): TaskTree {
    const paths = ids.map(id => getPathTo(id, fullTree));
    
    let i = -1;
    while(allIdentical(paths.map(p => p[i+1]))) {
        i++;
    }

    if (i < 0) return undefined;

    const commonParentId = paths[0][i];
    return getChild(commonParentId, fullTree);
}


function getChild(id: number, tree: TaskTree): TaskTree {
    if (id === tree.id) return tree;
    for (const child of tree.children) {
        const hit = getChild(id, child);
        if (hit) return hit;
    }

}


function getPathTo(id: number, tree: TaskTree): number[] {
    if (tree.id === id) return [id];
    for (const child of tree.children) {
        const path = getPathTo(id, child);
        if (path) {
            return [child.id, ...path];
        }
    }
}

function allIdentical(vals: number[]) {
    const n = vals[0];
    for (const v of vals) {
        if (v !== n) return false;
    }
    return true;
}