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

