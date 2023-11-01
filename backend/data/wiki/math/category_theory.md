# Category theory

A category consists of:

- Objects (denoted $A, B, C, ...$)
- Arrows aka. morphisms from one object to another (denoted as arrows $f: A \to B$)
- A composition-operation $\circ$ such that if  $f: A \to B \land g: B \to C$ then $g \circ f: A \to C$

Where $\circ$ is associative: 
- assume $f: A \to B \land g: B \to C \land h: C \to D$
- then $h \circ g \circ f = (h \circ g) \circ f = h \circ (g \circ f)$

And there is an identity-arrow called $id_X$, such that:
- $\forall Y, \forall f: X \to Y$, we have $f \circ id_X = f$
- $\forall W, \forall g: W \to X$, we have $id_X \circ g = g$ 



Examples:
- Functions (=morphisms) and types (=objects)
- Directed graphs (only if all nodes have an edge to themselves)
- Social graph


```ts
// Example implementation of the category of functions

function identity<T>(arg: T) {
    return arg;
}

function composition<A, B, C>(f: (a: A) => B, g: (b: B) => C) {
    const composed = (a: A) => g(f(a));
    return composed;
}


describe('category', () => {

    const f =  (a: number) => `${a}`;
    const g =  (b: string) => [b];

    test('composition', () => {

        const composed = composition(f, g);
        const c = composed(3);
        expect(c instanceof Array);

    }),

    test('identity and composition', () => {

        const composed = composition(f, identity);
        const c = composed(3);
        expect(typeof c === "string");

    })
})

```




# Preliminary implementation ... to be revised

```ts

interface NumberWithLogs {
    result: any,
    logs: string[]
}

function square(x: NumberWithLogs): NumberWithLogs {
    return const newNumberWithLogs: NumberWithLogs = {
        result: x.result * x.result,
        logs: ["squared"]
    }
}

function addOne(x: number): NumberWithLogs {
    return {
        result: x + 1,
        logs: ["added one"]
}


function wrapWithLogs(value: any): NumberWithLogs {
    return {
        result: value,
        logs: []
    }
}

function runWithLogs(
    input: NumberWithLogs, 
    transform: (_: number) => NumberWithLogs
): NumberWithLogs {
    const newNumberWithLogs = transform(input.result);
    return {
        result: newNumberWithLogs.result,
        logs: input.logs.concat(newNumberWithLogs.logs)
    }
}


const a = wrapWithLogs(5);
const b = runWithLogs(a, addOne);
const c = runWithLogs(b, square);

```