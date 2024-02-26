# Purescript

## Setup

```bash
# spago: package manager and build tool
npm install -g purescript spago esbuild
cd myProject
spago init
spago install <packageNames spaceSeparated>
# repl, called PSCi
spago repl
```

Files:

- `src/Main.purs` and `test/Main.purs` must always be present
- `packages.dhall`: spago configuration
- `spago.dhall`: list of dependencies
- `.purs-repl`: instructions to repl on which modules and dependencies to load

Repl commands:

- `:?`
- `:paste`
- `:type`, `:kind`

Spago commands:

- `repl`
- `test`
- `run`
  - doesn't always have to be `src/Main.purs`: you can `spago run --main Test.Random` ... just make sure that this module contains a `main` function.
- `build`: creates es-modules
- `bundle-app`: creates one index.js with dead-code-elimination.

## Scopes

```hs
-- scopes are written either using `with` or `let .. in`

newtype Complex = Complex { real :: Number, imaginary :: Number}

print :: Complex -> String
print (Complex c) = show c.real <> sign c.imaginary <> show c.imaginary <> "i"
    where
        sign v | v >= 0.0 = "+"
        sign _ = ""

print' :: Complex -> String
print' c =
  let sign v
    | v >= 0 = "+"
    | otherwise = ""
  in
    show c.real <> sign c.imaginary <> show c.imaginary

```

## Pattern matching

```haskell
-- pattern matching and guards
gcd :: Int -> Int -> Int
gcd n 0 = n
gcd 0 m = m
gcd n m | n > m     = gcd (n - m) m
        | otherwise = gcd n (m - n)


-- pattern matching on records
showPersonV2 :: { first :: String, last :: String } -> String
showPersonV2 { first, last } = last <> ", " <> first


-- pattern matching on lists
sum (Cons head tail) = head + sum tail
sum (head) = head
sum () = 0


-- pattern matching on arrays
firstTwo [first second _] = first + second
-- arrays cant match tail with Cons, I think.

-- case on arrays
sum :: Array Number -> Int -> Number
sum arr startAt =
  case arr !! startAt of
    Just x -> x + sum arr (startAt + 1)
    Nothing -> 0

-- pattern matching on ADTs
data NonEmpty a = NonEmpty a (Array a)

eq :: NonEmpty -> NonEmpty -> Boolean
eq (NonEmpty head1 tail1) (NonEmpty head2 tail2) = (eq head1 head2) && (eq tail1 tail2)
```

## Type

```hs
-- `type`: creates a type form an object
-- `type`doesn't allow for constructors - only typeclasses can do that.
-- where js has object literals, this is a type literal - so no constructor. Functionally it works like a ts interface.

type Address =
  { street :: String
  , city   :: String
  , state  :: String
  }

type Entry =
  { firstName :: String
  , lastName  :: String
  , address   :: Address
  }

type AddressBook = List Entry

-- `List` is a type constructor. As such, List is a `typeclass`, not a `type`.
```

## Data

- `data`: creates an algebraic data type - the only thing algebraic about an ADT is that it is constructed of
  - either _sums_ of types (A | B)
  - or _products_ of types (A && B)

```haskell
data Light = Red | Yellow | Green
```

## Newtype

```haskell
-- just an alias
-- like `data`, but must only have one constructor and takes exactly one argument

newtype Volt = Volt Number

battery = Volt 1.5
```

## Type classes

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/Type-Class-Relationships.svg">

```haskell
-- more like an interface

class Show a where
  show :: a -> String

instance Show Boolean where
  show true = "true"
  show false = "false"


-- `instance` requires its argument to be a `newtype` or `data`, not a `type` (because `type`s are basically literals).
-- if we were to use `type`, we'd be stuck with the default version of `show`.
newtype Point = Point {x :: Number, y :: Number}

instance Show Point where
    show (Point p) = "(" <> show p.x <> ", " <> show p.y <> ")"


-- type classes can be used as type constraints:
threeAreEqual :: forall a. Eq a => a -> a -> a -> Boolean
-- reads: forall a given that a implements Eq
threeAreEqual a1 a2 a3 = a1 == a2 && a2 == a3

```

### Deriving instead of instancing: compiler automatically implements a typeclass for you

```haskell
data MyADT = Some | Arbitrary Int | Contents Number String


-- Method 1: some classes can be automatically derived; this works for Eq, Ord, Functor, Newtype and Generic
derive instance Eq MyADT
derive instance Ord MyADT


-- Method 2: deriving with `newtype`
newtype Score = Score Int
derive newtype instance Semiring Score


-- Method 3: generic
-- When the first two methods don't apply, purescript has prepared a bunch of generic functions for showing, eq'ing etc.
-- Those methods will work as long as their input has a `to` and a `from` method.
-- And fortunately, those `to` and `from` methods can usually be derived automatically (step 3.1)
import Data.Generic.Rep (class Generic)
-- step 3.1: make MyADT a generic
derive instance Generic MyADT _
-- step 3.2: now generic implementations can be applied
import Data.Show.Generic (genericShow)
instance Show MyADT where
  show = genericShow
```

### Instancing and deriving for type constructors

````hs
-- defining a nonempty array
data NonEmpty a = NonEmpty a (Array a)


-- option 1: instance manually
instance Eq a => Eq (NonEmpty a) where
  eq (NonEmpty e1 a1) (NonEmpty e2 a2) = e1 == e2 && a1 == a2

instance Show a => Show (NonEmpty a) where
  show (NonEmpty e1 a1) = show e1 <> " " <> show a1

-- option 2: derive automatically
derive instance Eq a => Eq (NonEmpty a)

-- deriving a generic as function of a type-parameter
-- derive instance Generic a rep => Generic (NonEmpty a) _

### Deriving and instancing types that depend on other types

```haskell
class Show a where
  show :: a -> String

-- read: implement `show` for the type `String`
instance showString :: Show String where
  show s = s

-- read: implement `show` for the type `Boolean`
instance showBoolean :: Show Boolean where
  show true = "true"
  show false = "false"

-- read: given that you know how to show `a`, implement `Show` for the type `Array a`
instance showArray :: (Show a) => Show (Array a) where
  show xs = "[" <> joinWith ", " (map show xs) <> "]"

example = show [true, false]



data NonEmpty a = NonEmpty a (Array a)

-- read: given that you know how to `Eq a` and how to `Eq (Array a)`, implement `Eq` for `NonEmpty a`
instance (Eq a, Eq (Array a)) => Eq (NonEmpty a) where
  eq (NonEmpty head1 tail1) (NonEmpty head2 tail2) = (eq head1 head2) && (eq tail1 tail2)

-- alternative: derive automatically, given that you know how to `Eq a` and how to `Eq (Array a)`
derive instance (Eq a, Eq (Array a)) => Eq (NonEmpty a)
````

### Examples

```haskell
-- instancing with pattern matching

data Extended a = Infinite | Finite a

-- Ord will throw an error if Eq hasn't been instanced first
derive instance (Eq a) => Eq (Extended a)

instance (Ord a) => Ord (Extended a) where
  compare Infinite Infinite = EQ
  compare Infinite _ = GT
  compare _ Infinite = LT
  compare (Finite u) (Finite v) = compare u v


compare Infinite (Finite 5)
-- yields GT


-- Example of lots of automatic deriving for Trees
data Tree a = Leaf | Branch (Tree a) a (Tree a)

derive instance (Eq a) => Eq (Tree a)
derive instance Functor Tree
derive instance Foldable Tree
derive instance Traversable Tree

instance (Show a) => Show (Tree a) where
  show Leaf = "Leaf"
  show (Branch left val right) = "(Branch " <> show left <> " " <> show val <> " " <> show right <> ")"
```

## Semigroup, Functor and Foldable

```haskell
data NonEmpty a = NonEmpty a (Array a)

derive instance (Eq a, Eq (Array a)) => Eq (NonEmpty a)

-- Semigroup
instance Semigroup (NonEmpty a) where
  append (NonEmpty h1 t1) (NonEmpty h2 t2) = NonEmpty h1 (t1 <> [h2] <> t2)

(NonEmpty 1 []) <> (NonEmpty 2 [3])
-- yields (NonEmpty 1 [2 3])


-- Functors
-- functors create a `map` function
-- that takes a function `f :: a -> b`
-- and applies it inside a wrapper (here: `NonEmpty`)
-- such that it becomes `wrappedF :: (NonEmpty a) -> (NonEmpty b)`

instance Functor NonEmpty where
  map f (NonEmpty h tail) = NonEmpty (f h) (map f tail)

-- alternative:
-- derive instance Functor NonEmpty

map (_ * 10) (NonEmpty 1 [ 2, 3 ])
-- yields NonEmpty 10 [ 20, 30 ]



-- foldable
instance Foldable NonEmpty where
  foldr reducerR initial (NonEmpty h t) = reducerR h (foldr reducerR initial t)
  foldl reducerL initial (NonEmpty h t) = foldl reducerL (reducerL initial h) t
  foldMap mapper (NonEmpty h t) = foldMap mapper ([ h ] <> t)


foldl (\acc x -> acc * 10 + x) 0 (NonEmpty 1 [ 2, 3 ])
-- yields 123
foldr (\x acc -> acc * 10 + x) 0 (NonEmpty 1 [ 2, 3 ])
-- yields 321
foldMap (\x -> show x) (NonEmpty 1 [ 2, 3 ])
-- yields "123"
```

## Functor, Apply, Applicative and Traversable

```haskell
-- The next functions are used to lift *simple* function into *decorated* ones.
-- Consider the simple function `makeAddress`:

newtype Street = Street String
newtype City = City String
newtype State = State String

instance Show Street where
  show (Street s) = s
instance Show City where
  show (City c) = c
instance Show State where
  show (State s) = s

type Address = {street :: Street, city :: City, state :: State}

makeAddress :: Street -> City -> State -> Address
makeAddress street city state = {street, city, state}

-- makeAddress (Street "Spooner Str") (City "Quahog") (State "Rhode Island")
-- yields the obvious.

-- This simple function shall now be lifted such that it can also accept `Maybe`s
import Data.Maybe (Maybe(..))

-- functor: apply a function to a wrapped type, aka. <$>
-- map :: (a -> b) -> wrp a -> wrp b
-- or, in pseudocode: function of f(a to b), Wrapped<a>, yielding Wrapped<b>
instance Functor Maybe where
  map f (Just a) = Just (f a)
  map f Nothing  = Nothing


-- Apply: apply a wrapped function to a wrapped type <*>
-- apply :: wrp (a->b) -> wrp a -> wrp b
-- or, in pseudocode: function of Wrapped<f(a to b)>, Wrapped<a>, yielding Wrapped<b>
instance Apply Maybe where
  apply (Just f) (Just x) = Just (f x)
  apply _        _        = Nothing


-- Applicative: turns a value into a wrapped value
instance Applicative Maybe where
  pure x = Just x


-- We'll show how <$> and <*> can lift a simple function into a decorated one
f1 = map makeAddress (Just (Street "Evergreen Terrace")) -- Maybe (City -> State -> Address)
f2 = apply f1 (Just (City "Springfield")) -- Maybe (State -> Address)
f3 = apply f2 (Nothing) -- Maybe Address
-- yields `Nothing`

-- In infix notation:
liftedMakeAddress :: Maybe Street -> Maybe City -> Maybe State -> Maybe Address
liftedMakeAddress mStreet mCity mState = makeAddress <$> mStreet <*> mCity <*> mState


-- there is even a special notation for this:
result = ado         -- read: applicative do: creates a context where maybes are abstracted away
  a <- mStreet       -- read: unwrap maybe to concrete val
  b <- mCity         -- read: unwrap maybe to concrete val
  c <- mState        -- read: unwrap maybe to concrete val
  in makeAddress a b c


-- In summary, an applicative is a decorated type (not a function) which can be an in/output to the following functions:
-- - apply functions to decorated values
-- - apply decorated functions to decorated values
-- - convert values into decorated values
```

#### More on ado and do notation

```haskell
import Prelude
import Data.Maybe
import Data.Either

fullName first middle last = last <> ", " <> first <> " " <> middle

withError :: forall a b. Maybe a -> b -> Either b a
withError Nothing err = Left err
withError (Just a) _ = Right a

fullNameSafe first middle last = ado  -- creates a context for maybes
  f <- first `withError` "First name missing"
  m <- middle `withError` "Middle name missing"
  l <- last `withError` "Last name missing"
  in fullName f m l

fullNameSafe (Just "Michael") Nothing (Just "Langbein")
```

### Compilation of `ado` and `do`

The compiler converts `ado` like so:

```haskell
ado
  a <- computation1
  b <- computation2
  in computation3 a b
  -- unlike `do`, `ado` must always end with an `in` expression
```

into

```haskell
computation3 <$> computation1
             <*> computation2
```

The compiler converts (see [here](https://book.purescript.org/chapter8.html)) `do` like so:

```haskell
do
  a <- computation1
  b <- computation2
  computation3
```

into

```haskell
computation1 >>=
  \a -> computation2 >>=
    \b -> computation3
```

## Monads

Monads extend `Apply` and `Bind` implementing `bind`, aka `flatMap`, aka. `>>=`.

- **map**: `(a -> b), W<a>` yielding `W<b>`
- **apply**: `W<a -> b>, W<a>` yielding `W<b>`
- **flatMap**: `W<a>, (a -> W<b>)` yielding `W<b>`

Monad laws:

- **Right identity**:
  - `op >>= (a -> pure a)` equals `op`
  - in code:
    ```haskell
      do
         a <- op
         pure a
      -- can be rewritten as
      do
        op
    ```
- **Left identity**:
  - `(pure x) >>= (a -> op(a))` equals `op(a)`
  - in code:
    ```haskell
      do
         a <- pure x
         op a
      -- can be rewritten as
      do
        op x
    ```
- **Associativity**:
  - `[op1 >>= (a -> op2(a))] >>= (b -> op3(b))` equals `op1 >>= [(a -> op2(a)) >>= (b -> op3(b))]`
  - in code:
    ```haskell
      do
        b = do
          a <- op1
          op2 a
        op3 b
      -- can be rewritten as
      do
        a <- op1
        b <- op2 a
        op3 b
    ```

### Monads' `do` vs Applicatives' `ado`

```haskell
import Data.Maybe
import Data.Number

safeDiv :: Number -> Number -> Maybe Number
safeDiv _ 0.0 = Nothing
safeDiv a b = Just (a / b)

safeLog :: Number -> Maybe Number
safeLog a | a <= 0.0 = Nothing
safeLog a = Just (log a)

-- monadic `do`:
-- - can use intermediate results (here: a)
-- - but because of that same reason, cannot be trivially parallelized
result :: Maybe Number
result = do
  a <- safeDiv 4.0 2.0
  b <- safeLog a
  a + b

resultEquivalent = (safeDiv 4.0 2.0) >>=
                    (\a -> safeLog a) >>=
                    (\b -> a + b)

-- applicative `ado`
-- - must always end in a `in` phrase
-- - cannot use intermediate results (here: a)
-- - can be parallelized
result2 ∷ Maybe Number
result2 = ado
  a <- safeDiv 4.0 2.0
  b <- safeLog a      -- error: unknown `a`
  in a + b
  -- unlike `do`, `ado` must always end with an `in` expression

result2Equivalent = (+) <$> safeDiv 4.0 2.0
                        <*> safeLog a    -- error: unknown `a`
```

## Common infix operators

- Prelude:
  - `func $ expression` = `func (expression)`
  - `(f <<< g) x` = `f (g x)`
  - `(f >>> g) x` = `g (f x)`
- Semigroup:
  - **append** aka `<>`: `"a" <> "bc"` = `append "a" "bc"`
- Functor:
  - **map** aka `<$>`: `func(a to b) <$> wrapped<a> = wrapped<b>`
- Apply:
  - **apply** aka `<*>`: `wrapped<func(a to b)> <$> wrapped<a> = wrapped<b>`
- Bind:
  - **bind** aka **flatMap** aka `>>=`: `wrapped<a> >>= func(a to wrapped<b>) = wrapped<b>`

## Effects

### Exceptions

```haskell
exceptionDivide :: Int -> Int -> Effect Int
exceptionDivide _ 0 = throwException $ error "div zero"
exceptionDivide a b = pure (a / b)
```

### State

```haskell
-- for when creating a new immutable data-structure with every iteration
-- is too slow

estimatePi :: Int -> Number
estimatePi n = run do   -- notice the `run` before `do`
  sumRef <- new 0.0
  for 1 (n+1) \i ->
    modify (\sum -> sum + (gregoryElement i)) sumRef
  sumVal <- read sumRef
  pure (sumVal * 4.0)
  where
    gregoryElement :: Int -> Number
    gregoryElement i = toNumber (pow (-1) (i+1)) / toNumber (2*i - 1)
```

# Some interesting examples

Turning a list of applicatives into an applicative of a list:

```haskell
import Data.List
import Data.Maybe

combineList :: forall f a. Applicative f => List (f a) -> f (List a)
combineList Nil = pure Nil
combineList (Cons x xs) = Cons <$> x <*> combineList xs


combineList (fromFoldable [Just 1, Just 2, Just 3])
-- yields (Just (Cons 1 (Cons 2 (Cons 3 Nil))))

combineList (fromFoldable [Just 1, Nothing, Just 2])
-- yields Nothing
```

Verifying a record through applicatives:

```haskell
import Data.Maybe
import Data.Either

type Person = { name:: String, address:: String, notes:: Array String}

createPerson :: String -> String -> Array String -> Person
createPerson name address notes = {name, address, notes}

notEmpty ∷ ∀ a. String → a → Either a String
notEmpty "" errorMessage = Left errorMessage
notEmpty val _ = Right val

-- verify by creating a new person
-- from Eithers of the original
verifyPerson ∷ Person → Either String Person
verifyPerson person = ado
  name    <- notEmpty person.name "Name error"
  address <- notEmpty person.address "Address error"
  notes   <- pure person.notes
  in createPerson name address notes

verifyPerson {name: "Michael", address: "", notes: []}
-- yields (Right "Address error")
```

```haskell
matches :: String -> Regex -> String -> V Errors String
matches _     regex value | test regex value
                          = pure value
matches field _     _     = invalid [ "Field '" <> field <> "' did not match the required format" ]
-- how does pure know that it should return a V? the compiler tells it, based on the type hint for `matches`

```
