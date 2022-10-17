import { TaskTree } from '../model/task.service';
import { estimateTime as tdvs } from './tdvs';
import { estimateTime as buvs } from './buvs';



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
    }
}

export function estimateTreeTime(tree: TaskTree): EstimatedTaskTree {

}




