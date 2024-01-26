# Common frontend designs

## Scrollytelling

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Commodi tempore pariatur quaerat quo nobis ea nisi itaque
            nihil iusto eos, quis, ipsum nam necessitatibus
            consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="blank1" class="tableEntry blank"></div>

        <div id="text2" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Commodi tempore pariatur quaerat quo nobis ea nisi itaque
            nihil iusto eos, quis, ipsum nam necessitatibus
            consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="map1" class="tableEntry map"></div>

        <div id="text3" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Commodi tempore pariatur quaerat quo nobis ea nisi itaque
            nihil iusto eos, quis, ipsum nam necessitatibus
            consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="map2" class="tableEntry map"></div>

        <div id="map3" class="tableEntry map"></div>

        <div id="map4" class="tableEntry map"></div>
        <div id="text4" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Commodi tempore pariatur quaerat quo nobis ea nisi itaque
            nihil iusto eos, quis, ipsum nam necessitatibus
            consequuntur nemo libero hic labore id.
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
      onScrolled: (degrees: {
        [placeholder: string]: number;
      }) => void;
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
    const container = settings.parent
      ? document.querySelector(settings.parent)
      : document;
    if (!container) return;

    function interpolate(
      data: { weight: number; value: number }[]
    ): number {
      const sumOfWeights = data
        .map((d) => d.weight)
        .reduce((prev, curr) => prev + curr, 0);
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
      settings.parent
        ? container.appendChild(animatedElement)
        : document.body.appendChild(animatedElement);

      const placeholders = animatedElementSettings.placeholders.map(
        (ph) => container.querySelector(ph)
      );

      function onScroll(scrollEvent: Event | null) {
        const viewPortHeight = window.innerHeight;

        const tops: { weight: number; value: number }[] = [];
        const lefts: { weight: number; value: number }[] = [];
        const widths: { weight: number; value: number }[] = [];
        const heights: { weight: number; value: number }[] = [];
        const degrees: { [key: string]: number } = {};

        for (const placeholder of placeholders) {
          if (placeholder) {
            const viewPortOffset =
              placeholder.getBoundingClientRect();
            const distToCenter = Math.abs(
              viewPortOffset.top +
                viewPortOffset.height / 2 -
                viewPortHeight / 2
            );
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

      container.addEventListener('scroll', (scrollEvent) =>
        onScroll(scrollEvent)
      );
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
import {
  AnimationMixer,
  AxesHelper,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import {
  FirstPersonControls,
  GLTF,
  GLTFLoader,
} from 'three/examples/jsm/Addons.js';
import './style.css';

/** ----------------------- helpers ----------------------- */
function unique<T>(data: T[]): T[] {
  const unq: T[] = [];
  for (const datum of data) {
    if (!unq.includes(datum)) unq.push(datum);
  }
  return unq;
}

async function loadGLTFs(
  urls: string[]
): Promise<{ [key: string]: GLTF }> {
  const loader = new GLTFLoader();
  const results: { [key: string]: GLTF } = {};
  const all$ = urls.map(async (url) => {
    const result = await loader.loadAsync(url);
    results[url] = result;
    return true;
  });
  const success = await Promise.all(all$);
  return results;
}

async function loadTextures(
  urls: string[]
): Promise<{ [key: string]: Texture }> {
  const loader = new TextureLoader();
  const results: { [key: string]: Texture } = {};
  const all$ = urls.map(async (url) => {
    const result = await loader.loadAsync(url);
    results[url] = result;
  });
  const success = await Promise.all(all$);
  return results;
}

/** ----------------------- settings ----------------------- */
interface SphereSettings {
  distanceMeter: number;
  textureEquirect: string;
}

interface ObjectSettings {
  position: XYZ;
  modelGlb: string;
}

interface XYZ {
  x: number;
  y: number;
  z: number;
}

interface Settings {
  centerCoords: XYZ;
  spheres: SphereSettings[];
  objects: ObjectSettings[];
}

const response = await fetch('./settings.json');
const settings: Settings = await response.json();

const modelUrls = unique(settings.objects.map((o) => o.modelGlb));
const textureUrls = unique(
  settings.spheres.map((s) => s.textureEquirect)
);

/**------------------------------- code ----------------------- */
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = new WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas,
});

const scene = new Scene();

const camera = new PerspectiveCamera(
  60,
  canvas.width / canvas.height
);
scene.add(camera);

const controls = new FirstPersonControls(camera, canvas);
controls.autoForward = false;

const helper = new AxesHelper(10);
scene.add(helper);

const sun = new DirectionalLight('white', 3);
sun.position.set(0, 10, 0);
sun.lookAt(new Vector3(0, 0, 0));
scene.add(sun);

const mixer = new AnimationMixer(scene);

const modelDict = await loadGLTFs(modelUrls);
for (const [url, modelScene] of Object.entries(modelDict)) {
  const s = settings.objects.find((s) => s.modelGlb === url);
  if (s) {
    modelScene.scene.position.set(
      s.position.x,
      s.position.y,
      s.position.z
    );
    scene.add(modelScene.scene);
    modelScene.animations.map((a) => mixer.clipAction(a).play());
  }
}

const textureDict = await loadTextures(textureUrls);
for (const [url, texture] of Object.entries(textureDict)) {
  const s = settings.spheres.find((s) => s.textureEquirect === url);
  if (s) {
    const geometry = new SphereGeometry(s.distanceMeter);
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
    });
    const object = new Mesh(geometry, material);
    scene.add(object);
  }
}

function render() {
  renderer.render(scene, camera);
  controls.update(1.0);
  mixer.update(0.06);
  setTimeout(render, 60);
}
render();
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
