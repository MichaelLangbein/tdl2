# Common frontend designs

## Scrollytelling

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .bg {
        background-color: beige;
        padding: 5rem;
      }

      .container {
        display: grid;
        background-color: aliceblue;
        width: 800px;

        grid-template-rows: [row0] 1fr [row1] 1fr [row2] 1fr [row3] 1fr [row4] 1fr [row5];
        grid-template-columns: [col0] 1fr [col1] 1fr [col2];
      }

      .tableEntry {
        background-color: antiquewhite;
        border: 1px dotted gray;
        margin: 1rem;
        height: 250px;
      }

      .map {
        background-color: aqua;
      }

      .blank {
        background-color: white;
      }

      #map3 {
        grid-area: row3 / col0 / row4 / col2;
      }
    </style>
  </head>
  <body>
    <div class="bg">
      <div id="container" class="container">
        <div id="text1" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="blank1" class="tableEntry blank"></div>

        <div id="text2" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="map1" class="tableEntry map"></div>

        <div id="text3" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="map2" class="tableEntry map"></div>

        <div id="map3" class="tableEntry map"></div>

        <div id="map4" class="tableEntry map"></div>
        <div id="text4" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
      </div>
    </div>
  </body>
  <script type="module" src="/src/main.ts"></script>
</html>
```

```ts
interface Settings {
  parent?: string;
  animatedElements: [
    {
      placeholders: string[];
      onScrolled: (degrees: { [placeholder: string]: number }) => void;
    }
  ];
}

/**
 * # Scrollyteller
 *
 * For each `animatedElement`:
 * - looks at the placeholders
 * - places the element at a position that is interpolated between the positions of the two most central placeholders, weight by their distance from the centers
 *
 * Design principles:
 * - The `animatedElement` itself is not being destroyed
 * - Nothing is painted into the placeholders, the `animatedElement` is a separate element with `fixed` positioning.
 *
 *
 * @TODOs:
 * - allow to pick different interpolation methods (linear, squared, cubic, ...)
 * - move the line of reference: on top of page, line should be pretty high up, on bottom of page, line should be pretty far down
 *
 */
class Scrollyteller {
  constructor(private settings: Settings) {
    const container = settings.parent ? document.querySelector(settings.parent) : document;
    if (!container) return;

    function interpolate(data: { weight: number; value: number }[]): number {
      const sumOfWeights = data.map((d) => d.weight).reduce((prev, curr) => prev + curr, 0);
      let mean = 0;
      for (const datum of data) {
        mean += (datum.value * datum.weight) / sumOfWeights;
      }
      return mean;
    }

    for (const animatedElementSettings of settings.animatedElements) {
      const animatedElement = document.createElement('div');
      animatedElement.style.position = 'fixed';
      animatedElement.style.setProperty('border', '1px solid red');
      settings.parent ? container.appendChild(animatedElement) : document.body.appendChild(animatedElement);

      const placeholders = animatedElementSettings.placeholders.map((ph) => container.querySelector(ph));

      function onScroll(scrollEvent: Event | null) {
        const viewPortHeight = window.innerHeight;

        const tops: { weight: number; value: number }[] = [];
        const lefts: { weight: number; value: number }[] = [];
        const widths: { weight: number; value: number }[] = [];
        const heights: { weight: number; value: number }[] = [];
        const degrees: { [key: string]: number } = {};

        for (const placeholder of placeholders) {
          if (placeholder) {
            const viewPortOffset = placeholder.getBoundingClientRect();
            const distToCenter = Math.abs(viewPortOffset.top + viewPortOffset.height / 2 - viewPortHeight / 2);
            if (distToCenter < viewPortHeight / 2) {
              tops.push({
                weight: 1 / distToCenter,
                value: viewPortOffset.top,
              });
              lefts.push({
                weight: 1 / distToCenter,
                value: viewPortOffset.left,
              });
              widths.push({
                weight: 1 / distToCenter,
                value: viewPortOffset.width,
              });
              heights.push({
                weight: 1 / distToCenter,
                value: viewPortOffset.height,
              });
              degrees[placeholder.id] = distToCenter;
            }
          }
        }

        const top = interpolate(tops);
        const left = interpolate(lefts);
        const width = interpolate(widths);
        const height = interpolate(heights);

        animatedElement.style.setProperty('top', `${top}px`);
        animatedElement.style.setProperty('left', `${left}px`);
        animatedElement.style.setProperty('width', `${width}px`);
        animatedElement.style.setProperty('height', `${height}px`);

        animatedElementSettings.onScrolled(degrees);
      }

      container.addEventListener('scroll', (scrollEvent) => onScroll(scrollEvent));
      onScroll(null);
    }
  }
}

const scr = new Scrollyteller({
  animatedElements: [
    {
      placeholders: ['#map1', '#map2', '#map3', '#map4'],
      onScrolled: (degrees) => console.log(degrees), // normally, animate elements here
    },
  ],
});
```

## Streetview like threejs scene

```ts
import './style.css';

import {
  AmbientLight,
  AnimationMixer,
  AxesHelper,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

async function addSphere(radius: number, imageUrl: string, scene: Scene) {
  const texture = await new TextureLoader().loadAsync(imageUrl);
  const sphere = new Mesh(
    new SphereGeometry(radius),
    new MeshBasicMaterial({
      side: DoubleSide,
      map: texture,
      transparent: true,
    })
  );
  scene.add(sphere);
}

async function addModel(pos: { x: number; y: number; z: number }, modelUrl: string, scene: Scene) {
  const gltf = await new GLTFLoader().loadAsync(modelUrl);
  const modelScene = gltf.scene;
  modelScene.position.set(pos.x, pos.y, pos.z);
  gltf.animations.map((a) => {
    const animationAction = mixer.clipAction(a, modelScene);
    animationAction.play();
  });
  scene.add(modelScene);
}

const renderer = new WebGLRenderer({
  antialias: true,
  canvas: canvas,
});

const camera = new PerspectiveCamera(60, canvas.width / canvas.height, 1, 100000);

const scene = new Scene();

const mixer = new AnimationMixer(scene);

const light = new DirectionalLight();
light.position.set(0, 10, 0);
scene.add(light);

const light2 = new AmbientLight();
scene.add(light2);

const ah = new AxesHelper(100);
ah.position.set(0, -0.2, 0);
scene.add(ah);

const loopTimeMS = 30;
function loop() {
  const startTimeMS = new Date().getTime();
  renderer.render(scene, camera);
  mixer.update(loopTimeMS / 1000);
  const endTimeMS = new Date().getTime();
  const timePassedMS = endTimeMS - startTimeMS;

  setTimeout(loop, loopTimeMS - timePassedMS);
}
loop();

const sensitity = 4.0;
const viewWidthRadians = (2 * Math.PI * camera.fov) / 360;
const viewHeightRadians = (viewWidthRadians * canvas.clientHeight) / canvas.clientWidth;
const worldYAxis = new Vector3(0, 1, 0);
const dragState = {
  dragging: false,
  lastPos: { x: 0, y: 0 },
};
function dragStart(evt: MouseEvent) {
  evt.preventDefault();
  dragState.dragging = true;
  dragState.lastPos.x = evt.clientX;
  dragState.lastPos.y = evt.clientY;
}
function drag(evt: MouseEvent) {
  evt.preventDefault();
  if (dragState.dragging) {
    const deltaX = evt.clientX - dragState.lastPos.x;
    const deltaY = evt.clientY - dragState.lastPos.y;
    dragState.lastPos.x += deltaX;
    dragState.lastPos.y += deltaY;

    const radiansHorizontal = (deltaX / canvas.clientWidth) * viewWidthRadians * sensitity;
    camera.rotateOnWorldAxis(worldYAxis, radiansHorizontal);
    const radiansVertical = (deltaY / canvas.clientHeight) * viewHeightRadians * sensitity;
    camera.rotateX(radiansVertical);
  }
}
function dragEnd(evt: MouseEvent) {
  evt.preventDefault();
  dragState.dragging = false;
  dragState.lastPos.x = 0;
  dragState.lastPos.y = 0;
}
canvas.addEventListener('mousedown', dragStart);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', dragEnd);
canvas.addEventListener('mouseout', dragEnd);

export interface Sphere {
  radius: number;
  url: string;
}
export interface Model {
  pos: { x: number; y: number; z: number };
  modelUrl: string;
}
export interface SceneConfig {
  spheres: Sphere[];
  models: Model[];
}

const spheres: Sphere[] = [
  { radius: 10, url: 'middleground_alpha.png' },
  { radius: 10000, url: 'background.jpeg' },
];
const spherePromises = spheres.map((s) => addSphere(s.radius, s.url, scene));

const models: Model[] = [
  {
    pos: { x: 100, y: -40, z: -550 },
    modelUrl: 'animated_wind_turbine_scaled.glb',
  },
];
const modelPromises = models.map((m) => addModel(m.pos, m.modelUrl, scene));

await Promise.all([...spherePromises, ...modelPromises]);
```

## UseRedux hook

```ts
export function useRedux<T>(selector: (state: State) => T): T {
  const currentState = stateMgmt.currentState();
  const currentlySelected = selector(currentState);
  const [state, setState] = useState(currentlySelected);
  stateMgmt.watch((state) => {
    const newSelected = selector(state);
    setState(newSelected);
  });
  return state;
}
```

## Map following along screen behind scrolly-telling text

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        min-width: 0;
        box-sizing: border-box;
        margin: 0;
      }
      .all {
        position: relative;
        width: 100%;
        background-color: antiquewhite;
      }
      .spacer {
        width: 80%;
        margin: auto;
        height: 400px;
        background-color: blueviolet;
      }
      .container {
        width: 80%;
        margin: auto;
        background-color: aqua;
        position: relative;

        .slider {
          /*imagine this is the map*/
          width: 100%;
          height: 300px;
          background-color: rgba(102, 51, 153, 0.567);
          position: sticky;
          top: 30vh;
        }

        .userContent {
          /*this is the info-text scrolling along */
          margin-top: -300px; /* cancelling out that the map needs space */
          position: relative; /* required so that over map */

          .textbox {
            font-size: medium;
            padding: 1rem;
            line-height: 1.5rem;
            word-wrap: break-word;
            background-color: white;
            border-radius: 1rem;
            margin: 0.5rem;
          }
          .left {
            width: 50%;
          }
          .broad {
            width: 100%;
          }
          .right {
            width: 50%;
            margin-left: 50%;
          }
        }
      }
    </style>
  </head>
  <body>
    <div class="all">
      <div class="spacer"></div>
      <div class="container">
        <div class="slider"></div>

        <div class="userContent">
          <div class="textbox left">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus laborum perspiciatis modi itaque
            repellat eveniet vero maiores! Repellendus mollitia ex minus aliquid deserunt a repellat. Perferendis quod
            quisquam voluptatum distinctio qui voluptates commodi. Voluptatum, veritatis. Ratione non maxime officia
            maiores sequi iure. Eligendi illum ab tenetur blanditiis eos nam quasi!
          </div>
          <div class="textbox broad">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis voluptatem quibusdam totam voluptate
            delectus esse repudiandae quo. Voluptas facere earum numquam ipsa facilis rem aspernatur amet, architecto,
            autem ab placeat ut dolores minus totam! Quibusdam ut repellat soluta culpa, earum eveniet, iste iusto nam
            sapiente iure, similique aut labore unde fugiat perferendis! Corrupti pariatur consectetur dolore, quibusdam
            iusto sit suscipit, accusamus voluptate ex quasi quos illum in dicta quis amet iure sunt necessitatibus
            impedit repudiandae. Sapiente deleniti, sunt vitae quibusdam rerum tenetur deserunt voluptates quam ut,
            consectetur alias eaque id? Asperiores reiciendis necessitatibus quibusdam est, officiis libero perspiciatis
            ad nihil.
          </div>
          <div class="textbox right">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, omnis nulla ipsam veniam dolore, tenetur
            aliquam corrupti nobis quibusdam sint quas temporibus explicabo, repellendus sit laboriosam? Blanditiis
            temporibus velit nam ea distinctio obcaecati doloribus recusandae at est totam, ut voluptate, quas labore
            doloremque pariatur, eius nostrum ad veniam eaque magni.
          </div>
          <div class="textbox broad">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum maxime illum, repellendus, voluptatum doloribus
            error architecto repudiandae quasi distinctio quae at explicabo soluta! Dolores maxime ipsam sequi
            praesentium harum iure veniam ratione temporibus vitae nobis fugit, earum similique dolore. Nesciunt
            accusantium nobis dolores doloribus at repudiandae ullam, repellat aliquam hic veritatis excepturi quod
            minus. Ipsum dolore laudantium delectus ipsam asperiores consequuntur rem magnam, nulla in libero est ea
            praesentium dolor necessitatibus iusto voluptate doloribus minima soluta magni qui sint quasi eveniet,
            laborum debitis. Delectus, a! Expedita doloremque illum deserunt et reprehenderit error quis, quaerat
            similique delectus at architecto, eligendi modi!
          </div>
        </div>
      </div>
      <div class="spacer"></div>
    </div>
  </body>
</html>
```
