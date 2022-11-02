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
// weak self

```


## Threading

```swift
// on main thread
// main does all UI activity
// prioretized over other threads
DispatchQueue.main.async {
    foo()
}

// on background thread
DispatchQueue.global(
    qos: .utility // quality of service: not very urgent 
).async {
    let data = callApi()
    DispatchQueue.main.async {
        updateUi(data)
    }
}
```

## Async await
Swift has the `async/await` keywords.
To call an async-function, you have to be in a `Task` context.
Tasks happen on the calling thread (usually the main thread) by default.

```
func callApi() async {
    let url = URL(string: "https://picksum.photos/200")
    let (data, _) = await URLSession.shared.data(from: url, delegate: nil)
    return data
}

Task(priority: .background) {
    let data = await callApi()
}
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

SwiftUI has a simple wrapper for SCNViews:
```swift
struct GameView: View {
    var body: some View {
        
        let baseScene = SCNScene()

        let figureScene = SCNScene(named: "figure.usdz")!
        let figure = figureScene.rootNode.childNodes[0].childNodes[0].childNodes[0]
        
        baseScene.rootNode.addChildNode(figure)
        baseScene.background.contents = UIColor.black
        
        let sceneView = SceneView(
            scene: baseScene,
            options: [
                .allowsCameraControl,
                .autoenablesDefaultLighting
            ]
        ).frame(
            width: UIScreen.main.bounds.width,
            height: UIScreen.main.bounds.height / 2
        )
        
        return sceneView
    }
}
```

*BUT*: this simple wrapper does not seem to support transparency.
For more control, you're better off creating your own view by wrapping UIKit's version of `SceneView`, called `SCNView`:

```swift
struct ScenekitView : UIViewRepresentable {
    let scene = SCNScene()

    func makeUIView(context: Context) -> SCNView {
        // create and add a camera to the scene
        let cameraNode = SCNNode()
        cameraNode.camera = SCNCamera()
        scene.rootNode.addChildNode(cameraNode)

        // place the camera
        cameraNode.position = SCNVector3(x: 10, y: 5, z: 10)
        cameraNode.look(at: SCNVector3(x: 0, y: 0, z: 0))

        // create and add a light to the scene
        let lightNode = SCNNode()
        lightNode.light = SCNLight()
        lightNode.light!.type = .omni
        lightNode.position = SCNVector3(x: 0, y: 10, z: 10)
        scene.rootNode.addChildNode(lightNode)

        // create and add an ambient light to the scene
        let ambientLightNode = SCNNode()
        ambientLightNode.light = SCNLight()
        ambientLightNode.light!.type = .ambient
        ambientLightNode.light!.color = UIColor.darkGray
        scene.rootNode.addChildNode(ambientLightNode)

        // retrieve the ship node
//        let ship = scene.rootNode.childNode(withName: "ship", recursively: true)!
        let geometry = SCNBox(width: 2.3, height: 1.2, length: 1.2, chamferRadius: 0.5)
        geometry.firstMaterial?.lightingModel = .physicallyBased
        let figure = SCNNode( geometry: geometry )
        scene.rootNode.addChildNode(figure)

        // animate the 3d object
        figure.runAction(SCNAction.repeatForever(SCNAction.rotateBy(x: 0, y: 2, z: 0, duration: 1)))

        // retrieve the SCNView
        let scnView = SCNView()
        return scnView
    }

    func updateUIView(_ scnView: SCNView, context: Context) {
        scnView.scene = scene

        // allows the user to manipulate the camera
        scnView.allowsCameraControl = true
        // show statistics such as fps and timing information
        scnView.showsStatistics = true
        // configure the view
        scnView.backgroundColor = UIColor.clear
    }
}

```



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
