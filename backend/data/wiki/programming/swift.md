# Swift

## Language basics

```swift
func increment(a: Int) -> Int {
    return a + 1
}

let list: [Int] = [1, 2, 3]

// anonymous functions: args are inside {}
// reason: {} symbolize a new scope
let list2 = list.map({ (v: Int) -> Int in  v + 1 })
// ruby/perl-like shorthand for anonymous functions
let list3 = list.map { $0 + 1 }
// regular functions are passable just as well
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

### Using UIKit Components in SwiftUI Components
Details from this article: https://itnext.io/using-uiview-in-swiftui-ec4e2b39451b

```swift

// option 1: wrapping a UIKitView
struct MyUiKitWrapper: UIViewRepresentable {
    func makeUIView() { /* ... do something with UIKit ... */ }
    func updateUIView() { /* ... do something with UIKit ... */ }
}

// option 2: wrapping a UIKitController
struct myUiKitControllerWrapper: UIViewControllerRepresentable {
    func makeUIViewController() { /* ... do something with UIKit ... */ }
    func updateViewController() { /* ... do something with UIKit ... */ }
}
```
