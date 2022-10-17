import { TaskTree } from '../model/task.service';
import { estimateTime as tdvs, estimateTree as tdvsRec } from './tdvs';
import { estimateTime as buvs, estimateTree as buvsRec } from './buvs';



export function estimateTime(taskId: number, tree: TaskTree) {
    const eTdvs = tdvs(taskId, tree);
    const eBuvs = buvs(taskId, tree);
    return {
        'tdvs': eTdvs,
        'buvs': eBuvs
    };
}

export interface EstimatedTaskTree extends TaskTree {
    estimates: {
        'tdvs': number,
        'buvs': number,
    },
    children: EstimatedTaskTree[]
}

export function estimateTreeTime(tree: TaskTree): EstimatedTaskTree {
    tree = tdvsRec(tree);
    tree = buvsRec(tree);
    return tree as EstimatedTaskTree;
}




