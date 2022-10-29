# Swift

## Language basics

```swift

func increment(a: Int) -> Int {
    return a + 1
}

let list: [Int] = [1, 2, 3]
let list2 = list.map({ (v: Int) -> Int in  v + 1 })
let list3 = list.map { $0 + 1 }
let list4 = list.map(increment)



let dict = [
    200: "OK",
    403: "Access forbidden",
    404: "File not found",
    500: "Internal server error"
]

```

## SwiftUI

### State

- `@state`: local, primitive state
- `@objectBinding`: local or passable complex state
- `$variableName`: two-way binding
- `@environmentObject`: global state


### Important components


### Routing


### 3d-graphics: Scene-Kit

