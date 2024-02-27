# Maplibre

## Render paths

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/maplibre_render_paths.svg" />

## Conceptual model

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/maplibre_elevation_and_center.svg" />

Important variables here are calculated as follows:

<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/maplibre.jpg" />

## My understanding of threejs in maplibre

```ts
import './style.css';

import { CustomLayerInterface, LngLat, Map, MercatorCoordinate } from 'maplibre-gl';
import { AxesHelper, Camera, DirectionalLight, Matrix4, Scene, Vector3, Vector4, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Objective:
 * Given two known world-locations `model1Location` and `model2Location`,
 * place two three.js objects on those locations at the appropriate height of
 * the terrain.
 */

const map = new Map({
  container: 'map',
  center: { lon: 11.53, lat: 47.668 },
  zoom: 15,
  pitch: 60,
  bearing: -45,
  antialias: true,
  style: {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'baseColor', // Hides edges of terrain tiles, which have 'walls' going down to 0.
        type: 'background',
        paint: {
          'background-color': '#fff',
          'background-opacity': 1.0,
        },
      },
      {
        id: 'hills',
        type: 'hillshade',
        source: 'hillshadeSource',
        layout: { visibility: 'visible' },
        paint: { 'hillshade-shadow-color': '#473B24' },
      },
    ],
    terrain: {
      source: 'terrainSource',
      exaggeration: 0,
    },
    sources: {
      terrainSource: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256,
      },
      hillshadeSource: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256,
      },
    },
  },
});

/*
 * Helper function used to get threejs-scene-coordinates from mercator coordinates.
 * This is just a quick and dirty solution - it won't work if points are far away from each other
 * because a meter near the north-pole covers more mercator-units
 * than a meter near the equator.
 */
function calculateDistanceMercatorToMeters(from: MercatorCoordinate, to: MercatorCoordinate) {
  const mercatorPerMeter = from.meterInMercatorCoordinateUnits();
  // mercator x: 0=west, 1=east
  const dEast = to.x - from.x;
  const dEastMeter = dEast / mercatorPerMeter;
  // mercator y: 0=north, 1=south
  const dNorth = from.y - to.y;
  const dNorthMeter = dNorth / mercatorPerMeter;
  return { dEastMeter, dNorthMeter };
}

async function loadModel() {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync('https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf');
  const model = gltf.scene;
  return model;
}

const model1 = await loadModel();
const model2 = model1.clone();

// Known locations. We'll infer the elevation of those locations once terrain is loaded.
const sceneOrigin = new LngLat(11.53, 47.67);
const model1Location = new LngLat(11.531, 47.67);
const model2Location = new LngLat(11.5245, 47.6675);

// Configuration of the custom layer for a 3D model, implementing `CustomLayerInterface`.
const customLayer: CustomLayerInterface = {
  id: '3d-model',
  type: 'custom',
  renderingMode: '3d',

  onAdd(map: Map, gl: WebGL2RenderingContext) {
    /**
     * Setting up three.js scene.
     * We're placing model1 and model2 in such a way that the whole scene fits over the terrain.
     */

    this.camera = new Camera();
    this.scene = new Scene();
    // In threejs, y points up - we're rotating the scene such that it's y points along maplibre's up.
    this.scene.rotateX(Math.PI / 2);
    // In threejs, z points toward the viewer - mirroring it such that z points along maplibre's north.
    this.scene.scale.multiply(new Vector3(1, 1, -1));
    // We now have a scene with (x=east, y=up, z=north)

    const light = new DirectionalLight(0xffffff);
    // Making it just before noon - light coming from south-east.
    light.position.set(50, 70, -30).normalize();
    this.scene.add(light);

    // Axes helper to show how threejs scene is oriented.
    const axesHelper = new AxesHelper(100);
    this.scene.add(axesHelper);

    // Getting model elevations (in meters) relative to scene origin from maplibre's terrain.
    const sceneElevation = map.queryTerrainElevation(sceneOrigin) || 0;
    const model1Elevation = map.queryTerrainElevation(model1Location) || 0;
    const model2Elevation = map.queryTerrainElevation(model2Location) || 0;
    const model1up = model1Elevation - sceneElevation;
    const model2up = model2Elevation - sceneElevation;

    // Getting model x and y (in meters) relative to scene origin.
    const sceneOriginMercator = MercatorCoordinate.fromLngLat(sceneOrigin);
    const model1Mercator = MercatorCoordinate.fromLngLat(model1Location);
    const model2Mercator = MercatorCoordinate.fromLngLat(model2Location);
    const { dEastMeter: model1east, dNorthMeter: model1north } = calculateDistanceMercatorToMeters(
      sceneOriginMercator,
      model1Mercator
    );
    const { dEastMeter: model2east, dNorthMeter: model2north } = calculateDistanceMercatorToMeters(
      sceneOriginMercator,
      model2Mercator
    );

    model1.position.set(model1east, model1up, model1north);
    model2.position.set(model2east, model2up, model2north);

    this.scene.add(model1);
    this.scene.add(model2);

    // Use the MapLibre GL JS map canvas for three.js.
    this.renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });

    this.renderer.autoClear = false;
  },

  render(gl, mercatorMatrix) {
    // `queryTerrainElevation` gives us the elevation of a point on the terrain
    // **relative to the elevation of `center`**,
    // where `center` is the point on the terrain that the middle of the camera points at.
    // If we didn't account for that offset, and the scene lay on a point on the terrain that is
    // below `center`, then the scene would appear to float in the air.
    const offsetFromCenterElevation = map.queryTerrainElevation(sceneOrigin) || 0;
    const sceneOriginMercator = MercatorCoordinate.fromLngLat(sceneOrigin, offsetFromCenterElevation);

    const sceneTransform = {
      translateX: sceneOriginMercator.x,
      translateY: sceneOriginMercator.y,
      translateZ: sceneOriginMercator.z,
      scale: sceneOriginMercator.meterInMercatorCoordinateUnits(),
    };

    const mercatorToClipspaceMatrix = new Matrix4().fromArray(mercatorMatrix);
    const sceneToMercatorMatrix = new Matrix4()
      .makeTranslation(sceneTransform.translateX, sceneTransform.translateY, sceneTransform.translateZ)
      .scale(new Vector3(sceneTransform.scale, -sceneTransform.scale, sceneTransform.scale));

    /**
     * About those matrices
     * ====================
     *
     * Generally, we know that:
     * SpaceA -->[transfMx]--> SpaceB
     * where
     * transfMx = (axes of B, expressed in A)^-1
     *
     * Thus we have
     * MercatorSpace -->[sceneCenterInWorldMx^-1]--> SceneSpace
     * and inversely:
     * SceneSpace --->[sceneCenterInWorldMx]---> MercatorSpace
     *
     * And finally, from `maplibre-gl-js/src/geo/transform` we know that:
     * "The mercatorMatrix can be used to transform points from mercator coordinates ([0, 0] nw, [1, 1] se) to clip space."
     * That is:
     * MercatorSpace -->[mercatorMx]--> ClipSpace
     *
     * In summary:
     * - Points from the threejs scene come in in Scene-coordinates.
     * - With sceneToMercatorMatrix these become Mercator-coordinates.
     * - With mercatorToClippingMatrix these become Clipping-coordinates.
     */

    this.camera.projectionMatrix = mercatorToClipspaceMatrix.multiply(sceneToMercatorMatrix);
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    map.triggerRepaint();
  },
};

await map.once('load');
console.log('loaded');
map.addLayer(customLayer);

/**
 * Objective 2:
 * place the center in such a way
 * that the left (at pixels 200/200 out of 800/400)
 * is pointing exactly at 11.5245, 47.6675
 */

function mercMin(a: MercatorCoordinate, b: MercatorCoordinate) {
  return new MercatorCoordinate(a.x - b.x, a.y - b.y, a.z - b.z);
}

function mercAdd(a: MercatorCoordinate, b: MercatorCoordinate) {
  return new MercatorCoordinate(a.x + b.x, a.y + b.y, a.z + b.z);
}
setTimeout(() => {
  const centerCurrentLonLat = map.getCenter();
  const centerCurrentElevation = map.queryTerrainElevation(centerCurrentLonLat); // will actually always be 0
  const centerCurrentMerc = map.transform.locationCoordinate(centerCurrentLonLat);
  if (centerCurrentElevation) centerCurrentMerc.z = centerCurrentElevation;
  const leftPx = new Point(200, 200);
  const leftCurrentMerc = map.transform.pointCoordinate(leftPx, map.terrain);
  const targetLonLat = model2Location;
  const targetElevation = map.queryTerrainElevation(targetLonLat);
  const targetMerc = map.transform.locationCoordinate(targetLonLat);
  if (targetElevation) targetMerc.z = targetElevation;
  const deltaMerc = mercMin(targetMerc, leftCurrentMerc);
  const centerNewMerc = mercAdd(centerCurrentMerc, deltaMerc);
  const centerNewLonLat = map.transform.coordinateLocation(centerNewMerc);

  map.setCenter(centerNewLonLat);
}, 3000);
```

## Explanations for `mercatorMatrix` from original stackoverflow-issue

Some explanations on the matrices used here.
Deckgl passes to `render(gl, matrix)` the `mercatorMatrix`, which is calculated like so:

```ts
// from https://github.com/maplibre/maplibre-gl-js/blob/8edbac09725f807aae91009d31c30c3d5168b066/src/geo/transform.ts#L841C9-L885C43
// some own comments added

/**
 * `mat4.perspective` here creates what is usually called the projectionMatrix:
 * converting from cameraSpace (= mercator * worldSize, rel. to camera)
 * to clipSpace [-1,1]^4
 */

// matrix for conversion from location to GL coordinates (-1 .. 1)
m = new Float64Array(16) as any;
mat4.perspective(m, this._fov, this.width / this.height, nearZ, farZ);
// ... some stuff cut ...
mat4.scale(m, m, [1, -1, 1]);

/**
 * the next operations create what is often called the cameraMatrix:
 * converts from worldSpace (= mercator)
 * to camera space (= mercator * worldSize [in pixel], rel. to camera)
 * The cameraMatrix is the inverse of the camera's worldMatrix.
 * Indeed, if you execute the inverse of the below operations, you'll get the camera's position in worldSpace.
 */

mat4.translate(m, m, [0, 0, -this.cameraToCenterDistance]); // 4. go back a distance
mat4.rotateX(m, m, this._pitch); // 3. apply pitch
mat4.rotateZ(m, m, this.angle); // 2. apply angle
mat4.translate(m, m, [-x, -y, 0]); // 1. take the map center (in pixels) and move it to 0/0/0

// The mercatorMatrix can be used to transform points from mercator coordinates
// ([0, 0] nw, [1, 1] se) to GL coordinates.
this.mercatorMatrix = mat4.scale([] as any, m, [this.worldSize, this.worldSize, this.worldSize]);
/**
 * ^\__ this mercatorMatrix is what's being passed to `CustomLayer.render(gl, matrix)`
 */
```

Note how terrain doesn't play a role here - if it were only for the `mercatorMatrix`, all our models would be displayed flat at sea-level.

Terrain is only being used later in the `projectionMatrix`:

```ts
// from https://github.com/maplibre/maplibre-gl-js/blob/8edbac09725f807aae91009d31c30c3d5168b066/src/geo/transform.ts#L859C1-L869C1
// some own comments added
/**
 * Only in the next steps, in creating the `projMatrix`, does `elevation` come into play.
 * Maplibre seems makes use of this elevation in final rendering, but it's not being passed to `CustomLayer.render`.
 * The effect of `.translate(m, m, [0, 0, -this.elevation])` is that every object in your threejs scene is being lifted up by elevation.
 * Elevation equals the height of the special point called *center*, which is the point of the terrain that is exactly in the viewport's center.
 * This happens *even if your object is actually at a point on the terrain that's higher or lower than center*.
 */

// scale vertically to meters per pixel (inverse of ground resolution):
mat4.scale(m, m, [1, 1, this._pixelPerMeter]);

// ... some stuff cut ...

// matrix for conversion from location to GL coordinates (-1 .. 1)
mat4.translate(m, m, [0, 0, -this.elevation]); // elevate camera over terrain
this.projMatrix = m;
```

I've documented these points in a simple github-issue: https://github.com/maplibre/maplibre-gl-js/issues/3427

## Placing scene is such a way that left eye looks exactly at some given point

# Deckgl

## Integration

https://deck.gl/docs/get-started/using-with-map#base-maps-renderers

Deckgl can either be _overlaid_ oder _interleaved_ with a base-mapping-library (leaflet, maplibre, ol):

- overlaid: second canvas over orignal canvas, controls synced. Simple and robust.
- interleaved: deckgl rendered into original canvas. Original base-mapping-library gets full rendering control. Pretty dependent on base-lib, but allows e.g. labels to show over deckgl-layers.

- Overlaid with maplibre: https://github.com/visgl/deck.gl/blob/8.9-release/examples/get-started/pure-js/mapbox/app.js
- Interleaved with maplibre: https://deck.gl/gallery/mapbox-layer
- Overlaid with ol: https://github.com/visgl/deck.gl/blob/8.9-release/examples/get-started/pure-js/openlayers/app.js

## Performance

Deckgl expects you to create new layer instances with every animation frame.
It then goes ahead and compares those new instances with data already present on the gpu and only updates what has changed.
Comparisons are shallow.

- use `*Scale` parameters for animations where possible. These are simply `uniform`s that cost almost nothing to update
- `get*` parameters are used to get the values for `attribute`s.
  - prefer concrete values over functions
  - use `updateTrigger`s to only recalculate `attribute`s when certain values change
- `data` contains the base data that the `get*` functions operate on
  - don't create new instances with every update; instead update in place

## Animation