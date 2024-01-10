# Purescript

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