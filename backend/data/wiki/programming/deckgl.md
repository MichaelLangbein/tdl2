# Maplibre

```ts
import './style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import mlg, { CustomLayerInterface, LngLat } from 'maplibre-gl';
import mlc from 'maplibre-contour';
import { AnimationMixer, Camera, DirectionalLight, DoubleSide, Matrix4, Mesh, MeshPhongMaterial, PlaneGeometry, Scene, Vector3, Vector4, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { ArcLayer } from '@deck.gl/layers/typed';
import {ScenegraphLayer, SimpleMeshLayer} from '@deck.gl/mesh-layers/typed';
import { MapboxLayer } from '@deck.gl/mapbox/typed';
import { GLBLoader } from '@loaders.gl/gltf';
import {mat4} from 'gl-matrix';
import {mercatorZfromAltitude} from 'maplibre-gl/src/geo/mercator_coordinate';
import {clamp} from 'maplibre-gl/src/util/util';



const demSource = new mlc.DemSource({
  url: 'https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png',
  encoding: 'mapbox',
  maxzoom: 12,
  // offload contour line computation to a web worker
  worker: true
});


// calls maplibregl.addProtocol to register a dynamic vector tile provider that
// downloads raster-dem tiles, computes contour lines, and encodes as a vector
// tile for each tile request from maplibre
demSource.setupMaplibre(mlg as any);




const map = new mlg.Map({
  container: 'app',
  center: [11.532, 47.670],
  zoom: 16,
  pitch: 60,
  bearing: -90,
  style: {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    layers: [{
      id: 'baseColor',  // hides edges of terrain tiles, which have 'walls' going down to 0
      type: 'background',
      paint: {
        'background-color': '#fff',
        "background-opacity": 1.0
      }
    }, {
      id: 'hills',
      type: 'hillshade',
      source: 'hillshadeSource',
      layout: { visibility: 'visible' },
      paint: {
        'hillshade-exaggeration': 0.25,
        "hillshade-shadow-color": '#473B24'
      }
    }, {
      id: 'contours',
      type: 'line',
      source: 'contourSource',
      'source-layer': 'contours',
      paint: {
        'line-opacity': 0.5,
        "line-width": ['match', ['get', 'level'], 1, 1, 0.5]
      }
    }, {
      id: 'contour-text',
      type: 'symbol',
      source: 'contourSource',
      'source-layer': 'contours',
      filter: ['>', ['get', 'level'], 0],
      paint: {
        "text-halo-color": 'white',
        "text-halo-width": 1
      },
      layout: {
        "symbol-placement": 'line',
        "text-size": 10,
        "text-field": [
          'concat',
          ['number-format', ['get', 'ele'], {}],
          '\''
        ],
        "text-font": ['Noto Sans Bold']
      }
    }, {
      id: 'imission',
      source: 'imissionSource',
      type: 'fill',
      paint: {
        'fill-color': '#f38',
        "fill-opacity": 0.3
      }
    }],
    terrain: {
      source: 'terrainSource',
      exaggeration: 1
    },
    sources: {
      hillshadeSource: {
        type: 'raster-dem',
        tileSize: 512,
        maxzoom: 12,
        tiles: [demSource.sharedDemProtocolUrl]
      },
      contourSource: {
        type: 'vector',
        maxzoom: 15,
        tiles: [
          demSource.contourProtocolUrl({
            overzoom: 1,
            elevationKey: 'ele',
            levelKey: 'level',
            contourLayer: 'contours',
            thresholds: {
              11: [200, 1000],
              12: [100, 500],
              13: [100, 500],
              14: [50, 200],
              15: [20, 100]
            }
          })
        ]
      },
      terrainSource: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256
      },
      imissionSource: {
        type: 'geojson',
        data: 'http://localhost:5173/imission_lenggries.geojson'
      }
    }
  }
});


// const marker = new mlg.Marker({});
// marker.setLngLat(map.getCenter()).addTo(map);

map.addControl(
  new mlg.TerrainControl({
    source: 'terrainSource',
    exaggeration: 1
  })
);

// const popup = new mlg.Popup({ closeOnClick: false })
//   .setLngLat(map.getCenter())
//   .setHTML('<h1>Hello World!</h1>')
//   .addTo(map);


map.transform._calcMatrices = () => {
  const _this = map.transform;
  if (!_this.height) return;

  const halfFov = _this._fov / 2;
  const offset = _this.centerOffset;
  const x = _this.point.x, y = _this.point.y;
  _this.cameraToCenterDistance = 0.5 / Math.tan(halfFov) * _this.height;
  _this._pixelPerMeter = mercatorZfromAltitude(1, _this.center.lat) * _this.worldSize;

  let m = mat4.identity(new Float64Array(16) as any);
  mat4.scale(m, m, [_this.width / 2, -_this.height / 2, 1]);
  mat4.translate(m, m, [1, -1, 0]);
  _this.labelPlaneMatrix = m;

  m = mat4.identity(new Float64Array(16) as any);
  mat4.scale(m, m, [1, -1, 1]);
  mat4.translate(m, m, [-1, -1, 0]);
  mat4.scale(m, m, [2 / _this.width, 2 / _this.height, 1]);
  _this.glCoordMatrix = m;



  // Calculate the camera to sea-level distance in pixel in respect of terrain
  const cameraToSeaLevelDistance = _this.cameraToCenterDistance + _this._elevation * _this._pixelPerMeter / Math.cos(_this._pitch * 2 * Math.PI/ 360);
  // In case of negative minimum elevation (e.g. the dead see, under the sea maps) use a lower plane for calculation
  const minElevation = Math.min(_this.elevation, _this._minEleveationForCurrentTile);
  const cameraToLowestPointDistance = cameraToSeaLevelDistance - minElevation * _this._pixelPerMeter / Math.cos(_this._pitch * 2 * Math.PI/ 360);
  const lowestPlane = minElevation < 0 ? cameraToLowestPointDistance : cameraToSeaLevelDistance;

  // Find the distance from the center point [width/2 + offset.x, height/2 + offset.y] to the
  // center top point [width/2 + offset.x, 0] in Z units, using the law of sines.
  // 1 Z unit is equivalent to 1 horizontal px at the center of the map
  // (the distance between[width/2, height/2] and [width/2 + 1, height/2])
  const groundAngle = Math.PI / 2 + _this._pitch;
  const fovAboveCenter = _this._fov * (0.5 + offset.y / _this.height);
  const topHalfSurfaceDistance = Math.sin(fovAboveCenter) * lowestPlane / Math.sin(clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));

  // Find the distance from the center point to the horizon
  const horizon = _this.getHorizon();
  const horizonAngle = Math.atan(horizon / _this.cameraToCenterDistance);
  const fovCenterToHorizon = 2 * horizonAngle * (0.5 + offset.y / (horizon * 2));
  const topHalfSurfaceDistanceHorizon = Math.sin(fovCenterToHorizon) * lowestPlane / Math.sin(clamp(Math.PI - groundAngle - fovCenterToHorizon, 0.01, Math.PI - 0.01));

  // Calculate z distance of the farthest fragment that should be rendered.
  // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
  const topHalfMinDistance = Math.min(topHalfSurfaceDistance, topHalfSurfaceDistanceHorizon);
  const farZ = (Math.cos(Math.PI / 2 - _this._pitch) * topHalfMinDistance + lowestPlane) * 1.01;

  // The larger the value of nearZ is
  // - the more depth precision is available for features (good)
  // - clipping starts appearing sooner when the camera is close to 3d features (bad)
  //
  // Smaller values worked well for mapbox-gl-js but deckgl was encountering precision issues
  // when rendering it's layers using custom layers. This value was experimentally chosen and
  // seems to solve z-fighting issues in deckgl while not clipping buildings too close to the camera.
  const nearZ = _this.height / 50;

  // matrix for conversion from location to GL coordinates (-1 .. 1)
  m = new Float64Array(16) as any;
  mat4.perspective(m, _this._fov, _this.width / _this.height, nearZ, farZ);

  // Apply center of perspective offset
  m[8] = -offset.x * 2 / _this.width;
  m[9] = offset.y * 2 / _this.height;

  mat4.scale(m, m, [1, -1, 1]);
  mat4.translate(m, m, [0, 0, -_this.cameraToCenterDistance]);
  mat4.rotateX(m, m, _this._pitch);
  mat4.rotateZ(m, m, _this.angle);
  mat4.translate(m, m, [-x, -y, 0]);

  // The mercatorMatrix can be used to transform points from mercator coordinates
  // ([0, 0] nw, [1, 1] se) to GL coordinates.
  _this.mercatorMatrix = mat4.scale([] as any, m, [_this.worldSize, _this.worldSize, _this.worldSize]);

  // scale vertically to meters per pixel (inverse of ground resolution):
  mat4.scale(m, m, [1, 1, _this._pixelPerMeter]);

  // matrix for conversion from location to screen coordinates in 2D
  _this.pixelMatrix = mat4.multiply(new Float64Array(16) as any, _this.labelPlaneMatrix, m);

  // matrix for conversion from location to GL coordinates (-1 .. 1)
  mat4.translate(m, m, [0, 0, -_this.elevation]); // elevate camera over terrain
  _this.projMatrix = m;
  _this.invProjMatrix = mat4.invert([] as any, m);

  // matrix for conversion from location to screen coordinates in 2D
  _this.pixelMatrix3D = mat4.multiply(new Float64Array(16) as any, _this.labelPlaneMatrix, m);

  // Make a second projection matrix that is aligned to a pixel grid for rendering raster tiles.
  // We're rounding the (floating point) x/y values to achieve to avoid rendering raster images to fractional
  // coordinates. Additionally, we adjust by half a pixel in either direction in case that viewport dimension
  // is an odd integer to preserve rendering to the pixel grid. We're rotating this shift based on the angle
  // of the transformation so that 0°, 90°, 180°, and 270° rasters are crisp, and adjust the shift so that
  // it is always <= 0.5 pixels.
  const xShift = (_this.width % 2) / 2, yShift = (_this.height % 2) / 2,
      angleCos = Math.cos(_this.angle), angleSin = Math.sin(_this.angle),
      dx = x - Math.round(x) + angleCos * xShift + angleSin * yShift,
      dy = y - Math.round(y) + angleCos * yShift + angleSin * xShift;
  const alignedM = new Float64Array(m) as any as mat4;
  mat4.translate(alignedM, alignedM, [dx > 0.5 ? dx - 1 : dx, dy > 0.5 ? dy - 1 : dy, 0]);
  _this.alignedProjMatrix = alignedM;

  // inverse matrix for conversion from screen coordinaes to location
  m = mat4.invert(new Float64Array(16) as any, _this.pixelMatrix);
  if (!m) throw new Error('failed to invert matrix');
  _this.pixelMatrixInverse = m;

  _this._posMatrixCache = {};
  _this._alignedPosMatrixCache = {};

  const camPos = _this.getCameraPosition()
  // console.log(`elev over center: ${_this._elevation}, alt. under cam: ${camPos.altitude}, lowest plane: ${lowestPlane}`);
}




const threejsLayer: CustomLayerInterface = {
  id: 'model',
  type: 'custom',
  renderingMode: '3d',

  onAdd(map, gl) {

    const camera = new Camera();
    const scene = new Scene();

    const mixer = new AnimationMixer(scene);

    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);

    const loader = new GLTFLoader();
    loader.load(
      'http://localhost:5173/windturbine.glb',
      (gltf) => {
        scene.add(gltf.scene);
        scene.traverse(data => {
          if (data.isObject3D) {
            if (data instanceof Mesh) {
              if (data.material instanceof Array) {
                data.material.map(m => m.side = DoubleSide);
              } else {
                data.material.side = DoubleSide;
              }
            }
          }
        });
        // @ts-ignore
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }
    );

    const renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    renderer.autoClear = false;


    // @ts-ignore
    this.camera = camera;
    // @ts-ignore
    this.renderer = renderer;
    // @ts-ignore
    this.scene = scene;
    // @ts-ignore
    this.mixer = mixer;
  },
  render(gl, matrix) {
    
    const modelOrigin = new LngLat(11.53, 47.67);
    const modelElevation = map.terrain ? map.terrain.getElevationForLngLatZoom(modelOrigin, map.getZoom()) : 0;
    const modelOriginMercator = mlg.MercatorCoordinate.fromLngLat(modelOrigin, 0);
  
    const terrainCenterElevation = map.transform.elevation;
    const deltaMetersZ = modelElevation - terrainCenterElevation;
    const mercatorPerMeter = modelOriginMercator.meterInMercatorCoordinateUnits();
    const deltaMercatorZ = deltaMetersZ * mercatorPerMeter;

    const modelTransform = {
      translateX: modelOriginMercator.x,
      translateY: modelOriginMercator.y,
      translateZ: modelOriginMercator.z + deltaMercatorZ,
      rotateX: Math.PI / 2,
      rotateY: 0,
      rotateZ: 0,
      scale: modelOriginMercator.meterInMercatorCoordinateUnits()
    };

    // const {lngLat: cameraOrigin, altitude: cameraElevation } = map.transform.getCameraPosition();
    // const cameraOriginMercator = mlg.MercatorCoordinate.fromLngLat(cameraOrigin, cameraElevation);
    // const cameraTransform = {
    //   translateX: cameraOriginMercator.x,
    //   translateY: cameraOriginMercator.y,
    //   translateZ: cameraOriginMercator.z,
    //   rotateX: map.transform.pitch,
    //   rotateY: 0,
    //   rotateZ: map.transform.angle,
    //   scale: 1
    // };

    // position in world space (== universal mercator, top-left = [0,0], bot-right=[1,1])
    // model-coordinates => world-coordinates
    const rotationX = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), modelTransform.rotateX);
    const rotationY = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), modelTransform.rotateY);
    const rotationZ = new Matrix4().makeRotationAxis(new Vector3(0, 0, 1), modelTransform.rotateZ);
    // const modelMatrix = new Matrix4()
    //   .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
    //   .scale(new Vector3(modelTransform.scale, modelTransform.scale, modelTransform.scale))
    //   .multiply(rotationX).multiply(rotationY).multiply(rotationZ);

    // // inverse of camera's modelMatrix
    // // world-coordinates => world-coordinates relative to camera position
    // const cameraRotationX = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), cameraTransform.rotateX);
    // const cameraRotationY = new Matrix4().makeRotationAxis(new Vector3(0, 1, 0), cameraTransform.rotateY);
    // const cameraRotationZ = new Matrix4().makeRotationAxis(new Vector3(0, 0, 1), cameraTransform.rotateZ);
    // const cameraModelMatrix = new Matrix4()
    //   .makeTranslation(cameraTransform.translateX, cameraTransform.translateY, cameraTransform.translateZ)
    //   // .scale(new Vector3(map.transform.worldSize, map.transform.worldSize, map.transform.worldSize))
    //   .multiply(cameraRotationX).multiply(cameraRotationY).multiply(cameraRotationZ);
    // const viewMatrix = cameraModelMatrix.invert();

    // // world-coordinates relative to camera => clip-space [-1, 1]^3
    // const focalLength = map.transform.cameraToCenterDistance;
    // const zNear = 0.001;
    // const zFar = 100;
    // const aspectRatio = map.transform.width / map.transform.height;
    // const projectionMatrix = 
    // //new Matrix4().fromArray(mat4.perspective(new Float32Array(16), map.transform.fov, map.transform.width/map.transform.height, 10, 10000));
    //  new Matrix4().fromArray([  // column-major order
    //    focalLength/aspectRatio, 0,           0,                         0,
    //    0,                       focalLength, 0,                         0,
    //    0,                       0,           (zFar+zNear)/(zFar-zNear), -1, 
    //    0,                       0,           2*zFar*zNear/(zNear-zFar), 0
    //  ]);

    // const myCameraProjectionMatrix = projectionMatrix.multiply(viewMatrix.multiply(modelMatrix)); 


    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
      .scale(new Vector3(modelTransform.scale, modelTransform.scale, modelTransform.scale))
      .multiply(rotationX).multiply(rotationY).multiply(rotationZ);
    const cameraProjectionMatrix = m.multiply(l);

    // @ts-ignore
    this.camera.projectionMatrix = cameraProjectionMatrix;
    // @ts-ignore
    this.renderer.resetState();
    // @ts-ignore
    this.renderer.render(this.scene, this.camera);
    // @ts-ignore
    this.mixer.update(0.05);
    map.triggerRepaint();



  }
};

const modelLayer = new MapboxLayer<ScenegraphLayer>({
  id: 'modelLayer',
  // @ts-ignore
  type: ScenegraphLayer, // maplibre/deck-utils will instantiate on its own
  scenegraph: 'http://localhost:5173/windturbine.glb',
  data: [
     {coordinates: [map.getCenter().lng, map.getCenter().lat]},
  ],
  getPosition: d => d.coordinates,
  getOrientation: d => [0, 0, 0],
  _animations: {
    '*': {speed: 5}
  },
  sizeScale: 500,
  _lighting: 'pbr'
});

const simpleModelLayer = new MapboxLayer<SimpleMeshLayer>({
  id: 'simpleModel',
  // @ts-ignore
  type: SimpleMeshLayer,
  data: [{
    position: [map.getCenter().lng, map.getCenter().lat]
  }],
  mesh: 'http://localhost:5173/windturbine.glb',
  loaders: [GLBLoader],
  getPosition: d => d.position,
  getOrientation: d => [0, 0, 0]
});

const arcLayer = new MapboxLayer<ArcLayer>({
  id: 'arcLayer',
  // @ts-ignore
  type: ArcLayer,
  getWidth: 12,
  getSourcePosition: d => d.from.coordinates,
  getTargetPosition: d => d.to.coordinates,
  getSourceColor: d => [d.inbound, 140, 0],
  getTargetColor: d => [d.outbound, 140, 0],
  data: [
    { 
      from: { coordinates: [map.getCenter().lng, map.getCenter().lat] },
      to: { coordinates: [map.getCenter().lng + 0.5, map.getCenter().lat] },
      inbound: 100,
      outbound: 255
    }
  ]
});

map.on('style.load', () => {
  map.addLayer(threejsLayer);
  // map.addLayer(arcLayer as any);
  // map.addLayer(modelLayer as any);
  // map.addLayer(simpleModelLayer as any);
});

```


<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/maplibre.jpg" width="100%" />


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
 * to camera space (= mercator * worldSize, rel. to camera)
 * The cameraMatrix is the inverse of the camera's worldMatrix. 
 * Indeed, if you execute the inverse of the below operations, you'll get the camera's position in worldSpace.
 */

mat4.translate(m, m, [0, 0, -this.cameraToCenterDistance]);
mat4.rotateX(m, m, this._pitch);
mat4.rotateZ(m, m, this.angle);
mat4.translate(m, m, [-x, -y, 0]);

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
 * The effect of `.translate(m, m, [0, 0, -this.evelation])` is that every object in your threejs scene is being lifted up by elevation.
 * Elevation equals the height of the specail point called *center*, which is the point of the terrain that is exactly in the viewports center.
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

# Deckgl

## Integration
https://deck.gl/docs/get-started/using-with-map#base-maps-renderers

Deckgl can either be *overlaid* oder *interleaved* with a base-mapping-library (leaflet, maplibre, ol):
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

