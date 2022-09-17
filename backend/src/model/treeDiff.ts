import { PriorityQueue } from '../utils/datastructures';
import { DbAction, TaskTree } from './task.service';


export function treeDiff(frontendTree: TaskTree, backendTree: TaskTree): number {

    const frontendNode = new TaskTreeNode(frontendTree);
    const backendNode = new TaskTreeNode(backendTree);
    function heuristic(source: Node, target: Node): number {
        throw new Error('Method not implemented.');
    }

    const nrSteps = aStar(backendNode, frontendNode, heuristic);
    return nrSteps;
}


class TaskTreeNode implements Node {

    private pathSoFar: number = undefined;

    constructor(private tree: TaskTree) {}

    /**
     * All possible task trees that can be reached with a `create`, `edit` or `delete` action
     */
    getChildren(): { costToChild: number; child: Node; }[] {
        throw new Error('Method not implemented.');
    }

    /**
     * How different are two trees?
     */
    distanceTo(node: Node): number {
        throw new Error('Method not implemented.');
    }

    setPathSoFar(cost: number): void {
        this.pathSoFar = cost;
    }

    getPathSoFar(): number {
        return this.pathSoFar;
    }

}



interface Node {
    getChildren(): {costToChild: number, child: Node}[],
    distanceTo(node: Node): number,
    setPathSoFar(cost: number): void,
    getPathSoFar(): number | undefined
};

function aStar(source: Node, target: Node, heuristic: (source: Node, target: Node) => number) {
    const pQueue = new PriorityQueue<Node>();
    source.setPathSoFar(0);
    const estimatedFullCosts = 0 + heuristic(source, target);
    pQueue.enqueue(source, -estimatedFullCosts);

    let candidate = pQueue.dequeue();
    while (candidate) {

        // check if target reached
        const distance = source.distanceTo(target);
        if (distance === 0) {
            return candidate.getPathSoFar();
        }

        // if not, look for children to enqueue
        for (const {costToChild, child} of candidate.getChildren()) {
            const costPathToChild = candidate.getPathSoFar()! + costToChild;
            const lastPathToChild = child.getPathSoFar();
            // if node hasn't been looked at yet or the last time we estimated was worse than this time, add it to queue.
            if (!lastPathToChild || costPathToChild < lastPathToChild) {
                child.setPathSoFar(costPathToChild);
                const estimatedFullCosts = costPathToChild + heuristic(child, target);
                pQueue.enqueue(child, -estimatedFullCosts);
            }
        }

        // prepare next step
        candidate = pQueue.dequeue();
    }
}