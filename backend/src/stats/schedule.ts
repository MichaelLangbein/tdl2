import { TaskRow } from "../model/task.service";


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
        let remainingHours = task.estimate;
        const deadline = task.task.deadline;
        // @TODO: account for non-working hours
        const hoursToDeadline = deadline - Date.now() / 1000 / 3600;
        let taskFinishedAtHour = -1;
        for (let i = 0; i < sequence.length; i++) {
            const taskId = sequence[i];
            if (taskId === task.task.id) {
                remainingHours -= 1;
                taskFinishedAtHour = i + 1;
            }
        }
        const timeLeft = Math.max(hoursToDeadline - taskFinishedAtHour, 0);
        const timeOverdue = Math.max(taskFinishedAtHour - hoursToDeadline, 0);

        totalLoss += remainingHours * 3;
        totalLoss += timeOverdue * 3;
        totalLoss - timeLeft;
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
    return bestSolution;
    // TODO: convert sequence back to datetimes, accounting for non-working hours.
  }
  
  