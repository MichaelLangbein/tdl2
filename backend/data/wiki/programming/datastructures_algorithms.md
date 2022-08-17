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
class FixedSizeQueue<T> {
    private data: (T | null)[];
    private head = 0;
    
    constructor(n: number) {
        this.data = Array(n).fill(0).map(v => null);
    }

    push(entry: T): T | null {
        this.head = (this.head + 1) % this.data.length;
        const out = this.data[this.head];
        this.data[this.head] = entry;
        return out;
    }
}
```


```ts
class Queue<T> {
    private data: (T | null)[];
    private head = 0;
    private tail = 0;

    constructor(capacity: number) {
        this.data = Array(capacity).fill(0).map(v => null);
    }

    public enqueue(val: T): boolean {
        const location = this.tail;
        if (!this.data[location]) {
            this.data[location] = val;
            this.tail = this.shiftUp(this.tail);
            return true;
        } else {
            return false;
        }
    }

    public dequeue() {
        const location = this.head;
        const data = this.data[location];
        this.data[location] = null;
        this.head = this.shiftUp(location);
        return data;
    }

    private shiftUp(n: number) {
        return (n + 1) % this.data.length;
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
function dfs(node: Node, predicate: (node: Node) => boolean) {
    if (predicate(node)) {
        return node;
    }
    const leftHit = dfs(node.left, predicate);
    if (leftHit) return leftHit;
    const rightHit = dfs(node.right, predicate);
    if (rightHit) return rightHit;

    return false;
}

function bfs(node: Node, predicate: (node: Node) => boolean) {
    const queue = new Queue(node);
    while (const candidate = queue.dequeue()) {
        if (predicate(candidate)) {
            return candidate;
        }
        queue.enqueue(candidate.left);
        queue.enqueue(candidate.right);
    }
}
```

## Path finding

Path finding often uses bfs, because dfs tends to get stuck in wall-corners.
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

## A*
- a BFS 
- with a *priority* queue
- where priority is given through a heuristic

````ts
const 

function aStar(startNode: Node, targetNode: Node, heuristic: (node: Node) => number) {
    startNode.cost = 0;
    const queue = new PriorityQueue(startNode, 0);
    const closedList = [];
    while (const candidate = queue.dequeueMin()) {
        if (candidate === targetNode) return true;
        const nextNodes = except(candidate.children, closedList);
        for (const next of nextNodes) {
            const knownCost = candidate.cost + next.costFrom(candidate);
            const estimatedRemaining = heuristic(next);
            if (queue.contains(next) && )
            next.cost = knownCost;
            queue.enqueue(next, knownCost + estimatedRemaining);
        }
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
