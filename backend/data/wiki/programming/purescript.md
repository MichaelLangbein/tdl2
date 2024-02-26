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

```purescript

-- pattern matching and guards
gcd :: Int -> Int -> Int
gcd n 0 = n
gcd 0 m = m
gcd n m | n > m     = gcd (n - m) m
        | otherwise = gcd n (m - n)

-- pattern matching on records
showPersonV2 :: { first :: String, last :: String } -> String
showPersonV2 { first, last } = last <> ", " <> first

```

## Type

```hs
-- `type`: creates a type form an object
-- `type`doesn't allow for constructors - only typeclasses can do that.

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


-- `instance` requires its argument to be a `newtype` or `data`, not a `type`.
-- if we were to use `type`, we'd be stuck with the default version of `show`.
newtype Point = Point { x :: Number, y :: Number}

instance Show Point where
    show (Point p) = "(" <> show p.x <> ", " <> show p.y <> ")"


-- type classes can be used as type constraints:
threeAreEqual :: forall a. Eq a => a -> a -> a -> Boolean
-- reads: forall a where a implements Eq
threeAreEqual a1 a2 a3 = a1 == a2 && a2 == a3
```

### Deriving instead of instancing: compiler automatically implements a typeclass for you.

```hs
data MyADT = Some | Arbitrary Int | Contents Number String


-- Method 1: some classes can be automatically derived; this works for Eq, Ord, Functor, Newtype and Generic
derive instance Eq MyADT
derive instance Ord MyADT


-- Method 2: deriving with `newtype`
newtype Score = Score Int
derive newtype instance Semiring Score


-- Method 3: generic
import Data.Generic.Rep (class Generic)
-- step 3.1: make MyADT a generic
derive instance Generic MyADT _
-- step 3.2: now generic implementations can be applied
import Data.Show.Generic (genericShow)
instance Show MyADT where
  show = genericShow
```

### Instancing and deriving for type constructors

```hs
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

```
