# Resources
- Paul Hudson


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


// guard
// some

```




# SwiftUI

## State

- `@State`: local, primitive state
- `@ObjectBinding`: local or passable complex state
- `$variableName`: two-way binding
- `@EnvironmentObject`: global state

```swift
@State var toggled = false
var body: some View {
    VStack {
        Text("The toggle is \(toggled ? "true" : "false")")
        Toggle("Toggle me", isOn: $toggled)
    }
}
```

```swift
// A class, not a struct. We want one instance shared between all views.
class StateContainer: ObservableObject {
    @Published var toggle = false
}

struct ContentView: View {
    @StateObject var sc = StateContainer()
    var body: some View {
        VStack {
            ToggleWriterView()
            ToggleReaderView()
        }
        .environmentObject(sc)
    }
}

struct ToggleReaderView: View {
    @EnvironmentObject var sc: StateContainer
    var body: some View {
        Text("The toggle is \(sc.toggle ? "on" : "off" )")
    }
}

struct ToggleWriterView: View {
    @EnvironmentObject var sc: StateContainer
    @State var toggled = false
    var body: some View {
        Toggle("toggle", isOn: $toggled)
            .onChange(of: toggled) {toggled in
                sc.toggle = toggled
            }
    }
}
```


## Images
- `Image`: SwiftUI Image - a view
- `UIImage`: UIKit Image - the old style version of `Image`, more compatible with apple's image-processors
- `CGImage`: Core graphics image
- `CIImage`: 



## VisionKit

1. Capture image
2. Detect landmarks and head-orientation
3. Visualize results



## 3d-graphics: Scene-Kit



## Using UIKit Components in SwiftUI Components
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


## Combine
Very much like Rx.
