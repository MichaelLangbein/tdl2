# Threejs

## General contepts
- `Renderer` an abstraction around your WebGL-context.
  - Data can only be shared within one renderer.
- `Scene`: a tree of objects
  - Handles nested transformations
- `Camera`: contains parameters that renderer later uses for projection
  - Does not need to be added to scene.

## Spaces

ObjectSpace --[ modelMatrix ]--> WorldSpace --[ viewMatrix ]--> CameraObjectSpace --[ projectionMatrix ]--> ScreenSpace

 - ObjectSpace = Could be anything. Often just as exported from blender.
 - WorldSpace  = right-handed.
 - ScreenSpace = [-1, 1]^3  aka ClippingSpace.

JS                                           -> GLSL
--------------------------------------------+-----------------------
obj.matrixWorld                              -> modelMatrix
cam.matrixWorldInverse                       -> viewMatrix
cam.projectionMatrix                         -> projectionMatrix
cam.matrixWorldInverse * object.matrixWorld  -> modelViewMatrix


## Important GLSL uniforms

 - `position`
  - in modelSpace
 - `cameraPosition`
  - in worldSpace
- `uv`
  - in modelSpace?

## Important JS variables

 - `object.matrix` is the matrix transform of the object.
 - `object.matrixWorld` is the matrix transform of the object, taking into consideration the matrix transform of the object's parent. (The object's parent may also have a parent, so the calculation of object.matrixWorld is recursive.). `matrix` and `matrixWorld` will be identical if the object has no parent.


## Text
https://r105.threejsfundamentals.org/threejs/lessons/threejs-align-html-elements-to-3d.html


## 3dTiles
https://github.com/nytimes/three-loader-3dtiles
https://github.com/NASA-AMMOS/3DTilesRendererJS


## Swapping render-buffers between processing-passes

Lessons learned: 
 - Even if you have many scenes, you only use one renderer. Otherwise they cannot share buffers.


```ts
import { AmbientLight, BoxGeometry, DepthFormat, DepthTexture, Mesh, MeshLambertMaterial, MeshPhongMaterial, OrthographicCamera, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, SphereGeometry, UnsignedShortType, Vector3, WebGLRenderer, WebGLRenderTarget } from 'three';


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;



const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    depth: true,
    canvas: canvas
});
if ( renderer.capabilities.isWebGL2 === false && renderer.extensions.has( 'WEBGL_depth_texture' ) === false ) {
    console.error(`D'oh!`);
}
/************************************************************************
 *              Render pass                                             *
 ************************************************************************/

const renderScene = new Scene();

const renderPassTarget = new WebGLRenderTarget(canvas.width, canvas.height);
renderPassTarget.depthTexture = new DepthTexture(canvas.width, canvas.height);
renderPassTarget.depthTexture.format = DepthFormat;
renderPassTarget.depthTexture.type = UnsignedShortType;
renderPassTarget.stencilBuffer = false;
renderer.setRenderTarget(renderPassTarget);

const renderCamera = new PerspectiveCamera(50, canvas.width / canvas.height, 0.01, 5);
renderScene.add(renderCamera);
renderCamera.position.set(0, 1.8, 3);
renderCamera.lookAt(new Vector3(0, 0, 0));

const light = new AmbientLight();
renderScene.add(light);

const box = new Mesh(new BoxGeometry(2, 2, 2), new MeshPhongMaterial({ color: `rgb(125, 50, 50)` }));
renderScene.add(box);



/************************************************************************
 *              Postprocessing                                          *
 ************************************************************************/

const postScene = new Scene();

const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0.01, 100);
postScene.add(postCamera);
postCamera.position.set(0, 0, -1);
postCamera.lookAt(new Vector3(0, 0, 0));

const postLight = new AmbientLight();
postScene.add(postLight);

const screenMaterial = new ShaderMaterial({
    uniforms: {
        cameraNear: { value: renderCamera.near },
        cameraFar: { value: renderCamera.far },
        tDiffuse: { value: null },
        tDepth: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        #include <packing>

        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform sampler2D tDepth;
        uniform float cameraNear;
        uniform float cameraFar;

        float readDepth( sampler2D depthSampler, vec2 coord ) {
            float fragCoordZ = texture2D( depthSampler, coord ).x;
            float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
            return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
        }

        void main() {
            vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
            float depth = readDepth( tDepth, vUv );

            gl_FragColor.rgb = 1.0 - vec3( depth );
            gl_FragColor.a = 1.0;
        }
    `
});
const decoyMaterial = new MeshLambertMaterial({ color: `rgb(14, 50, 14)` });
const screen = new Mesh(new PlaneGeometry(2, 2, 1, 1), screenMaterial);
postScene.add(screen);
screen.lookAt(postCamera.position);


const sphere = new Mesh(new SphereGeometry(0.125), new MeshLambertMaterial({color: `rgb(14, 15, 125)`}));
sphere.position.set(0.5, 0.5, 0);
postScene.add(sphere);



/************************************************************************
 *              Looping                                                 *
 ************************************************************************/

function loop(inMs: number) {
    setTimeout(() => {
        const start = new Date().getTime();

        // animation
        box.rotateY(0.01);

        // render to buffer
        renderer.setRenderTarget(renderPassTarget);
        renderer.render(renderScene, renderCamera);

        // renter to canvas
        renderer.setRenderTarget(null);
        screen.material.uniforms.tDiffuse.value = renderPassTarget.texture;
        screen.material.uniforms.tDepth.value = renderPassTarget.depthTexture;
        renderer.render(postScene, postCamera);

        const end = new Date().getTime();
        const delta = end - start;
        const msLeft = (1000 / 30) - delta;
        loop(msLeft);
    }, inMs);
}

loop(0);
```