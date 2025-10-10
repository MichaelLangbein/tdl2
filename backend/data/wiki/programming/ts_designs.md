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

## Drawing a path with FFT expansion

### Step 1: convert a circular svg path to samples, get the FFT

```python
#%% imports
import numpy as np
import matplotlib.pyplot as plt
from svgpathtools import parse_path
import json

#%% globals

T = 1.0
nrSamples = 1_000
time = np.arange(0.0, T, T / nrSamples)

#%% creating sample

# must be a single, closed path
svgPath = "m 45.976269,110.74576 c -3.43675,-10.73703 -1.677963,-22.652541 10.738985,-26.511863 20.4951,-6.370099 22.820339,12.416949 22.820339,12.416949 0,0 -0.671187,-16.444068 18.793219,-15.437287 19.464408,1.00678 22.484748,17.115253 15.437288,31.545761 -7.04746,14.43051 -24.87841,18.50214 -33.894914,27.51865 C 74.420501,130.8371 49.41302,121.4828 45.976269,110.74576 Z"
path = parse_path(svgPath)


signal = np.zeros(nrSamples, dtype=np.complex128)
for i in range(nrSamples):
    sample = path.point(i / nrSamples)
    signal[i] = sample
    
plt.scatter(np.real(signal), np.imag(signal))


#%% analyze and save

alphas = np.fft.fft(signal)
alphas /= nrSamples


output = {
    "sourcePath": svgPath,
    "T": T,
    "nrSamples": nrSamples,
    "samples": []
}
for freq, alpha in enumerate(alphas):
    output["samples"].append({
        "frequency": freq,
        "real": np.real(alpha),
        "imaginary": np.imag(alpha)
    })

with open("./results.json", "w") as f:
    json.dump(output, f, indent=4)



#%% filter frequencies and plot

def base(t, freq, T):
    return np.exp(-1.0j * t * freq * 2.0 * np.pi / T)


def filterAlphas(alphas, filterFunc):
    output = []
    for freq, alpha in enumerate(alphas):
        if filterFunc(alpha, freq):
            output.append({
                "frequency": freq,
                "alpha": alpha
            })
    return output


alphasReduced = filterAlphas(alphas, lambda a, f: np.abs(a) > 0.2)

print("Remaining frequencies: ", [a["frequency"] for a in alphasReduced])
plt.plot([a["frequency"] for a in alphasReduced], [np.abs(a["alpha"]) for a in alphasReduced])


#%% reproduce original image

def getTipPoint(t, alphaData):
    point = 0.0 + 0.0j
    for datum in alphaData:
        freq = datum["frequency"]
        alpha = datum["alpha"]
        vector = alpha * base(t, freq, T)
        point += vector
    return point


tipPoints = []
for t in time:
    tipPoint = getTipPoint(t, alphasReduced)
    tipPoints.append(tipPoint)

plt.scatter(np.real(signal), np.imag(signal), color='red')
plt.scatter(np.real(tipPoints), np.imag(tipPoints), color='blue')

```

### Step 2: display as rotating circles

```ts
import {select, type Selection} from "d3-selection";
import {scaleLinear, type ScaleLinear} from "d3-scale";

interface CircleDatum {
  cx: number,
  cy: number,
  touchPointX: number,
  touchPointY: number,
  frequency: number,
  amplitude: number
}

interface DecayingCircleDatum extends CircleDatum {
  age: number
}

interface Sample {
  frequency: number,
  real: number,
  imaginary: number
}

interface FrequencyData {
  "sourcePath": string,
  T: number,
  nrSamples: number,
  samples: Sample[]
}

function amplitude(sample: Sample) {
  return Math.sqrt(sample.real * sample.real + sample.imaginary * sample.imaginary);
}

const dataResponse = await fetch("results.json");
const data: FrequencyData = await dataResponse.json();

const freqs = data.samples.filter(s => amplitude(s) > 0.5);

const rootSvg = select<SVGSVGElement, undefined>('#rootSvg');


function frequenciesToPoints(freqs: Sample[], time: number, maxTime: number) {
  const points: CircleDatum[] = [];
  for (const f of freqs) {
    let lastPoint = points.at(-1);
    if (!lastPoint) lastPoint = {cx: 0, cy: 0, touchPointX: 0, touchPointY: 0, amplitude: 0, frequency: 0};

    const inBracks = - time * f.frequency * 2 * Math.PI / maxTime;
    const real = f.real * Math.cos(inBracks) - f.imaginary * Math.sin(inBracks);
    const imag = f.imaginary * Math.cos(inBracks) + f.real * Math.sin(inBracks);

    points.push({
      cx: lastPoint.touchPointX,
      cy: lastPoint.touchPointY,
      touchPointX: lastPoint.touchPointX + real,
      touchPointY: lastPoint.touchPointY + imag,
      frequency: f.frequency,
      amplitude: amplitude(f)
    });
  }

  return points;
}

function drawCircles(points: CircleDatum[], rootSvg: Selection<SVGSVGElement, undefined, HTMLElement, any>, rScale: ScaleLinear<number, number, never>) { 

  const circles = rootSvg.selectAll<SVGCircleElement, CircleDatum>('.circle')
    .data(points, (p) => p.frequency)
      .attr('cx', p => rScale(p.cx))
      .attr('cy', p => rScale(p.cy));
    circles.enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('cx', p => rScale(p.cx))
      .attr('cy', p => rScale(p.cy))
      .attr('r', p => rScale(p.amplitude))
      .attr('fill', 'rgba(90, 90, 90, 0.38)');
    circles.exit().remove();
}


function drawLines(points: CircleDatum[], rootSvg: Selection<SVGSVGElement, undefined, HTMLElement, any>, rScale: ScaleLinear<number, number, never>) {
  
  const lines = rootSvg.selectAll<SVGLineElement, CircleDatum>('.line')
    .data(points, p => p.frequency)
        .attr('x1', c => rScale(c.cx))
        .attr('x2', c => rScale(c.touchPointX))
        .attr('y1', c => rScale(c.cy))
        .attr('y2', c => rScale(c.touchPointY));
    lines.enter()
      .append('line')
      .attr('class', 'line')
      .attr('x1', c => rScale(c.cx))
      .attr('x2', c => rScale(c.touchPointX))
      .attr('y1', c => rScale(c.cy))
      .attr('y2', c => rScale(c.touchPointY))
      .attr('stroke', 'black')
      .attr('stroke-width', 0.1);
    lines.exit().remove();
}


const traceQueueLength = 150;
const traceQueue: DecayingCircleDatum[] = [];
function drawTrace(points: CircleDatum[], rootSvg: Selection<SVGSVGElement, undefined, HTMLElement, any>, rScale: ScaleLinear<number, number, never>) {
  const nextPoint = points.at(-1);
  if (!nextPoint) return;

  traceQueue.map(e => e.age += 1);
  traceQueue.push({...nextPoint, age: 0});
  if (traceQueue.length > traceQueueLength) traceQueue.shift();

  const traces = rootSvg.selectAll<SVGCircleElement, DecayingCircleDatum>('.trace')
    .data(traceQueue, c => `${c.cx}_${c.cy}`)
      .attr('fill', d => `rgba(255, 251, 8, ${Math.log(traceQueueLength / 2) - Math.log(d.age + 1)})`);
    traces.enter()
      .append('circle')
      .attr('class', 'trace')
      .attr('cx', p => rScale(p.touchPointX))
      .attr('cy', p => rScale(p.touchPointY))
      .attr('r', 0.5)
      .attr('fill', 'rgba(255, 251, 8, 1)')
    traces.exit().remove();
}



let i = -1;
const points = frequenciesToPoints(freqs, 0, data.T);
const scale = scaleLinear([0, Math.max(...points.map(p => p.amplitude))], [0, 30]);

async function loop() {
  const startTime = new Date().getTime();

  i = (i + 1) % data.nrSamples;
  const t = i * data.T / data.nrSamples;
  const points = frequenciesToPoints(freqs, t, data.T);

  drawCircles(points, rootSvg, scale);
  drawLines(points, rootSvg, scale);
  if (i % 10 === 0) drawTrace(points, rootSvg, scale);

  const endTime = new Date().getTime();
  const timePassed = endTime - startTime;
  const timeLeft = 5 - timePassed; 
  setTimeout(loop, timeLeft);
}


loop();
```
