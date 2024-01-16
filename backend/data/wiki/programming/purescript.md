# Purescript

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/haskell_classes.png">

## Setup

```bash
# spago: package manager and build tool
npm install -g purescript spago esbuild
cd myproject
spago init
spago install <packagenames spaceseparated>
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

## Syntax

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

- `type`: creates a type form an object
  - does not allow for constructors
- `data`: creates an algebraic data type - the only thing algebraic about an ADT is that it is constructed of
  - either _sums_ of types (A | B)
  - or _products_ of types (A && B)
- `newtype`: just an alias (eg: `newtype Volt = Volt Number; battery = Volt 1.5;`)
  - like `data`, but must only have one constructor and must only take exactly one argument
- `class`: more like an interface
