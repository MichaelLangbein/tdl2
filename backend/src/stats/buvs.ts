import { TaskTree } from '../model/task.service';
import { Queue } from '../utils/datastructures';
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
    if (node.level < 0) {
        // ... return best estimate from last level that does have data
        return timesOnLevels[0].conditionalExpectation(node.children.length);
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
    const fakeChild: LeveledTaskTree = {id: -99999, level: node.level + 1, secondsActive: 0, children: [], title: "", description: "", attachments: [], parent: node.id, created: 1, completed: null, deadline: null};
    const expectedTimeNewChild = estimate(fakeChild, timesOnLevels, childrenOnLevels);
    const expectedTimeExpectedChildren = expectedNrChildren * expectedTimeNewChild;

    // returning sum of the above
    return expectedTimeSelf + expectedTimeChildren + expectedTimeExpectedChildren;
}







function addLevelInfo(tree: TaskTree, level: number): LeveledTaskTree {
    (tree as LeveledTaskTree).level = level;
    for (const child of tree.children) {
        addLevelInfo(child, level - 1);
    }
    return tree as LeveledTaskTree;
}



function readParas(node: LeveledTaskTree) {
    const timesOnLevelRaw: {[level: number]: number[]} = {};
    const childrenOnLevelRaw: {[level: number]: number[]} = {};

    let current = node;
    const queue = new Queue<LeveledTaskTree>(1000);

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

    for (let level = 0; level <= maxLevel; level++) {
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

function getTreeDepth(tree: TaskTree) {
    let maxDepth = 0;
    for (const child of tree.children) {
        const depth = getTreeDepth(child);
        if (depth > maxDepth) maxDepth = depth;
    }
    return maxDepth;
}


export function estimateTime(taskId: number, tree: TaskTree) {
    const maxLevel = getTreeDepth(tree);
    const leveledTree = addLevelInfo(tree, maxLevel);
    if (countCompletedNodes(leveledTree) < 1) return 0;
    const { timesOnLevels, childrenOnLevels } = estimateDistributions(leveledTree);
    const target = getNodeWithId(taskId, leveledTree)!;
    const e = estimate(target, timesOnLevels, childrenOnLevels);
    return e;
}