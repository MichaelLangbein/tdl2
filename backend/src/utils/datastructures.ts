
export class Queue<T> {
    private data: T[] = [];

    public enqueue(entry: T) {
        this.data.push(entry);
    }

    public dequeue(): T | undefined {
        return this.data.shift();
    }
}




export type SetEqualityFunction<T> = (a: T, b: T) => boolean;
export type SetSelectionPredicate<T> = (a: T) => boolean;

export class Set<T> {
    private data: T[] = [];

    constructor(private equalityFunction: SetEqualityFunction<T> = (a, b) => a === b) {}

    public add(entry: T): boolean {
        for (const d of this.data) {
            if (this.equalityFunction(entry, d)) return false;
        }
        this.data.push(entry);
        return true;
    }

    public get(predicate: SetSelectionPredicate<T>): T[] {
        const out: T[] = [];
        for (const d of this.data) {
            if (predicate(d)) {
                out.push(d);
            };
        }
        return out;
    }
}