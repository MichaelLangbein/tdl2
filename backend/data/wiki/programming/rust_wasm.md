# Rust

## Setup

 - version manager: `rustup`
 - package manager: `cargo`
   - configured with `Cargo.toml`
   - `cargo new <name>`: create project
   - `cargo build`:     build
   - `cargo run`:       run
   - `cargo test`:      test
   - `cargo publish`:   publish
   - `cargo generate --git https://github.com/rustwasm/wasm-pack-template`: setup project using template






## Smart pointers
Smart pointers implement the traits `ref` and `del`. The first allows them to be passed as pointers, the second allows them to clean up when going out of scope.
```rust
fn get_heap_data(val: i32) -> Box<i32> {
    Box::new(val)
}

fn main() {
    let d = get_heap_data(42);
    println!("{}", d)
}
```

## Structs

## Traits

## Enums
```rust
enum Siblings {
    Michael,
    Andreas,
    Helena
}

fn main() {
    let s = Siblings::Andreas;
    match s {
        Siblings::Michael => println!("Hi, Michael!"),
        Siblings::Helena => println!("Hi, Helena!"),
        _ => println!("Who the hell are you?")
    }
}

```

## Options
Options are a special type of enum.
```rust
// enum Option<T> {
//     Some(T),
//     None,
// }

fn get_optional() -> Option<i32> {
    // let out = Some(42);
    let out: Option<i32> = None;
    return out;
}

fn main() {
    let opt_val = get_optional();

    // match ensures that all cases are covered.
    let unwrapped: i32 = match opt_val {
        Some(v) => v,
        None => 19
    };
    println!("This value is after unwrapping: {}", unwrapped);

}
```

## Pattern matching
```rust
let i: i32 = 42;
match i {
    0 => println!("This is a 0"),
    _ => println!("This is not a 0")
}
```


## Multi-threading














## Wasm-pack
A wrapper around cargo that is specifically designed to compile to wasm.
```bash
cargo generate --git https://github.com/rustwasm/wasm-pack-template
wasm-pack build
```
Generates a `/pkg` directory that contains an npm-publishable package of wasm with a js-wrapper and ts-types.
This dir can be included directly into any npm-project with:
```
"dependencies": {
    "<your-wasm-package-name>": "file:../<path-to>/pkg"
    ...
}
```

## Language
```rust

```