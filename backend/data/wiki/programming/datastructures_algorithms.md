# Streaming algorithms


## Sliding window

```ts
class SlidingWindow<T> {
    private index = 0;

    constructor(private data: T[], private range: number) {}
    
    next(): T[] {
        const window = this.data.slice(this.index, this.range);
        this.index += 1;
        return window;
    }
}
```

## Dynamically resizing sliding window

```ts
abstract class DynamicSlidingWindow<T> {
    private index = 0;

    constructor(private data: T[]) {}

    public next(): T[] {
        const window: T[] = [];
        let i = 0;
        let candidate = this.data[this.index + i];
        
        while (this.index + i < this.data.length && !this.breakCondition(window, candidate)) {
            window.push(candidate);
            i += 1;
            candidate = this.data[this.index + i];
        }
        
        this.index += i;
        return window;
    }

    protected abstract breakCondition(window: T[], candidate: T): boolean
}
```

## Queue
```ts
export class Queue<T> {
    private data: T[] = [];

    public enqueue(entry: T) {
        this.data.push(entry);
    }

    public dequeue(): T | undefined {
        return this.data.shift();
    }
}

export class PriorityQueue<T> {
    private data: {[priority: number]: T[]} = {};

    public enqueue(entry: T, priority: number) {
        if (!this.data[priority]) {
            this.data[priority] = [];
        }
        this.data[priority].push(entry);
    }

    public dequeue(): T | undefined {
        const highestPriority = this.getHighestPriority();
        if (highestPriority === -Infinity) return undefined;
        return this.data[highestPriority].shift();
    }

    private getHighestPriority() {
        let highestPrio = -Infinity;
        for (const prio in this.data) {
            if (+prio > highestPrio) {
                if (this.data[prio].length > 0) {
                    highestPrio = +prio;
                }
            }
        }
        return highestPrio;
    }
}
```

```ts
// caterpillar dynamically growing-then-shrinking queue to solve "find subarray where" problems

function findSubarraysAddingUpTo(arr: number[], targetSum: number) {
    const out = [];
    const queue = new Queue();
    for (let i = 0; i < arr.length; i++) {  // caterpillar: move head to right
        queue.enqueue(arr[i]);
        let sum = queue.data.reduce((v, c) => v + c, 0);
        while (sum > targetSum) {  // caterpillar: move tail to right
            queue.dequeue();
            sum = queue.data.reduce((v, c) => v + c, 0);
        }
        if (sum === targetSum) {
            const subArrIndices = [i - queue.data.length, i];
            out.push(subArrIndices);
        }
    }
    return out;
}

```


# Spatial algorithms

## FloodFill
```ts
function floodFill(grid: number[][], sr: number, sc: number, fill: number) {
    const origColor = grid[sc][sr];
    grid[sr][sc] = fill;
    //  doesn't overflow ....   && ... has same color ...          then recurse.
    if (sr > 0                  && grid[sr - 1][sc] === origColor) floodFill(grid, sr - 1, sc, fill);
    if (sr < grid.length - 1    && grid[sr + 1][sc] === origColor) floodFill(grid, sr + 1, sc, fill);
    if (sc > 0                  && grid[sr][sc - 1] === origColor) floodFill(grid, sr, sc - 1, fill);
    if (sc < grid[0].length - 1 && grid[sr][sc + 1] === origColor) floodFill(grid, sr, sc + 1, fill);
}

```

## ScanLine
```ts
function scanLine(polyPoints: Point[]) {
    const xs = polyPoints.map(p => p.x);
    const ys = polyPoints.map(p => p.y);

    // scanning through xs:
    for (const x of xs) {

    }
}
```

## FloodFill vs ScanLine
Basically, ScanLine is the polygon-equivalent of raster's FloodFill.



# Solving recurrence relations

Example:
$$ T_f(N) = T_f(N/2) + g(N) $$
Generally solved with Master-method.
Or by just trying. Here, for example, try $$ T_f(N) = N lg(N) $$ . 

# Sorting algorithms

## Merge sort
Similar to quicksort. 
Where quicksort does `swipe, recurse`, mergesort does `recurse, merge`.

- Runtime: O(n lg n) in worst, best, and average case.
- Memory: 

```ts
function merge(sorted1: any[], sorted2: any[]): any[] {
    const merged: any[] = [];
    let index1 = 0;
    let index2 = 0;
    while (index1 < sorted1.length - 1 && index2 < sorted2.length) {
        const v1 = sorted1[index1];
        const v2 = sorted2[index2];
        if (v1 <= v2) {
            merged.push(v1);
            index1 += 1;
        } else {
            merged.push(v2);
            index2 += 1;
        }
    }
    return merged;
}


function mergeSort(unsorted: any[]): any[] {
    if (unsorted.length <= 1) return unsorted;
    const splitPoint = Math.floor(unsorted.length / 2);
    const unsorted1 = unsorted.slice(0, splitPoint);
    const unsorted2 = unsorted.slice(splitPoint);
    const sorted1 = mergeSort(unsorted1);
    const sorted2 = mergeSort(unsorted2);
    const merged = merge(sorted1, sorted2);
    return merged;
}
```


## Insertion sort
Very good when dealing with almost sorted lists.

- Runtime: worst case: O(n^2), almost sorted: O(n)
- Memory: O(n)  Happens in place.


```ts
function insertionSort(data: any[]): any[] {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < i; j++) {
            if (data[i] < data[j]) {
                insertIBeforeJ(data, i, j);
            }
        }
    }
    return data;
}
```

## Quicksort & quickselect
Has a swipe-phase followed by recursion.
I call it the tinder-sort.

- Runtime: O(n lg n) on average, O(n^2) worst case.
- Memory: Can be made to happen in-place, too.
```ts
function quicksort(list: number[]) {
    const pIndex = Math.floor(Math.random() * list.length);
    const pValue = list[pIndex];
    const smallList = [];
    const largeList = [];
    for (let i = 0; i < list.length; i++) {
        if      (list[i] < pValue) smallList.push(list[i]);
        else if (list[i] > pValue) largeList.push(list[i]);
    }
    const smallListSorted = quicksort(smallList);
    const largeListSorted = quicksort(largeList);
    const listSorted = [...smallListSorted, pValue, ...largeListSorted];
    return listSorted;
}

```
A variant of quicksort doesn't recurse into both sub-lists, but only the smaller one. This can be used to select the $n$ smallest elements.



# Binary and other searches


## Binary search through sorted array

```ts
type CD = (data: number[], l: number, L: number) => -1|0|1;

function binaryFind(data: number[], calcDirection: CD): number {
    const L = data.length;
    const l = Math.floor(L/2);
    const dir = calcDirection(data, l, L);
    
    if (L <= 1 && dir != 0) return -1;
    
    if (dir === 0) {  // hit
        return l;
    } else if (dir < 0) {  // move left
        return binaryFind(data.slice(0, l), calcDirection);
    } else {  // move right
        const i = binaryFind(data.slice(l, L), calcDirection);
        return i === -1 ? i : i + l;
    }
}
```


## BFS and DFS

DFS is usually done with recursion, BFS with a queue.
```ts
interface Node {
    getChildren(): Node[]
}

function dfs(node: Node, predicate: (node: Node) => boolean) {
    if (predicate(node)) {
        return node;
    }
    for (const child of node.getChildren()) {
        const hit = dfs(child, predicate);
        if (hit) return hit;
    }
    return false;
}

function bfs(node: Node, predicate: (node: Node) => boolean) {
    const queue = new Queue<Node>();
    queue.enqueue(node);
    let candidate = queue.dequeue();
    while (candidate) {
        if (predicate(candidate)) return candidate;
        for (const child of candidate.getChildren()) {
            queue.enqueue(child);
        }
        candidate = queue.dequeue();
    }
}
```

## Path finding

Path finding often uses bfs, because dfs tends to try a lot of obviously bad paths at first.
```ts
function findPath(start: Node, target: Node) {
    start.cost = 0;
    const queue = new PriorityQueue(start, node => node.cost);
    while (const candidate = queue.dequeue()) {
        if (candidate === target) return 

        for (const child, pathCost of candidate.children) {
            if (!child.cost || candidate.cost + pathCost < child.cost) {
                child.cost = candidate.cost + pathCost;
                queue.enqueue(child);
            }
        }
    }
}
```

### Dijkstra
- a BFS 
- with a *priority* queue
- where priority is cost from source
https://www.youtube.com/watch?v=EFg3u_E6eHU

```ts
function dijstra(source: Node, target: Node) {
    const pQueue = new PriorityQueue<Node>();
    source.setPathSoFar(0);
    pQueue.enqueue(source, 0);

    let candidate = pQueue.dequeue();
    while (candidate) {

        // check if target reached
        const [xc, yc] = candidate.getCoords();
        const [xt, yt] = target.getCoords();
        if (xc === xt && yc === yt) {
            return candidate.getPathSoFar();
        }

        // if not, look for children to enqueue
        for (const {costToChild, child} of candidate.getChildren()) {
            const costPathToChild = candidate.getPathSoFar()! + costToChild;
            const lastPathToChild = child.getPathSoFar();
            // if node hasn't been looked at yet or the last time we estimated was worse than this time, add it to queue.
            if (!lastPathToChild || costPathToChild < lastPathToChild) {
                child.setPathSoFar(costPathToChild);
                pQueue.enqueue(child, costPathToChild);
            }
        }

        // prepare next step
        candidate = pQueue.dequeue();
    }
}
```

### A*
- a BFS 
- with a priority queue
- where priority is cost from source *+ estimated remaining cost*

```ts
interface Node {
    getChildren(): {costToChild: number, child: Node}[],
    getCoords(): [number, number],
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
        const [xc, yc] = candidate.getCoords();
        const [xt, yt] = target.getCoords();
        if (xc === xt && yc === yt) {
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
```


# Memory manager

```ts

class BinaryTree {}

interface Entry {
    pointer: number,
    size: number
};

class Memory {
    private entries: Entry[];

    // we need to access entries quickly by their space for `malloc`
    // but also by their pointer for `free`.
    // to get both quickly we create two indices on the same data.
    // this is generally a good abstraction when you need to sort the same data by 
    // different criteria: just create multiple indices.

    private pointerIndex: BinaryTree;
    private spaceIndex: BinaryTree;

    public malloc(size: number): number {
        const pointer = this.spaceIndex.getWithMinSize(size);
        const entry: Entry = { pointer, size };
        this.pointerIndex.add(pointer);
        this.spaceIndex.allocated(entry);
    }

    public free(pointer: number) {
        const entry = this.pointerIndex.get(pointer);
        this.pointerIndex.remove(entry.pointer);
        this.spaceIndex.freed(entry);
    }
}

```

# Data-structures

|                | search | insert | remove |
|----------------|--------|--------|--------|
| array          | n      | 1      | n      |
| sorted array   | log(n) | n      | n      |
| linked list    | n      | 1      | n      |
| BST (balanced) | log(n) | log(n) | log(n) |
