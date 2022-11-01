# Resources
- Paul Hudson
- Sean Allen
- iOS Academy

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
- `Image`: SwiftUI Image - a swiftui view that can also load images from disk
- `UIImage`: UIKit Image - the old style version of `Image`, more compatible with apple's image-processors. Can also load images from disk, apply effects etc
- `CGImage`: Core graphics image: the raw pixel data of an image
- `CIImage`: Declarative list of instructions to be applied on an image



## VisionKit

```swift
import SwiftUI
import Vision

struct ContentView: View {
    @State var nrObservations = 0
    
    var body: some View {
        VStack {
            Image("TestImage").resizable().scaledToFit()
            Button("Detect") {
                detect()
            }
            Text("Detected \(nrObservations) faces")
        }
    }
    
    func detect() {
        guard let uiImage = UIImage(named: "TestImage") else {return}   // old style image container
        guard let cgImage = uiImage.cgImage else {return}               // raw pixels
        guard let orientation = CGImagePropertyOrientation(
            rawValue: UInt32(uiImage.imageOrientation.rawValue)) else {return}
        
        let request = VNDetectFaceRectanglesRequest()                                                   // task to execute
        let handler = VNImageRequestHandler(cgImage: cgImage, orientation: orientation, options: [:])   // context for task execution
        
        // do off main tread
        DispatchQueue.global().async {
            try? handler.perform([request])                             // execute task
            guard let observations = request.results else {return}      // get results
            handleObservations(observations)                            // pass results into View again
        }
    }
    
    func handleObservations(_ observations: [VNFaceObservation]) {
        self.nrObservations = observations.count
    }
}
```


## 3d-graphics: Scene-Kit



## Async, Concurency, Completion handler
- https://www.youtube.com/watch?v=hmu0v_25pgc
- https://www.youtube.com/watch?v=xiS5gJOIQxI




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
