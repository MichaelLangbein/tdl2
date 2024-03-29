# Haskell

Basic haskell syntax
```haskell
-- lists
[1, 3, 2]

-- list comprehensions are very much like math's set comprehensions
removeNonUpperCase :: [Char] -> [Char]
removeNonUpperCase st = [c | c <- st, c `elem` ['A' .. 'Z']]


-- tuples: may be mixed type, are fixed size
(1, "hi")

-- type annotations: Upper case = concrete, lower case = template

-- pattern matching
lucky :: ( Integral a ) => a -> String
lucky 7 = "LUCKY NUMBER SEVEN!"
lucky x = "Sorry, you’re out of luck, pal!"

-- data types
data Point = Point Float Float
    deriving (Show)
-- Shape is a type, but Circle and Rectangle are value-constructors, which are just functions
data Shape = Circle Point Float | Rectangle Point Point
    deriving (Show)

area :: Shape -> Float
area (Circle _ r) = pi * r^2
area (Rectangle (Point x1 y1) (Point x2 y2)) = (abs $ x2 - x1) * (abs $ y2 - y1)


-- records: like objects in js
data Person = Person {
    firstName :: String,
    lastName :: String,
    age :: Int
} deriving (Show)

-- alias
type Code = String


-- type classes: like interfaces
ghci > : t (==)
(==) :: ( Eq a ) => a -> a -> Bool
-- reads: a must be a member of the `Eq` type-class

-- type class: an interface
class Eq a where
    (==) :: a -> a -> Bool
    (/=) :: a -> a -> Bool
    x == y = not (x /= y)
    x /= y = not (x == y)

-- data: a synonym-type
data TrafficLight = Red | Yellow | Green

-- implementing an interface. 
-- Because class Eq defines == and /= in terms of each other, 
-- here we need only overwrite one of them.
instance Eq TrafficLight where
    Red == Red = True
    Yellow == Yellow = True
    Green == Green = True
    _ == _ = False

```

Maybe, Either:
```haskell
data Maybe x = Just x | Nothing
    deriving (Show)

data Either a b = Left a | Right b
    deriving (Show)
```

Functors:
```haskell
-- a functor is anything to which an fmap function can be applied
-- that is, take a function a->b and return the wrapped equivalent fa -> fb
-- or that takes a function a->b and a applies it to a wrapped fa, yielding the wrapped fb
-- that means, a functor is something that can be mapped over
class Functor f where
    fmap :: (a -> b) -> f a -> f b

-- compare with map :: (a->b) -> [a] -> [b]
-- map is really just a special case of functors which works only with lists.

-- Maybe as a functor
instance Functor Maybe where
    fmap f (Just x) = Just (f x)
    fmap f Nothing = Nothing
-- applied: fmap someFunction(a->b) Maybe(a) -> Maybe(b)

fmap (*2) (Just 200) -- Just 400

instance Functor Tree where
    fmap f EmptyTree = EmptyTree
    fmap f (Node x left right) = Node (f x) (fmap f left) (fmap f right)


-- Either functor. Left is considered an error-placeholder and needs no mapping
instance Functor (Either a) where
    fmap f (Right x) = Right (f x)
    fmap f (Left x) = Left x


```


Monoids:
```haskell
class Monoid m where
    mempty :: m
    mappend :: m -> m -> m
    mconcat :: [m] -> m
    mconcat = foldr mappend mempty
```




# Category theory


## Informal stuff
- A simple program should look like this:
    - $\partial$ surface < $\partial$ volume
        - volume $\approx$ the knowledge required to implement a function
        - surface $\approx$ the knowledge required to compose functions
    - That is, when you use your api, you shouldn't have to know how each part of it is implemented.

## Useful links
- https://dev.to/airtucha/functors-and-monads-in-plain-typescript-33o1
- https://www.youtube.com/watch?v=ENo_B8CZNRQ

## Monad applications
- Logging
- Error handling
- Parsers 
- Promises
- Membranes

@TODO: implement those examples


## Categories

A category $\mathscr{C}$ consists of:

- Objects (denoted $A, B, C, ...$)
- Arrows aka. morphisms from one object to another (denoted as arrows $f: A \to B$)
- A composition-operation $\circ$ that composes arrows (not objects!) such that if  $f: A \to B \land g: B \to C$ then $g \circ f: A \to C$
    - Note that $\circ$ doesn't have to be applicable to all morphisms, just to those with a shared target/source object.

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

Counter-examples:
- $(\mathbb{Z}, -1, \circ)$, because $1 - (1 - 1) \neq (1 - 1) - 1$

### Hom sets
Given objects $A$ and $B$ in category $\mathscr{C}$, a Hom set $Hom_\mathscr{C}(A,B)$ is the set of all morphisms from $A$ to $B$.


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




## Monoids
There is a set-theoretic definition of a monoid being something more general than an algebra, but we'll use the category-theoretic definition instead.

Monoids are a special type of category, namely one with one one object.
This doesn't make much sense for objects like the natural numbers: if we can only pick one natural number, then there also aren't many interesting morphisms on that number. But it does make sense if the one object is a type, like for example `int`.

Contrary to general categories, in monoids the composition between any two morphisms is always possible - that's because any morphism in a monoid is a mapping $X \to X$, and that is always composable with another $X \to X$.

> In programming we almost always care only about the category (`Types`, `functions`). There, a monoid is a single type `T` plus the collection of functions `(in: T) => T`.

**Example 1:** The monoid of (`int`, `addX`, $\circ$)
- Object: the type `int`
- morphisms: the functions `add0`, `add1`, `add2`, ...
    - `addX` are trivially associative
    - `add0` serves as the identity-morphism

**Example 2:** The monoid of (`string`, `+`, $\circ$)

**Example 3:** The monoid of (`Maybe<T>`, `map<F>`, $\circ$)

### Set-theoretic definition
A monoid is a:
- set of objects
- with a binary operation
    - that is associative
    - and has a neutral element in the set

### Relating set-monoids to category-monoids
Example with the (`Int`, +) monoid

- set-theoretic:
    - set: all the integers
    - operation: `+`
        - is associative
        - $0$ is the identity element
- category-theoretic:
    - objects: a single one: the type `int`
    - arrows: `is0`, `is1`, `is2`, ...
    - composition: `is3` $\circ$ `is2` = `is5`
        - is associative
        - `is0` is the identity arrow

In general, to go from a category-theoretic monoid to a set-theoretic monoid: T (set-theoretic) set equals the (category-theoretic) arrows.



## Use of monoids as side-effects inside categories
Consider a new category:
- objects == Types
- morphisms A->B == functions of `A` returning `Commented<B>`

This category is important - it's known as a **Kleisli-category**.
(It'll later turn out that `Commented` is a monad, called the *writer*-monad)

```ts
// notice how `Commented.comment` is a (string, +)-monoid:

interface Commented<T> {
    thing: T
    comment: string
}

// morphism number => boolean
function isEven(n: number): Commented<boolean> {
    const evn = n % 2 === 0;
    return { thing: evn, comment: "isEven " };
}

// morphism boolean => boolean
function negate(b: boolean): Commented<boolean> {
    const neg = !b;
    return { thing: neg, comment: "negate " };
}

// identity morphism
function id<T>(v: T): Commented<T> {
    return { thing: v, comment: "" };
}

type Morphism<A, B> = (input: A) => Commented<B>;

function compose<A, B, C>(func1: Morphism<A, B>, func2: Morphism<B, C>): Morphism<A, C> {
    function composed(inpt: A): Commented<C> {
        const b = func1(inpt);
        const c = func2(b.thing);
        return { thing: c.thing, comment: b.comment + c.comment };
    };
    return composed;
}

describe("using monoids for side-effecs", () => {
    test("application", () => {

        const notEven = compose(isEven, negate);
        const result = notEven(3);
        expect(result.comment).toBe("isEven negate ");

    });
});
```

We can re-write this for any kind of monoid-like side effect like so:
```ts
// monoid of one element: the type E
// monoid neutral-morphism
type mempty<E> = () => E;
// monoid composition
type mappend<E> = (a: E, b: E) => E;


interface Embellished<T, E> {
    thing: T
    embellishment: E
}

type Morphism<A, B, E> = (input: A) => Embellished<B, E>;

function id<T, E>(v: T): Embellished<T, E> {
    return { thing: v, embellishment: mempty<E>() };
}

function compose<A, B, C, E>(func1: Morphism<A, B, E>, func2: Morphism<B, C, E>): Morphism<A, C, E> {
    function composed(inpt: A): Embellished<C, E> {
        const b = func1(inpt);
        const c = func2(b.thing);
        return { thing: c.thing, embellishment: mappend(b.embellishment + c.embellishment) };
    };
    return composed;
}

```


Quite analogously there is also the `optional` monad.
```ts
class Optional<T> {
    constructor(private _value?: T) {}
    public isValid() { return !!this._value; }
    public value(): T {
        if (this.isValid()) return this._value as T;
        else throw Error(`Optional: check 'isValid' before accessing this value.`);
    }
}

function identity(a: number): Optional<number> {
    return new Optional(a);
}

function root(a: number): Optional<number> {
    if (a <= 0.0) return new Optional<number>();
    else return new Optional(Math.sqrt(a));
}

function inverse(a: number): Optional<number> {
    if (a === 0.0) return new Optional<number>();
    else return new Optional(1.0 / a);
}

function compose(f1: (a: number) => Optional<number>, f2: (b: number) => Optional<number>) {
    function composed(a: number) {
        const v1 = f1(a);
        if (!v1.isValid()) return new Optional<number>();
        const v2 = f2(v1.value());
        return v2;
    }
    return composed;
}


describe("optional", () => {
    test("test validity", () => {
        const rtInv = compose(inverse, root);
        const val = rtInv(0.2);
        
        expect(val.isValid());
        expect(val.value() === Math.sqrt(1 / 0.2));
    })
});
```


## Universal construction

Sometimes we want to single out particular objects of a category.
Since we only know about objects and arrows, it's a little hard to select one particular object - after all, we can't just select it by name, only by its relations.

A common way to do this is as follows:
- pick a pattern (a graph of objects and arrows)
- look for all occurances of that pattern
- rank those occurances by some measure
    - usually, prove that they are "unique up to unique isomorphism" (see a few sections later)

This process is called **universal construction**.


### Example: picking an "initial object"
- Pattern: match object $X$ if $\forall Y \in \mathscr{C}: \exists X \to Y$
    - This pattern is neiter guaranteed to exist, nor to be unique
    - But its the next best thing: if it does exist, its guaranteed to be unique up to isomorphism

### Example: picking a "terminal object"
$T \in \mathscr{C}$:term $\iff$ $\forall X \in \mathscr{C}: \exists ! f: X \to T$

Example: Cindy and Julia are both therminal.
```txt
        Joey  ─┬─────────────────►
               │                   Cindy
             ┌─┼─────────────────►
             │ │                    ▲ │
             │ │                    │ │
             │ │                    │ ▼
             │ └─────────────────►
             │                     Julia
   Andrew  ──┴───────────────────►

(arrows to self omitted)
```

## Isomorphism and "uniqueness up to unique isomorphism"

Consider two morphisms $f, g \in \mathscr{C}$. 

$(f, g):\text{iso} \iff f \circ g = id \land g \circ f = id$

**Theorem**: Two terminal objects are identical up to unique isomorphism.
> $Let A, B \in \mathscr{C}$
> Assume $A$:term $\land B$:term.
> Proof that $\exists! (f, g): iso_{A,B}$
>
>> Try $f: A \to B$ and $g: B \to A$.
>> 
>> $f$ must exist and be unique because $B$:term.
>>
>> $g$ must exist and be unique because $A$:term.
>>
>> Since $f: A \to B$ and $g: B \to A$, we have:
>> - $f \circ g = id_A$ 
>> - $g \circ f = id_B$

The same holds for initial objects.

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

# Preliminary implementation ... to be revised


Functor<A>:
    - private Wrapped<A>
    - map(f A->B): Functor<B>

Monad<A> extends Functor<A>:
    - flatmap(f A->Wrapped<B>): Monad<B>

Functors and monads ...
- manage wrapped values `Wrapped<A>`
- such that functions `f: A->B` can be applied and chained on those wrapped values
    - without the functions being aware that the managed values are wrapped


```ts

class Maybe<T> {
    constructor(private _value?: T) {}
    public isValid() { return !!this._value; }
    public value(): T {
        if (this.isValid()) return this._value as T;
        else throw Error(`Optional: check 'isValid' before accessing this value.`);
    }
}

class MaybeMonad<A> {
    constructor(private value: Maybe<A>) {}

    map<B>(func: (a: A) => B): MaybeMonad<B> {
        if (this.value.isValid()) {
            const newVal = func(this.value.value());
            return new MaybeMonad<B>(new Maybe(newVal));
        } else {
            return new MaybeMonad<B>(new Maybe<B>());
        }
    }

    flatMap<B>(func: (a: A) => Maybe<B>): MaybeMonad<B> {
        if (this.value.isValid()) {
            const newVal = func(this.value.value());
            return new MaybeMonad(newVal);
        } else {
            return new MaybeMonad<B>(new Maybe<B>());
        }
    }

    get() {
        return this.value;
    }
}


const valueMonad = new MaybeMonad(new Maybe(3));
const resultMonad = valueMonad
    .map(v => v*3)
    .flatMap(v => v === 0 ? new Maybe<number>() : new Maybe( 1/v          ))
    .flatMap(v => v < 0 ?   new Maybe<number>() : new Maybe( Math.sqrt(v) ));

console.log(resultMonad.get());







class StatefulValue<V, S> {
    constructor(readonly value: V, readonly state: S) {}
}

function rng(seed: number): StatefulValue<number, number> {
    throw new Error(`Not yet implemented`);
}

const seed = 123;
const data1 = rng(seed);
const data2 = rng(data1.state);
const data3 = rng(data2.state);
console.log(data3.value);

// We want to avoid threading the state through every line here
// ... entering the state monad:

class StateMonad<V, S> {
    constructor(readonly state: StatefulValue<V, S>) {}

    public flatmap<B>(func: (s: S) => StatefulValue<V, S>): StateMonad<V, S> {
        const lastState = this.state.state;
        const newStatefulValue = func(lastState);
        return new StateMonad(newStatefulValue);
    }
}

const initial = new StateMonad(new StatefulValue(0, 123));
const final = initial
                .flatmap(rng)
                .flatmap(rng)
                .flatmap(rng);
console.log(final.state.value);



// Modelling a gumball machine with a state-monad:

function enterMoney(newMoney: number): (s: number) => StatefulValue<string, number> {
    return (currentMoney: number) => new StatefulValue("nothing", currentMoney+newMoney);
}

function turn(currentMoney: number): StatefulValue<string, number> {
    if (currentMoney > 50) return new StatefulValue("gumball", currentMoney-50);
    else return new StatefulValue("nothing", currentMoney);
}

const state = new StateMonad(new StatefulValue("nothing", 0));
const stateAfter = state
                        .flatmap(enterMoney(25))
                        .flatmap(enterMoney(25))
                        .flatmap(turn);
```