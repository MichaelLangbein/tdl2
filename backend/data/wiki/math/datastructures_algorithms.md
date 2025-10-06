# Asymptotic analysis

Aka. Landau-symbols.

The name _asymptotic_ analysis is well chosen (for once).

-   AA only tells us about the behaviour of algorithms as their numbers become _very_ big.
-   AA deals with the **rate of growth**, not absolute values

Big-oh is the approximate upper bound, little-oh is the next graph _higher_ than that.

## Big Oh

$$ f \in O(g) \iff \exists k: \exists x_0: \forall x > x_0: 0 \leq f(x) \leq kg(x) $$

-   What is meant: $f$'s rate of growth is within that of $g$
-   Explanation: $f$ will always remain within a fixed linear multiplication (\*k) from $g$. $f$ won't ever grow out of the reach of $kg$.

## Little Oh

$$ f \in o(g) \iff \forall k: \exists x_0: \forall x > x_0: 0 \leq f(x) \leq kg(x) $$

-   What is meant: $f$'s rate of growth is a factor smaller than $g$
-   Explanation: we can linearly shrink $g$ as much as we want, but well still never go lower than $f$

## Comparision $O$ and $o$

-   True for big-oh, false for little-oh:
    -   $x^2 \in O(x^2)$
    -   $x^2 \in O(x^2 + x)$
    -   $x^2 \in O(2000 x^2)$
-   True for little-oh (and therefore automatically true for big-oh):
    -   $x^2 \in o(x^3)$
    -   $x^2 \in o(x!)$
    -   $\ln(x) \in o(x)$

## Others

-   Lower bounds: Omega
-   Upper and lower bound: Theta

## Rules for $O$

1. $O( cte * pow ) = O(pow)$
2. $f_1: O(g_1)$ and $f_2: O(g_2)$ then $f_1 + f_2: O(\max(g_1, g_2))$
3. $f_1: O(g_1)$ and $f_2: O(g_2)$ then $f_1 \cdot f_2: O(g_1 \cdot g_2)$
4. $f \cdot O(g) = O(f \cdot g)$
5. $O cte < O \log(x) < O\sqrt{x} < O n < O n\log(x) < O x^{cte} < O 2^x < O x! $

Proof of 1:

> Prove $f \in O(ng) \to f \in O(g)$
>
> > Suppose $f \in O(ng)$.
> >
> > That means $\exists k:  \exists  x_0: \forall x > x_0: 0 \leq f(x) \leq kg(x)n$. Call this $k_0$.
> >
> > > Prove $f \in O(g)$, that, is: $\exists k:  \exists  x_0: \forall x > x_0: 0 \leq f(x) \leq kg(x)$
> > >
> > > Try $k = nk_0$. Rest is trivial.

Partial proof of 2:

> Proof that $f \in O(x^2 + x) \to f \in O(x^2)$
>
> > Suppose $f \in O(x^2 + x)$.
> >
> > That means $\exists k_0:  \exists  x_0: \forall x > x_0: f(x) \leq k_0(x^2 + x)$.
> >
> > > Proof that $f \in O(x^2)$, that is, proof that $\exists k_1: \exists x_0: \forall x > x_0: 0 \leq f(x) \leq x^2$
> > >
> > > Worst case. Assume $f(x) = k_0(x^2 + x)$
> > >
> > > **Inspiration**: try to prove that $f(x) = x + 1$ is $O(x)$.
> > >
> > > Try $k_1 = k_0 + 0.0000001$ ... or for simplicity: try $k_1 = k_0 + 1$.
> > >
> > > > Try $n_1 = k_0$
> > > >
> > > > > Prove that $\forall n > k_0: f(n) \leq k_1 n^2$.
> > > > >
> > > > > That is: $\forall n > k_0: k_0(n^2 + n) \leq (k_0 + 1)n^2 $.
> > > > >
> > > > > Now this is trivial.

## Best, worst, average case

Those have nothing to do with $O$, $\Theta$ or $\Omega$.
For each of those three we can calculate $O$, $\Theta$ or $\Omega$ individually.

So, a thorough analysis would consist of:

-   best case:
    -   $O$
    -   $\Omega$
    -   $\Theta$
-   average:
    -   $O$
    -   $\Omega$
    -   $\Theta$
-   worst case:
    -   $O$
    -   $\Omega$
    -   $\Theta$

# Combinatorics

## Drawing n red balls, m yellow balls and o green balls

```python
# task = {"id": int, "work": int}
def createPermutations(tasks):
    sequences = []
    for task in tasks:
        if task["work"] > 1:
            baseSequence = [task["id"]]
            task["work"] -= 1
            childSequences = createPermutations(tasks)
            if len(childSequences) == 0:
                sequences.append(baseSequence)
            else:
                for childSequence in childSequences:
                    sequences.append(baseSequence + childSequence)
            task["work"] += 1
    return sequences
```

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

    protected abstract breakCondition(window: T[], candidate: T): boolean;
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
    private data: { [priority: number]: T[] } = {};

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
    for (let i = 0; i < arr.length; i++) {
        // caterpillar: move head to right
        queue.enqueue(arr[i]);
        let sum = queue.data.reduce((v, c) => v + c, 0);
        while (sum > targetSum) {
            // caterpillar: move tail to right
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
    if (sr > 0 && grid[sr - 1][sc] === origColor) floodFill(grid, sr - 1, sc, fill);
    if (sr < grid.length - 1 && grid[sr + 1][sc] === origColor) floodFill(grid, sr + 1, sc, fill);
    if (sc > 0 && grid[sr][sc - 1] === origColor) floodFill(grid, sr, sc - 1, fill);
    if (sc < grid[0].length - 1 && grid[sr][sc + 1] === origColor) floodFill(grid, sr, sc + 1, fill);
}
```

## ScanLine

```ts
function scanLine(polyPoints: Point[]) {
    const xs = polyPoints.map((p) => p.x);
    const ys = polyPoints.map((p) => p.y);

    // scanning through xs:
    for (const x of xs) {
    }
}
```

## FloodFill vs ScanLine

Basically, ScanLine is the polygon-equivalent of raster's FloodFill.

## Triangulation: ear-clipping-algorithm

## Triangulation: Delaunay

Different from ear-clipping: produces more evenly shaped triangles, not those narrow, long triangles that ear-clipping tends to produce.

## Creating Voronoi-diagrams

# Solving recurrence relations

## Solving linear recurrences

A homogeneous linear recurrence is one of the following form:

$$f(n) = a_1 f(n-1) + a_2 f(n-2) + ... + a_d f(n-d)$$

We can solve it as follows:

1. Assume $f(n) = x^n$. We now try to find an expression for $x$.
2. Divide both sides in the hlr by $x^{n-d}$, leaving a (hyper-)quadratic equation.
3. Every root of the quadratic equation is a _homogeneous solution_. Also, if a root $r$ occurs $v$ times, $r^n, nr^{n-1}, n^2r^n ..., n^{v-1}r^n$ are also solutions.
4. Also, every linear combination of the above is also a solution. So, a solution might in general have a form like $a r_1^n + b r_2^n + ...$.
5. Finally, choose $a, b, ...$ such that they fulfill the boundary conditions (in Fibonacci those would be $f(0) = f(1) = 1$). This is the _concrete solution_.

We can extend the above schema to also solve (nonhomogeneous) linear recurrences:
$$ f(n) = a_1 f(n-1) + a_2 f(n-2) + ... + a_d f(n-d) + g(n)$$

1. Ignore $g(n)$, find the homogeneous solution from step 4 above.
2. Find a _particular solution_ to the equation including $g(n)$.
3. homogeneous solution + particular solution = _general solution_
4. Now for the general solution, again plug in the boundary conditions as in step 5 above.

# Sorting algorithms

## Merge sort

Similar to quicksort.
Where quicksort does `swipe, recurse`, mergesort does `recurse, merge`.

-   Runtime: O(n lg n) in worst, best, and average case.
-   Memory:

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

-   Runtime: worst case: O(n^2), almost sorted: O(n)
-   Memory: O(n) Happens in place.

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

-   Runtime: O(n lg n) on average, O(n^2) worst case.
-   Memory: Can be made to happen in-place, too.

```ts
function quicksort(list: number[]) {
    const pIndex = Math.floor(Math.random() * list.length);
    const pValue = list[pIndex];
    const smallList = [];
    const largeList = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i] < pValue) smallList.push(list[i]);
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
type CD = (data: number[], l: number, L: number) => -1 | 0 | 1;

function binaryFind(data: number[], calcDirection: CD): number {
    const L = data.length;
    const l = Math.floor(L / 2);
    const dir = calcDirection(data, l, L);

    if (L <= 1 && dir != 0) return -1;

    if (dir === 0) {
        // hit
        return l;
    } else if (dir < 0) {
        // move left
        return binaryFind(data.slice(0, l), calcDirection);
    } else {
        // move right
        const i = binaryFind(data.slice(l, L), calcDirection);
        return i === -1 ? i : i + l;
    }
}
```

## BFS and DFS

DFS is usually done with recursion, BFS with a queue.

```ts
interface Node {
    getChildren(): Node[];
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

-   a BFS
-   with a _priority_ queue
-   where priority is cost from source
    <https://www.youtube.com/watch?v=EFg3u_E6eHU>

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
        for (const { costToChild, child } of candidate.getChildren()) {
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

### A\*

-   a BFS
-   with a priority queue
-   where priority is cost from source _+ estimated remaining cost_

```ts
interface Node {
    getChildren(): { costToChild: number; child: Node }[];
    getCoords(): [number, number];
    setPathSoFar(cost: number): void;
    getPathSoFar(): number | undefined;
}

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
        for (const { costToChild, child } of candidate.getChildren()) {
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

# Diffing

## Longest common subsequence

```ts
/**
 * Example
 *
 *       | s1
 *       |  a  b  c  d  e  f  g
 * ------+-----------------------
 * s2  b |  +  \
 *     f |  +  +  +  +  +  \
 *     f |  +  +  +  +  +  \  +
 *     d |  +  +  +  \  +  +  +
 *     e |  +  +  +  +  \  +  +
 *     f |  +  +  +  +  +  \  +
 */


function lcs(s1: string, s2: string): number {
    if (s1.length === 0 || s2.length === 0) return 0;
    if (s1[0] === s2[0]) {
        // going diagonally down
        return 1 + lcs(s1.substring(1), s2.substring(1));
    } else {
        // going right
        const rightMax = lcs(s1.substring(1), s2);
        // going down
        const bottomMax = lcs(s1, s2.substring(1));
        return Math.max(rightMax, bottomMax);
    }
}

function memoized(f) {
    const cache = {};
    const memed = (s1, s2) => {
        if (cache[s1]?[s2]) return cache[s1][s2];
        if (cache[s2]?[s1]) return cache[s2][s1];
        const result = f(s1, s2);
        if (!cache[s1]) cache[s1] = {};
        cache[s1][s2] = result;
        return result;
    }
    return memed;
}
//@ts-ignore
lts = memoized(lts);
```

## Minimal edit distance

```ts
/**
                    targetString
                    A      B         C         D       E       0 
editableString  A   \
                     \ fits 
                       \   
                         \ add B
                C         +─────► 
                          │         \
                          |rm C       \ fits
                          |              \
                          ▼ add B   add C   \ 
                D         +──────► +─────────►
                          │        │          \
                          │rm D    │ rm D        \  fits
                          │        │                \
                          ▼ add B  ▼ add C     add D  \ add E
                R         +─────►  +───────► +──────► +───────►
                          │        │         │        │       │
                          │rm R    │rm R     │rm R    │rm R   │rm R
                          │        │         │        │       │
                          ▼ add B  ▼ add C   ▼ add D  ▼add E  ▼
                0         +──────► + ──────► + ─────► + ──────►
*/

function med(targetString: string, editableString: string): number {
    if (targetString.length === 0) return editableString.length;
    if (editableString.length === 0) return targetString.length;

    if (targetString[0] === editableString[0]) {
        // going diagonal
        return med(targetString.substring(1), editableString.substring(1));
    } else {
        // inserting targetString[0] before editableString[0]  === going right
        const afterInsert = 1 + med(targetString.substring(1), editableString);
        // removing editableString[0] === going down
        const afterDelete = 1 + med(targetString, editableString.substring(1));
        // picking best
        return Math.min(afterInsert, afterDelete);
    }
}
```

-   Also known as Wagner-Fisher algorithm
-   Run-time: `target.length * source.length`
-   Might want to allow substitutions, too: `const afterSubst = 1 + med(targetString.substring(1), editableString.substring(1));`
-   Then the MED is also known as Levenshtein distance.

## Fuzzy matching

<https://www.cs.helsinki.fi/u/ukkonen/InfCont85.PDF>

## Tree-diff

<https://www.youtube.com/watch?v=6Ur8B35xCj8>
<https://news.ycombinator.com/item?id=15101373>
Notably, trees allow a lot of operations. In dynamic programming we go through all possible operations in a fixed order.
For example, above in `med` we always first explore inserting and second removing.
With only two operations possible that's just fine.
But with trees allowing a lot more operations, we can get much more efficient by using a guided search.
That is, enqueue all possible operations the same way you would in `aStar`.

If , however, tree-nodes have an id, diff'ing gets much simpler, since we know exactly when something is an edit (id already exists) and when nodes have been moved (existing id at new position).

```python
def ted(old, new):
    edits = []
    assert(old.id === new.id)

    if old.val != new.val:
        edits += f"edit/{old.id}/{new.val}"

    matchingChildren = matching(new.children, old.children)
    newChildren = listAllExcept(new.children, old.children)
    missingChildren = listAllExcept(old.children, new.children)

    for (oldChild, newChild) in matchingChildren:
        edits += ted(oldChild, nedChild)

    for newChild in newChildren:
        if childOrig = findInFullTree(newChild, oldTree):
            edits += f"move/{childOrig.id}/{new.id}"
            edits += ted(childOrig, newChild)
        else:
            edits += f"create/{newChild}"

    for missingChild in missingChildren:  # those that were in old but aren't in new
        if not findInFullTree(missingChild, newTree):
            edits += f"remove/{missingChild.id}"
        else:
            # Else: node is somewhere else in newTree.
            # There it will be listed as a `newChild`; so no need to handle that case here.
            continue

    return edits

```

# Memory manager

```ts
class BinaryTree {}

interface Entry {
    pointer: number;
    size: number;
}

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

# Optimization

## Fixed-point iteration

Imagine we want to find an $x$ such that
$$ x = f(x) $$
We first try candidate $x_0$.

$$
    f(x_0) \to x_1, x_1 \neq x_0 \\
    f(x_1) \to x_2, x_2 \neq x_1 \\
    f(x_2) \to x_3, x_3 \approx x_2
$$

How did that work? It's because $f$ is a **contraction**.

A **fixed point** $x_{fix}$ for a function $f: X \to X$ is one where:
$$ f(x*{fix}) = x*{fix} $$

A **contraction** is a function $f: X \to X$ for which:
$$ \forall x_1, x_2: |f(x_1) - f(x_2)| \leq |x_1 - x_2|$$

In words: if we apply $f$ to $x_1$ and $x_2$, then the results will be closer to each other than $x_1$ and $x_2$ were. If we apply $f$ _again_ to $f(x_1)$ and $f(x_2)$, the results will be closer yet.

-   If a function is a contraction, it has at most one fixed point $x_{fix}$.
-   $\forall x \in X: \text{ the series } x, f(x), f(f(x)), f(f(f(x))), ...$ converges to the fixed point $x_{fix}$

Applied to programming, we can replace a recursive calculation ...

```python
def calcA(i):
    return something(calcA(j)) # recursive

A[i] = calcA(i)
```

... with a non-recursive easing-code:

```python
def calcA(Aold):
    return something(Aold) # non-recursive

Anew = [0, 0, 0]
while |Anew - Aold| > e:
    Aold = Anew
    Anew = calcA(Aold)
```

## Simplex gradient descent

Fixed point iteration only works in certain cases and even then is slow. A gradient-descent optimization is often faster at converging.

Problem:
$$ \text{min}\_x f(x) $$
Algorithm:

$$
    \Delta_0 = - \alpha \frac{df}{dx}|x_0  \\
    x_1 = x_0 + \Delta_0
$$

```python
def f(x):
    return 1 - (x[0]-4)**3 + (x[1]-1)**2

def size(v):
    return np.sum(v * v)

def gradDesc(f, x):
    dx1 = np.asarray([0.001, 0.0])
    dx2 = np.asarray([0.0, 0.001])
    alpha = 0.01
    s = 10000
    sMax = 0.001
    while s > sMax:
        fx = f(x)
        grad = np.asarray([
            ( f(x + dx1) - fx ) / dx1[0],
            ( f(x + dx2) - fx ) / dx2[1],
        ])
        x = x - alpha * grad
        s = size(grad)
    return x

gradDesc(f, np.asarray([1, 1]))

```

## Simulated annealing

## Optimization vs dynamic programming

Dynamic programming is all about finding x by determining it from the lowest case up.
That is nicely rigorous, but sometimes we're better off using a different strategy.
Instead of using $f$ to find $x$, we suggest an $x_0$, see if it fits $f$, and iterate.
That is, often we can make dynamic programming faster by turning it into an optimization-problem.
But: contrary to dynamic programming, optimization can get stuck in local minima.

|                     | Computational effort                    | Guaranteed quality               |
| ------------------- | --------------------------------------- | -------------------------------- |
| dynamic programming | Explores (almost) full space            | will find optimum                |
| optimization        | Explores only one (a few) zig-zag paths | might get stuck in local minimum |
|                     |                                         |                                  |

# Databases and indices

The curious case of compound-queries.

Consider this situation.

-   you have a table `table` with columns `a` and `b`, each with an index on it.
-   you want to execute the query `select * from table as t where a=a_0 and b=b_0`
-   what would your execution strategy be?

My first idea was this:

```python
as = db.select('a', a0)               # O(log(n))
out = as.filter(row => row.b == b0)   # O(|as|)
```

... with $n$ being the number of rows in the table.

This is $O(\log(n) + |$`as`$|)$ ... which in the worst case being $|$`as`$|=n$.

Thus $O(\log(n) + n) = O(n)$.

However, this is what postgres does:

```
r1 = query index on a for a0
r2 = query index on b for b0
out = bitmap-and on r1, r2
```

I was very confused, because I thought that meant:

```python
as = db.select('a', a0)  # O(log(n))
bs = db.select('b', b0)  # O(log(n))
out = bitmapAnd(as, bs)  # probably requires a merge, so kinda like merge-sort and thus O(n * log(n)) ?!
```

This would have meant that postgres did something that was $O(\log(n) + \log(n) + n\log(n)) = O(n\log(n))$ ... which is clearly worse than my implementation!

But [after some research](https://www.postgresql.org/docs/current/indexes-bitmap-scans.html), this is what postgres really does:

```python
bitmapA = toBitmapRow(index('a', a0))   # O(log(n))
bitmapB = toBitmapRow(index('b', b0))   # O(log(n))
locations = bitmapAnd(bitmapA, bitmapB) # O(n)
values = table.getValuesAt(locations)   # O(n)
```

... which is also just $O(n)$.

Instead of returning the actual values in lines 1 and 2, postgres returns a datastructure of ones and zeros of length exactly $n$. Gliding along two such bitmap-lines is just $O(n)$ and gives us the indices that postgres needs to fetch the actual values from.

# Data-structures

|                | search | insert | remove |
| -------------- | ------ | ------ | ------ |
| array          | n      | 1      | n      |
| sorted array   | log(n) | n      | n      |
| linked list    | n      | 1      | n      |
| BST (balanced) | log(n) | log(n) | log(n) |

# Data-analysis

## PCA

```python
def pca(data, cutoff):
    eigenvals, eigenvecs = np.linalg.eigenh(data)
    eigenvecsCutoff = eigenvecs[:cutoff]
    dataSimplified = data @ eigenvecsCutoff
    return dataSimplified
```

## K-means clustering

```python
def kMeansClustering(data, k, repeats = 3):
    ranges = getRanges(data)

    bestMeans = []
    lowestVariance = np.infty
    for _ in range(repeats):
        means0 = pickRandomPoints(ranges, k)
        means, variances = varianceForMeans(means0, data)
        varianceSum = np.sum(variances)
        if varianceSum < lowestVariance:
            lowestVariance = varianceSum
            bestMeans = means

    return bestMeans

def varianceForMeans(means, data):
    assignment = assignPointsTo(data, means)
    oldAssignment = None
    while assignment != oldAssignment:
        means = getMeans(assignment, data)
        oldAssignment = assignment
        assignment = assignPointsTo(data, means)
    variances = getVariances(assignment, means, data)
    return means, variances
```

# Transformation based algorithms

## Fourier (-> Frequency space)

-   Transform image to frequency space
-   Draw something simple into the frequency-image
-   Transform it back
    Creates nice loops in curves

## Eigenvalues (-> Eigenvector space)

Example: multiplication with covariance matrix

-   Transforms points to eigenvector space (= where it's aligned with the axes)
-   Scales aligned points by eigenvalues
-   Transforms back
    Reduces small differences, exaggerates large differences

# Parallel algorithms

-   **span**: nr of times the gpu needs to execute
-   **work**: nr of computations done == instructions/core \* nr cores ~ nr threads

## Prefix sum

Given an input sequence $x$, return a sequence $y$ where $y_j = y_{j-1} + x_j$

Example:

```python
input  = [1, 2, 3, 4,  5,  6,  7,  8 ]
output = [1, 3, 6, 10, 15, 21, 28, 36]
```

### Single threaded

```ts
function prefix_sum(x: number[]) {
    const n = x.length;
    const y = Array(n);
    y[0] = x[0];
    for (let j = 1; y < n; j++) {
        y[j] = y[j - 1] + x[j];
    }
    return y;
}
```

### Hill & Steele: span-efficient, work-inefficient

-   $n$: input length
-   work: $n$ threads
-   span: $\lfloor \log_2{n} \rfloor$ iterations

```python
for i in 0 ... floor(log2(n)) do:         # iterations
    for j in 0 ... n-1 do in parallel:    # threads
      if y < 2**i:
          x[i+1][j] = x[i][j]
      else:
          x[i+1][j] = x[i][j] + x[i][j-2**i]
```

## span inefficient, work-efficient

<https://en.wikipedia.org/wiki/Prefix_sum>

## Sorting

<https://www.dcc.fc.up.pt/~ricroc/aulas/1516/cp/apontamentos/slides_sorting.pdf>
<https://en.wikipedia.org/wiki/Bitonic_sorter>

## Game algorithms

### Minimax

Let's first look at the traditional approach with alpha-beta pruning.

```ts
// https://www.youtube.com/watch?v=l-hh51ncgDI

# %%

def maximize(state, maxValSoFar, minValSoFar):
    actions = state.actions()
    if len(actions) == 0:
        return {"value": state.evaluate(), "actions": []}

    bestVal = -999_999_999
    for action in actions:
        newState = state.change(action)
        output = minimize(newState, maxValSoFar, minValSoFar)
        if output["value"] > bestVal:
            actions = [action] + output["actions"]
            bestVal = max(bestVal, output["value"])
            maxValSoFar = max(bestVal, maxValSoFar)
        if minValSoFar <= maxValSoFar:
            break

    return {"value": maxValSoFar, "actions": actions}


def minimize(state, maxValSoFar, minValSoFar):
    actions = state.actions()
    if len(actions) == 0:
        return {"value": state.evaluate(), "actions": []}

    worstVal = 999_999_999
    for action in actions:
        newState = state.change(action)
        output = maximize(newState, maxValSoFar, minValSoFar)
        if output["value"] < worstVal:
            actions = [action] + output["actions"]
            worstVal = min(worstVal, output["value"])
            minValSoFar = min(worstVal, minValSoFar)
        if minValSoFar <= maxValSoFar:
            break

    return {"value": minValSoFar, "actions": actions}


class Game:
    def __init__(self, nodes):
        self.nodes = nodes

    def actions(self):
        if len(self.nodes) == 1:
            return []
        return ["left", "right"]

    def change(self, action):
        if len(self.nodes) == 1:
            raise Exception("cannot change leaf node")
        if action == "left":
            return Game(self.nodes[0])
        return Game(self.nodes[1])

    def evaluate(self):
        if len(self.nodes) != 1:
            raise Exception("Cannot evalute non-leaf node")
        print("evaluating: ", self.nodes[0])
        return self.nodes[0]


def listToTree(lst):
    if len(lst) == 1:
        return lst
    else:
        half = int(len(lst) / 2)
        return [listToTree(lst[:half]), listToTree(lst[half:])]


leafNodes = [6, 8, 9, 1, 0, 1, 4, 1, 0, 8, 9, 3, 11, 1, -11, 1]
game = Game(listToTree(leafNodes))
result = maximize(game, -999_999_999, 999_999_999)
print(result)

# %%


def first(lst, pred):
    for entry in lst:
        if pred(entry):
            return entry


class TickTackToe:
    def __init__(self, actions):
        self.actionHistory = actions

    def actions(self):
        if self.winner():
            return []
        lastPlayer = self.actionHistory[-1]["player"] if len(
            self.actionHistory) > 0 else "O"
        nextPlayer = "X" if lastPlayer == "O" else "O"
        actions = []
        for row in range(1, 4):
            for col in range(1, 4):
                match = first(
                    self.actionHistory, lambda a: a["row"] == row and a["col"] == col)
                if match is None:
                    actions.append(
                        {"player": nextPlayer, "row": row, "col": col})
        return actions

    def winner(self):
        for player in ["X", "O"]:
            playerActions = [
                a for a in self.actionHistory if a["player"] == player]
            for row in range(1, 4):
                if len([a for a in playerActions if a["row"] == row]) == 3:
                    return player
            for col in range(1, 4):
                if len([a for a in playerActions if a["col"] == col]) == 3:
                    return player
            if len([a for a in playerActions if a["row"] == a["col"]]) == 3:
                return player
            if len([a for a in playerActions if a["row"] + a["col"] == 4]) == 3:
                return player

    def change(self, action):
        return TickTackToe([*self.actionHistory, action])

    def evaluate(self):
        winner = self.winner()
        if winner == "X":
            return 100
        if winner == "O":
            return -100
        return 0


def getRCVal(actions, r, c):
    match = first(actions, lambda a: a['row'] == r and a['col'] == c)
    if match:
        return match['player']
    return ' '


def printTTT(actions):
    print(f" {getRCVal(actions, 1, 1)} | {getRCVal(actions, 1, 2)} | {getRCVal(actions, 1, 3)} ")
    print("---|---|---")
    print(f" {getRCVal(actions, 2, 1)} | {getRCVal(actions, 2, 2)} | {getRCVal(actions, 2, 3)} ")
    print("---|---|---")
    print(f" {getRCVal(actions, 3, 1)} | {getRCVal(actions, 3, 2)} | {getRCVal(actions, 3, 3)} ")
    print("")


def printTTTGame(allActions):
    for i in range(1, len(allActions) + 1):
        actions = allActions[:i]
        printTTT(actions)


game = TickTackToe([])
result = maximize(game, -999_999_999, 999_999_999)
print(result)
printTTTGame(result["actions"])

```
