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


## Passing callbacks to views

```swift
struct ContentView: View {
    @State var bodyText = "Initial body text "
    var body: some View {
        VStack {
            Text(bodyText)
            ProcessorView { result in
                bodyText = "Body text augmented with result: \(result)"
            }
        }
    }
}


struct ProcessorView: View {
    @State var state = "Awaiting user input"
    var onComplete: (_ result: String) -> Void
    
    var body: some View {
        Text(state)
        Button("Calculate") {
                state = "... calculating ..."
                DispatchQueue.global(qos: .background).async {
                    let sleepTime: UInt32 = 2 * 1000000
                    usleep(sleepTime)
                    DispatchQueue.main.async {
                        state = "... completed"
                        onComplete(state)
                    }
                }
            }
    }
}
```


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
            try? handler.perform([request])                         // execute task
            guard let observations = request.results else {return}  // get results
            DispatchQueue.main.async {
                handleObservations(observations)                    // pass results into View again
            }
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

### Custom shaders

https://github.com/ApolloZhu/MetalTryout/issues/1
https://www.kodeco.com/5156-rwdevcon-2018-vault/lessons/16

- Standard: completely replace standard shader with `SCNProgram`
- Simplest: Snippet injection with `SCNShadable`
- Post-processing: Custom shaders with `SCNTechnique`

```swift
// Example of snippet injection
let geometry = SCNBox(width: 2.3, height: 1.2, length: 1.2, chamferRadius: 0.5)
geometry.firstMaterial?.lightingModel = .physicallyBased
geometry.shaderModifiers = [
    SCNShaderModifierEntryPoint.fragment : """
        float whiteness = (_output.color.r + _output.color.g + _output.color.b) / 3.0;
        // both rgb and a range from 0 to 1
        _output.color.a = 1.0 - whiteness;
    """
]
let figure = SCNNode( geometry: geometry )
scene.rootNode.addChildNode(figure)
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


## Camera and photos


```txt
        .onChange(@State $uiImage)

               ▲ In/out
               │
               │                               (Renderable)
┌──────────────┼───────────────── ImagePickerView: UIViewControllerRepresentable ─────────────┐
│              │                               │                                              │
│              │                               └────────────────────────────────►┐            │
│              │                                                                 │            │
│              │             (Core-logic)              (handles core-events)     │            │
│ ┌────────────▼─────┐        ┌UIImagePickerController         ┌──Coordinator────┼────────┐   │
│ │@Binding: UIImage │        │                    │           │                 │        │   │
│ └──────────────────┘        │                    │           │    parent ◄─────┘        │   │
│                             │          │   didFinishPicking  │                          │   │
│                             │          └─────────┬───────────┼──► imagePickerController │   │
│                             └────────────────────┘           └──────────────────────────┘   │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```


```swift
struct ContentView: View {
    @State var uiImage: UIImage?
    @State var showPicker = false
    
    var body: some View {
        VStack {
            if let uim = uiImage {
                Image(uiImage: uim)
                    .resizable()
                    .scaledToFit()
            }

            Button("Load image") {
                showPicker = true
            }
        }.sheet(isPresented: $showPicker) {
            GeneralImagePicker(image: $uiImage, sourceType: .photoLibrary)
        }
    }
}


struct GeneralImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.presentationMode) private var presentationMode
    // select .camera here to get the image from the camera
    var sourceType: UIImagePickerController.SourceType = .photoLibrary
    
    
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let imagePicker = UIImagePickerController()
        imagePicker.allowsEditing = false
        imagePicker.sourceType = sourceType
        imagePicker.delegate = context.coordinator
        return imagePicker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
    
    final class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
     
        var parent: GeneralImagePicker
     
        init(_ parent: GeneralImagePicker) {
            self.parent = parent
        }
    
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage {
                parent.image = image
            }
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

}

```



### Processing photo-previews
https://developer.apple.com/tutorials/sample-apps/capturingphotos-camerapreview
https://www.youtube.com/watch?v=hg-6sOOxeHA


```swift
import SwiftUI
import UIKit
import AVFoundation


class PreviewStreamController: UIViewController {
    private var permissionGranted = false
    private let captureSession = AVCaptureSession()
    private let sessionQueue = DispatchQueue(label: "CameraPreviewStream")
    private var previewLayer = AVCaptureVideoPreviewLayer()
    var screenRect: CGRect! = nil
    
    override func viewDidLoad() {
        // checkPermission will prevent the sessionQueue (next lines)
        // from running as long as no permission has been given
        checkPermission()
        
        sessionQueue.async { [unowned self] in
            guard permissionGranted else { return }
            self.setupCaptureSession()
            self.captureSession.startRunning()
        }
    }
    
    override func willTransition(to newCollection: UITraitCollection, with coordinator: UIViewControllerTransitionCoordinator) {
        screenRect = UIScreen.main.bounds
        self.previewLayer.frame = CGRect(x: 0, y: 0, width: screenRect.size.width, height: screenRect.size.height)
        
        switch UIDevice.current.orientation {
        case UIDeviceOrientation.portraitUpsideDown:
            self.previewLayer.connection?.videoOrientation = .portraitUpsideDown
        case UIDeviceOrientation.landscapeLeft:
            self.previewLayer.connection?.videoOrientation = .landscapeLeft
        case UIDeviceOrientation.portrait:
            self.previewLayer.connection?.videoOrientation = .portrait
        case UIDeviceOrientation.landscapeRight:
            self.previewLayer.connection?.videoOrientation = .landscapeRight
        default:
            break
        }
    }
    
    func setupCaptureSession() {
        guard let videoDevice = AVCaptureDevice.default(.builtInDualWideCamera, for: .video, position: .back) else { return }
        guard let videoDeviceInput = try? AVCaptureDeviceInput(device: videoDevice) else { return }
        guard captureSession.canAddInput(videoDeviceInput) else { return }
        captureSession.addInput(videoDeviceInput)
        
        screenRect = UIScreen.main.bounds
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = CGRect(x: 0, y: 0, width: screenRect.size.width, height: screenRect.size.height)
        previewLayer.videoGravity = AVLayerVideoGravity.resizeAspectFill
        previewLayer.connection?.videoOrientation = .portrait
        
        // updates to ui (on main thread)
        DispatchQueue.main.async { [weak self] in
            self!.view.layer.addSublayer(self!.previewLayer)
        }
    }
    
    func checkPermission() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            permissionGranted = true
        case .notDetermined:
            requestPermission()
        default:
            permissionGranted = false
        }
    }
    
    func requestPermission() {
        sessionQueue.suspend()
        AVCaptureDevice.requestAccess(for: .video, completionHandler: { [unowned self] granted in
            self.permissionGranted = granted
            self.sessionQueue.resume()
        })
    }
}


struct CameraPreviewStreamView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> PreviewStreamController {
        return PreviewStreamController()
    }
    
    func updateUIViewController(_ uiViewController: PreviewStreamController, context: Context) {}
}

```


## Combine
Very much like Rx.






# Publishing an app

## Signing apps

## Provisioning

### Provisioning profile

