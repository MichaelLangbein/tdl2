import { TaskRow } from "../model/task.service";
import { Workdays } from "./weekdays";


export interface EstimatedTask {
    task: TaskRow;
    estimate: number;
}

function createPermutations(tasks: EstimatedTask[]) {
    const sequences: number[][] = [];
    for (const task of tasks) {
        if (task.estimate > 0) {
            const baseSequence = [task.task.id];
            task.estimate -= 1;
            const childSequences = createPermutations(tasks);
            task.estimate += 1;
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
        let remainingWorkHours = task.estimate;
        const deadline = task.task.deadline;
        // @TODO: account for non-working hours
        const workingHoursToDeadline = Workdays.getWorkingHoursUntil(deadline);
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


export function createSchedule(upcomingEstimated: EstimatedTask[]) {
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
    
    bestSolution.sequence = bestSolutionDated;
    return bestSolution;
}
