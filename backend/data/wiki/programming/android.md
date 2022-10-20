# Android

## Java-specifics
- Runs on JVM

## Gradle

## Koltin

### Class modifiers
- `data`: Add some useful methods to a class (like hash, copy, ..).
- `enum`: Makes it an enum
- `open`: Allows extension
- `sealed`: Restricts subclassing
- `object`: Singletons

### Property modifiers
- `lateinit`: allows initializing a non-null property outside of constructor

### Function modifiers
- `suspend`: allows function to be used concurrently
- `internal`: only visible in current module
- `tailrec`: marks function as tail-recursive (allowing compiler to replace recursion with iteration)


## Android studio

### Command-prompt
With double-tap on `Shift`.

### Scratch files
... allow you to dynamically run code like in a jupyter-notebook, without having to re-compile a whole application.


## Activities

### Life-cycle
 - `onCreate`

## Fragments

## Multi-threading
- General: `coroutines`
- Implemented by: 
  - `thread`s