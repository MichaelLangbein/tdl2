import { TaskTree } from '../model/task.service';
import { Queue } from '../utils/datastructures';
import { EstimatedTaskTree } from './estimates';
import { ExponentialDistribution } from './stats.utils';



interface LeveledTaskTree extends TaskTree {
    level: number,
    children: LeveledTaskTree[]
}

type levelTimeDists = {[level: number]: ExponentialDistribution};
type levelChildDists = {[level: number]: ExponentialDistribution};





function estimate(node: LeveledTaskTree, timesOnLevels: levelTimeDists, childrenOnLevels: levelChildDists): number {
    // if we already know the answer, return it.
    if (node.completed) return fullTime(node);

    // if we're outside the range of available data ...
    if (!timesOnLevels[node.level]) {
        // ... return best estimate from last level that does have data
        let l = node.level - 1;
        while (!timesOnLevels[l] && l > 0) {
            l -= 1;
        }
        if (l > 0) {
            node.level = l;
            return estimate(node, timesOnLevels, childrenOnLevels);
        } else {
            return 0;
        }
    }

    // time required for task itself
    const distTimeSelf = timesOnLevels[node.level];
    const expectedTimeSelf = distTimeSelf.conditionalExpectation(node.secondsActive);

    // time required for already existing children
    let expectedTimeChildren = 0;
    for (const child of node.children) {
        expectedTimeChildren += estimate(child, timesOnLevels, childrenOnLevels);
    }

    // time required for potential new children
    const distChildren = childrenOnLevels[node.level];
    const expectedNrChildren = distChildren.conditionalExpectation(node.children.length);
    const fakeChild: LeveledTaskTree = {id: -99999, level: node.level - 1, secondsActive: 0, children: [], title: "", description: "", attachments: [], parent: node.id, created: 1, completed: null, deadline: null};
    const expectedTimeNewChild = estimate(fakeChild, timesOnLevels, childrenOnLevels);
    const expectedTimeExpectedChildren = expectedNrChildren * expectedTimeNewChild;

    // returning sum of the above
    return expectedTimeSelf + expectedTimeChildren + expectedTimeExpectedChildren;
}







function addLevelInfo(tree: TaskTree): number {
    let maxChildLevel = 0;
    for (const child of tree.children) {
        const childLevel = addLevelInfo(child);
        if (childLevel > maxChildLevel) maxChildLevel = childLevel;
    }
    (tree as LeveledTaskTree).level = maxChildLevel + 1;
    return (tree as LeveledTaskTree).level;
}



function readParas(node: LeveledTaskTree) {
    const timesOnLevelRaw: {[level: number]: number[]} = {};
    const childrenOnLevelRaw: {[level: number]: number[]} = {};

    let current = node;
    const queue = new Queue<LeveledTaskTree>();

    while (current) {
        current.children.map(c => queue.enqueue(c));

        if (current.completed) {
            if (!timesOnLevelRaw[current.level]) timesOnLevelRaw[current.level] = [];
            timesOnLevelRaw[current.level].push(current.secondsActive);
            if (!childrenOnLevelRaw[current.level]) childrenOnLevelRaw[current.level] = [];
            childrenOnLevelRaw[current.level].push(current.children.length);
        }

        current = queue.dequeue()!;
    }

    return { timesOnLevelRaw, childrenOnLevelRaw }; 
}

function estimateDistributions(node: LeveledTaskTree) {
    const { timesOnLevelRaw, childrenOnLevelRaw } = readParas(node);

    const timesOnLevels: {[level: number]: ExponentialDistribution} = {};
    const childrenOnLevels: {[level: number]: ExponentialDistribution} = {};

    const maxLevel = Math.max(... Object.keys(timesOnLevelRaw).map(v => +v));
    const allTimes = Object.values(timesOnLevelRaw).reduce((carry, current) => carry.concat(current), []);
    const allChildren = Object.values(childrenOnLevelRaw).reduce((carry, current) => carry.concat(current), []);

    for (let level = 1; level <= maxLevel; level++) {
        let rawTimes = timesOnLevelRaw[level];
        let rawChildren = childrenOnLevelRaw[level];
        // if no data found, use global means
        if (!rawTimes) rawTimes = allTimes;
        if (!rawChildren) rawChildren = allChildren;

        timesOnLevels[level] = new ExponentialDistribution();
        timesOnLevels[level].estimateParas(rawTimes);
        childrenOnLevels[level] = new ExponentialDistribution();
        childrenOnLevels[level].estimateParas(rawChildren);
    }

    return {timesOnLevels, childrenOnLevels};
}


function fullTime(node: LeveledTaskTree) {
    let time = node.secondsActive;
    for (const child of node.children) {
        time += fullTime(child);
    }
    return time;
}

function getNodeWithId(id: number, tree: LeveledTaskTree): LeveledTaskTree | undefined {
    if (tree.id === id) return tree;
    for (const child of tree.children) {
        const node = getNodeWithId(id, child);
        if (node) return node;
    }
    return undefined;
}

function countCompletedNodes(tree: LeveledTaskTree) {
    let count = 0;
    if (tree.completed) count += 1;
    for (const child of tree.children) {
        count += countCompletedNodes(child);
    }
    return count;
}



/**

                    ┌───┐
                    │ 4 │
                    └┬─┬┘
                     │ │
              ┌───┐◄─┘ └─►┌───┐
              │ 3 │       │ 1 │
              └┬─┬┘       └───┘
               │ │
       ┌───┐◄──┘ └──► ┌───┐
       │ 2 │          │ 1 │
       └┬─┬┘          └───┘
        │ │
┌───┐◄──┘ └──►┌───┐
│ 1 │         │ 1 │
└───┘         └───┘

 */
export function estimateTime(taskId: number, tree: TaskTree) {
    const maxLevel = addLevelInfo(tree);
    const leveledTree = tree as LeveledTaskTree;
    if (countCompletedNodes(leveledTree) < 1) return 0;
    const { timesOnLevels, childrenOnLevels } = estimateDistributions(leveledTree);
    const target = getNodeWithId(taskId, leveledTree)!;
    const e = estimate(target, timesOnLevels, childrenOnLevels);
    return e;
}



export function estimateTree(tree: TaskTree): EstimatedTaskTree {

    function memo(f) {
        const cache = {};
        function memoized(target: EstimatedTaskTree, timesOnLevels, childrenOnLevels) {
            if (cache[target.id]) return cache[target.id];
            const estimate = f(target, timesOnLevels, childrenOnLevels);
            cache[target.id] = estimate;
            return estimate;
        }
        return memoized;
    }
    //@ts-ignore
    estimate = memo(estimate);

    function estimateRecursive(tree: LeveledTaskTree, timesOnLevels, childrenOnLevels): EstimatedTaskTree {
        for (let i = 0; i < tree.children.length; i++) {
            (tree as any).children[i] = estimateRecursive(tree.children[i], timesOnLevels, childrenOnLevels);
        }
        if (!(tree as any).estimates) {
            (tree as any).estimates = {};
        }
        (tree as any).estimates['buvs'] = estimate(tree, timesOnLevels, childrenOnLevels);
        return tree as any;
    }


    const maxLevel = addLevelInfo(tree);
    const leveledTree = tree as LeveledTaskTree;
    const { timesOnLevels, childrenOnLevels } = estimateDistributions(leveledTree);

    const estimatedTree = estimateRecursive(leveledTree, timesOnLevels, childrenOnLevels);
    return estimatedTree;
}
