import { TaskRow, TaskService, TaskTree } from "../model/task.service";
import { estimateTime } from "./estimates";
import { Workdays } from "./weekdays";


export interface EstimatedTask {
    task: TaskRow;
    estimatedHours: number;
}

function createPermutations(tasks: EstimatedTask[]) {
    const sequences: number[][] = [];
    for (const task of tasks) {
        if (task.estimatedHours > 0) {
            const baseSequence = [task.task.id];
            task.estimatedHours -= 1;
            const childSequences = createPermutations(tasks);
            task.estimatedHours += 1;
            if (childSequences.length === 0) {
                sequences.push(baseSequence);
            } else {
                for (const childSequence of childSequences) {
                    const newSequence = [...baseSequence, ...childSequence];
                    sequences.push(newSequence);
                }
            }
        }
    }
    return sequences;
}


function calculateLoss(sequence: number[], tasks: EstimatedTask[]) {
    let totalLoss = 0;

    // for each task, calculate work done and time left
    for (const task of tasks) {
        let remainingWorkHours = task.estimatedHours;
        const deadline = task.task.deadline;
        // @TODO: account for non-working hours
        const workingHoursToDeadline = Math.round(Workdays.getWorkingHoursUntil(deadline));
        let taskFinishedAtHour = -1;
        for (let i = 0; i < sequence.length; i++) {
            const taskId = sequence[i];
            if (taskId === task.task.id) {
                remainingWorkHours -= 1;
                taskFinishedAtHour = i + 1;
            }
        }
        const timeLeft = Math.max(workingHoursToDeadline - taskFinishedAtHour, 0);
        const timeOverdue = Math.max(taskFinishedAtHour - workingHoursToDeadline, 0);

        totalLoss += remainingWorkHours * 3;      // there should be no work left to do 
        totalLoss += timeOverdue * 3;             // we shouldn't be late
        totalLoss - timeLeft;                     // its nice to be done before the deadline
    }

    // for full sequence, calculate context switches
    let contextSwitches = 0;
    for (let i = 1; i < sequence.length - 1; i++) {
        const taskId = sequence[i];
        const prevTaskId = sequence[i - 1];
        if (taskId !== prevTaskId) {
            contextSwitches += 1;
        }
    }
    totalLoss += contextSwitches;

    return totalLoss;
}


/**
 * Go through all possible permutations of tasks and find the one with the least loss.
 * This is a brute-force solution and is not optimal for large number of tasks.
 */
export function getOptimalSchedule(upcomingEstimated: EstimatedTask[]) {
    const bestSolution: {sequence: number[], loss: number} = { sequence: [], loss: Infinity };
    const sequences = createPermutations(upcomingEstimated);
    for (const sequence of sequences) {
        const loss = calculateLoss(sequence, upcomingEstimated);
        if (loss < bestSolution.loss) {
            bestSolution.sequence = sequence;
            bestSolution.loss = loss;
        }
    }

    const bestSolutionDated = [];
    let hour = 0;
    for (const taskId of bestSolution.sequence) {
        hour += 1;
        const date = Workdays.getWorkingDateNHoursFromNow(hour);
        bestSolutionDated.push({taskId, date});
    }
    
    return {
        sequence: bestSolutionDated,
        loss: bestSolution.loss,
    };
}



/**
 * Estimate the optimal schedule for upcoming tasks based on their deadlines and active time.
 * This is a greedy solution using least-slack-time-first approach.
 */
export function estimateOptimalSchedule(upcomingEstimated: EstimatedTask[]) {
    const now = new Date().getTime();
    const upcomingEstimatedWithSlackTime = upcomingEstimated.map((task) => {
        const slack = task.task.deadline - now - task.task.secondsActive * 1000;
        return {...task, slackTime: slack};
    });
    const sortedTasks = upcomingEstimatedWithSlackTime.sort((a, b) => a.slackTime - b.slackTime);

    const bestSolutionDated = [];
    let hour = 0;
    for (const task of sortedTasks) {
        for (let i = 0; i < Math.round(task.estimatedHours); i++) {
            hour += 1;
            const date = Workdays.getWorkingDateNHoursFromNow(hour);
            bestSolutionDated.push({taskId: task.task.id, date});
        }
    }
    return bestSolutionDated;
}

function fullTime(node: TaskTree) {
    let time = node.secondsActive;
    for (const child of node.children) {
        time += fullTime(child);
    }
    return time;
}


function findTaskSubtree(task: TaskRow, fullTree: TaskTree): TaskTree {
    if (fullTree.id === task.id) return fullTree;
    for (const child of fullTree.children) {
        const found = findTaskSubtree(task, child);
        if (found) return found;
    }
    return null;
}

function isInTree(taskId: number, tree: TaskTree) {
    if (tree.id === taskId) return true;
    for (const child of tree.children) {
        if (isInTree(taskId, child)) return true;
    }
    return false;
}


export async function estimateUpcomingTasks(taskService: TaskService): Promise<EstimatedTask[]> {
    const upcoming = await taskService.upcoming();
    const fullTree = await taskService.getSubtree(1, 30, true);
    if (!fullTree) return [];

    const upcomingEstimated: EstimatedTask[] = upcoming.map((task) => {
        const taskTree = findTaskSubtree(task, fullTree);
        const totalActiveSeconds = fullTime(taskTree);
        const totalActiveHours = Math.round(totalActiveSeconds / 3600);
        const allEstimates = estimateTime(task.id, fullTree);
        const meanEstimateSeconds = (allEstimates.buvs + allEstimates.tdvs) / 2;
        const meanEstimateHours = Math.round(meanEstimateSeconds / 3600);
        return {task, estimatedHours: meanEstimateHours - totalActiveHours};
    });

    // removing doubly counted time from task-children
    for (const task of upcomingEstimated) {
        const taskTree = findTaskSubtree(task.task, fullTree);
        for (const otherTask of upcomingEstimated) {
            if (task.task.id === otherTask.task.id) continue;
            if (isInTree(otherTask.task.id, taskTree)) {
                task.estimatedHours -= otherTask.estimatedHours;
            }
        }
    }

    return upcomingEstimated;
}
