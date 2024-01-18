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

- repl
- test
- run
- build: creates es-modules
- bundle-app: creates one index.js with dead-code-elimination.

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
```

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
```


### Important type classes

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
