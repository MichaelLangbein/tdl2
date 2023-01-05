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

## Structure


- **Assets**:
    - `AppName/Assets.xcassets`
    - Contains list of asset-**set**s.
    - Each set contains one or more variations on the same asset.
    - **SceneKit-assets**:
        - `AppName/AppName.scnassets`
        - Models are commonly saved in this kind of assets-catalog.
        - Can then be accessed like this: `let sceneShip = SCNScene(named: "art.scnassets/ship.dae")`
- Settings:
    - Project:
        - 
    - Targets:
        - Info:
            - Custom iOS Target Properties:
                - List here the permissions your app needs
        - Build-phases
            - Dependencies
            - Compile-sources: list of files to compile
            - Copy-bundle-resources: list of files to include in bundle
                - automatically includes all `.xcassets` and `.scnassets`
                - automatically includes all `.plist`s
- **`plist` files**, aka. property lists: 
    - XML-config-files
    

- For post-processing:
    - http://blog.simonrodriguez.fr/articles/2015/08/a_few_scntechnique_examples.html
    - https://github.com/kosua20/Technique-iOS 
    - AppName/Technique.plist
    - AppName/color2alpha.vsh (the SCNTechnique expects files in the same directory)
    - AppName/color2alpha.fsh (the SCNTechnique expects files in the same directory)
    - AppName/SceneKitAssetCatalog.scnassets/LoomisHead.usdz
    - Access:
        ```swift
        if let path = Bundle.main.path(forResource: "drops_technique", ofType: "plist") {
            if let dict1 = NSDictionary(contentsOfFile: path)  {
                let dict = dict1 as! [String : AnyObject]
                let technique = SCNTechnique(dictionary: dict)
                //Needs the screen size
                technique?.setValue(NSValue(cgSize: self.view.frame.size.applying(CGAffineTransform(scaleX: 2.0, y: 2.0))), forKeyPath: "size_screen")
                techniques["Drops"] = technique
            }
        }
        ```


                
.
├── Loooomity               <-------------------------------- code-dir
│   ├── Assets.xcassets     <-------------------------------- assets-dir
│   │   ├── AccentColor.colorset
│   │   │   └── Contents.json
│   │   ├── AppIcon.appiconset
│   │   │   └── Contents.json
│   │   └── Contents.json
│   ├── ContentView.swift
│   ├── LoooomityApp.swift
│   ├── Preview Content
│   │   └── Preview Assets.xcassets
│   │       └── Contents.json
│   └── README.md
└── Loooomity.xcodeproj     <------------------------------- settings-dir
    ├── project.pbxproj     <------------------------------- project-settings
    ├── project.xcworkspace  <------------------------------ workspace-settings (= which external resources to include, ...)
    │   ├── contents.xcworkspacedata
    │   ├── xcshareddata
    │   │   ├── IDEWorkspaceChecks.plist
    │   │   └── swiftpm
    │   │       └── configuration
    │   └── xcuserdata
    │       └── michaellangbein.xcuserdatad
    │           └── UserInterfaceState.xcuserstate
    └── xcuserdata          <------------------------------- userdata-settings
        └── michaellangbein.xcuserdatad
            └── xcschemes
                └── xcschememanagement.plist
                



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

** An update to a state-property of a view will cause the view's body to be re-calculated **

- `@State`: local, primitive state
- `@StateObject`: local or passable complex state (there's also `ObjectBinding`, but that's getting less used)
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



### Camera

#### **Camera operations**:
- To display a scene, you must designate a node whose camera property contains a camera object as the point of view.

- A camera’s direction of view is always along the negative z-axis of the node’s local coordinate system.

- To point the camera at different parts of your scene, use the position, rotation, or transform property of the node containing it.
    - `allowsCameraControl` let's the user move the camera-node around
    - You can customize that camera-control by setting a `defaultCameraController: SCNCameraController` object

- Alternatively, to ensure that a camera always points at a particular element of your scene even when that element moves, attach a `SCNLookAtConstraint` object to the node containing the camera.


#### **Camera-parameters**:
- `sensorHeight`: The vertical size of the camera's imaging plane, in millimeters. Default: 24mm.
- `focalLength`: The camera's focal length, in millimeters. Default: 50mm
- `fieldOfView`: The vertical or horizontal viewing angle of the camera. Default: 60°
- aspectRatio? See further down...

Explanation and calculation:
- The `sensorHeight` and `focalLength` properties determine the camera's horizontal and vertical viewing angles using terms that model physical camera devices. 
- Alternatively, you can work with viewing angle directly though the `fieldOfView` property. 
- For example, with the default sensor height of 24 mm and default focal length of 50 mm, the vertical field of view is 60°.
- Setting the `fieldOfView` property causes SceneKit to automatically recalculate the `focalLength` value, and setting the `sensorHeight` or `focalLength` property recalculates `fieldOfView`.


- **I think**: The camera gets it's aspect-ratio from the scene's frame.
    - Ah, indeed: 'The fieldOfView property measures view angle in a single primary direction, determined by this projectionDirection property. For the other direction, SceneKit automatically adjusts field of view depending on the aspect ratio of the view presenting the scene.' (from [here](https://developer.apple.com/documentation/scenekit/scncamera/2878134-projectiondirection))


- **I think**: that change to the aspect ratio is applied to the camera's projection-matrix as soon as the camera's node is attached to the scene.
    - That is in fact **not the case!**
    - Adding the camera to the scene does not update the camera's projection-matrix.
    - Remarkably, setting the camera's `zNear` and `zFar` properties does update the projection-matrix.
    - So we can conclude that SceneKit applies the aspect-ratio externally, maybe within SCNScene, but not through the camera's projection-matrix.
    - But there is something interesting going on: does SceneKit loose some image-data?
        - Experiment: Create a SCNScene with aspect-ratio 1.5.
        - Place an item on the very right edge of the camera-screen - on the part of the screen that lies outside of its central rectangle.
        - The camera's projection-matrix applied to that item will give a projected x-coordinate greater than one ... since the camera's projection-matrix doesn't normalize the screen by its width; i.e. it doesn't squish the screen's edges together.
        - Since this point is now outside of the clipping-spaces [-1, 1] range, it should not be visible.
        - If it is visible, that means that scene-kit does apply the aspect-ratio before sending the image to the clipping-space.


Remarkably, `threejs` does that differently. There, a `PerspectiveCamera` does take aspect-ratio as one of its constructor arguments. 

### Custom shaders

https://github.com/ApolloZhu/MetalTryout/issues/1
https://www.kodeco.com/5156-rwdevcon-2018-vault/lessons/16

- Standard: completely replace standard shader with `SCNProgram`
- Simplest: Snippet injection with `SCNShadable`
- Post-processing: Custom shaders with `SCNTechnique`


#### **With snippet injection**:
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

#### **With post processor**:
```swift
let color2alphaPass = [
    "draw": "DRAW_QUAD",                    // only draw a quad that encompasses whole screen
    "program": "color2alpha",               // name of shader-files
    "inputs": [
        "colorSampler": "COLOR",            // sampler2D of color-buffer
        "a_position": "a_position-symbol"   // atribute: vertex position
    ]
]

camera.technique = SCNTechnique.init(dictionary: [
    "passes": ["color2alpha": color2alphaPass],     // only one pass needed
    "sequence": ["color2alpha"],                    // order of passes
    "symbols": [                                    // list of symbols used in those passes
        "a_position-symbol": ["semantic": "vertex"]
    ]       // only need to provide vertex-position.
            // reason: color-buffer always available.
            // if you wanted to provide some variable
            // that scenekit doesn't know about,
            // use `technique.setValue`
            // and `type` instead of `semantic`
])
// Resoures placed at:
// https://developer.apple.com/documentation/bundleresources/placing_content_in_a_bundle
```
```glsl
// color2alpha.vsh
attribute vec4 a_position;
varying vec2 uv;

void main() {
    gl_Position = a_position;
    // simply passing along texture-coordinate
    uv = (a_position.uv + 1.0) * 0.5;
}
```
```glsl
// color2alpha.fsh
uniform sampler2D colorSampler;
varying vec2 uv;

void main() {
    vec4 oldColor = texture2D(colorSampler, uv);
    float whiteness = (oldColor.x + oldColor.y + oldColor.z) / 3.0;
    vec4 newColor = vec4(oldColor.xyz, whiteness);
    gl_FragColor = newColor;
}
```


## Async, Concurency, Completion handler
- https://www.youtube.com/watch?v=hmu0v_25pgc
- https://www.youtube.com/watch?v=xiS5gJOIQxI




## Using UIKit Components in SwiftUI Components
Details from this article: https://itnext.io/using-uiview-in-swiftui-ec4e2b39451b

** Updates in state re-render a whole tree in swift-ui. However, they don't cause a re-render of a ViewController.
Its UIViewControllerRepresentable will call the `update` method, but not the `create` method.
In other words: your complex state in ViewControllers is safe from re-calculating. **

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

# StoreKit2
https://www.revenuecat.com/blog/engineering/ios-in-app-subscription-tutorial-with-storekit-2-and-swift/#h-final-notes

- Since iOS 15
- In-App-Purchases (IAPs)
    - Consumable
    - Non-consumable: bought once, won't expire. Expl: unlocking premium features.
- Subscriptions:
    - Auto-renewing
    - Non-renewing
- You can test store-kit-behaviour without setting it up in app-store-connect by using a *StoreKit config-file*
    - For testing, attach this file to your scheme
    - For deployment, don't forget to remove it.
    - Maybe better copy the whole scheme for testing-purposes (so you can't accidentally publish it)

For a free-trial period followed by a one-time-purchase, make the actual app free and add a non-consumable IAP, that activates after 7 days.