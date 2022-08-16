import { TaskTree } from '../model/taskService';
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