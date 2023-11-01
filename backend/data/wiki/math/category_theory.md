# Category theory


## Informal stuff
- A simple program should look like this:
    - $\partial$ surface < $\partial$ volume
        - volume $\approx$ the knowledge required to implement a function
        - surface $\approx$ the knowledge required to compose functions
    - That is, when you use your api, you shouldn't have to know how each part of it is implemented.


## Categories

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
    - in fact, there is a category named - `Set`: objects=sets, morphisms=functions
    - Turns out types are just sets
- Directed graphs (only if all nodes have an edge to themselves; composition=connected)
- Social graph (objects=people, arrows=know-each-other, composition=know-who-knows)


```ts
// Example implementation of the category of functions

function identity<T>(arg: T) {
    return arg;
}

function composition<A, B, C>(g: (b: B) => C, f: (a: A) => B) {
    const composed = (a: A) => g(f(a));
    return composed;
}


describe('category', () => {

    const f =  (a: number) => `${a}`;
    const g =  (b: string) => [b];
    const h =  (c: string[]) => c.length;

    test('composition', () => {
        const composed = composition(g, f);
        const c = composed(3);
        expect(c instanceof Array);
    }),


    test('composition is associative', () => {
        const gf   = composition(g, f );
        const h_gf = composition(h, gf);
        const hg   = composition(h, g );
        const hg_f = composition(hg, f);

        const out_hg_f = h_gf(3);
        const out_g_gf = hg_f(3);

        expect(out_hg_f === out_g_gf);
    }),

    test('identity and composition', () => {
        const composed = composition(identity, f);
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