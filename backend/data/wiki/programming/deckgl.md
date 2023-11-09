# Maplibre

```ts
import './style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import mlg, { CustomLayerInterface } from 'maplibre-gl';
import mlc from 'maplibre-contour';
import { Camera, DirectionalLight, Matrix4, Scene, Vector3, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


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
  center: [11.3229, 47.2738],
  zoom: 13,
  style: {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    layers: [{
      id: 'hills',
      type: 'hillshade',
      source: 'hillshadeSource',
      layout: {visibility: 'visible'},
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
      id: 'urban-areas-fill',
      type: 'fill', 
      source: 'urbanAreas',
      layout: {},
      paint: {
        'fill-color': '#f08',
        "fill-opacity": 0.3
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
      urbanAreas: {
        type: 'geojson',
        data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_urban_areas.geojson'
      },
       terrainSource: {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        tileSize: 256
      },

    }
  }
});


const marker = new mlg.Marker({});
marker.setLngLat(map.getCenter()).addTo(map);

map.addControl(
  new mlg.TerrainControl({
      source: 'terrainSource',
      exaggeration: 1
  })
);



const modelOrigin = map.getCenter();
const modelOriginMercator = mlg.MercatorCoordinate.fromLngLat(modelOrigin, 40);
const modelTransform = {
  translateX: modelOriginMercator.x,
  translateY: modelOriginMercator.y,
  translateZ: modelOriginMercator.z,
  rotateX: Math.PI / 2,
  rotateY: 0, 
  rotateZ: 0,
  scale: modelOriginMercator.meterInMercatorCoordinateUnits()
}


const customLayer: CustomLayerInterface = {
  id: 'model',
  type: 'custom',
  renderingMode: '3d',

  onAdd(map, gl) {

    const camera = new Camera();
    const scene = new Scene();

    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);

    const loader = new GLTFLoader();
    loader.load(
      'https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf',
      (gltf) => { scene.add(gltf.scene); }
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
  },
  render(gl, matrix) {

    const rotationX = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), modelTransform.rotateX);
    const rotationY = new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), modelTransform.rotateY);
    const rotationZ = new Matrix4().makeRotationAxis(new Vector3(0, 0, 1), modelTransform.rotateZ);

    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
      .scale(new Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
      .multiply(rotationX).multiply(rotationY).multiply(rotationZ);

    // @ts-ignore
    this.camera.projectionMatrix = m.multiply(l);
    // @ts-ignore
    this.renderer.resetState();
    // @ts-ignore
    this.renderer.render(this.scene, this.camera);
    map.triggerRepaint();



  }
};

map.on('style.load', () => {
  map.addLayer(customLayer);
});

```




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

