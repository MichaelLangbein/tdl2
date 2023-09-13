# Blender


# Favorite hotkeys
- "F3": search
- "CTRL-ALT-0": put camera into current scene-view
- GeomNodes: "CTRL-SHIFT + Click on node" -> attaches current node to viewer-node



# Navigation, origin, Cursor, apply

Cursor
- you can select a point in the scene that is not related to an object. That selection-location is your cursor.
- you can for example move an object's origin to the cursor (`object`->`set origin`->`to 3d cursor`).
- position cursor with `<shift>+<right-click (dragging)>`, commonly with snapping enabled ("magnet" icon next to proportional edit icon)
- pie-menu with `<shift>`+`s`

Origin
- every object has an origin. It's shown in orange when you select the object.
- rotating, scaling etc. are relative to the origin.
- often when editing all of an objects vertices, the origin is left behind in the initial position.


Apply all transforms
- `<ctrl>-<a>`
- moves the objects origin back into the world center




# Tips and tricks

## Painting one texture over another
Example: path over grass
- grass and path as textures
- both into a mix-node
- fraction = new texture (named "mask")
- paint onto mask texture inside scene with "texture-paint" mode
Notes on texture-sizes and repeating:
- the path mask texture must have the same extent as the uv-map
- however, the grass- and path-images are allowed to be smaller and repeat.
- per default they, too, are perfectly covered by the uv-map (of course, since the uv-map is [0,1]^2).
- to repeat them, insert `texture-coordinate.uv --> mapping.vector --> image-texture.vector` and change the scaling.

## Particles only on certain areas
Example: trees only on selected area
- Create vertex group (Object data properties -> Vertex groups)
    - add vertices to vertex group either by selecting them and then hitting "assign"
    - or by painting on them in the "weight paint" mode
- Create particles
- In particle settings, select previously selected vertex group

## Object along curve
https://www.youtube.com/watch?v=MHWjhIr50f0
- Part 1: curve to (non-destructive) mesh
    - draw bezier curve
    - add geometry-node modifier
    - insert `<path-to-mesh>` node
        - input profile: `<curve-line-primitive>`
- Part 2: exposing uv-map coords
    - insert `<material node>` before output
        - insert shader
    - insert `<store named attribute>` after input, call it `gradient x`
        - as value, input a `<spline parameter>`(length)
    - insert `<store named attribute>` after profile, call it `gradient y`
        - as value, input a `<spline parameter>`(factor)
- Part 3: importing uv-map coords
    - in shader:
        - add `<attribute>` named `gradient x`
        - add `<attribute>` named `gradient y`
        - combine them (as fracs) with a `<combine-xyz>` as x and y values
        - input that combination into an `<image-texture>`'s uv-input
- Part 4: bake
    - object -> convert to mesh
    - texture -> bake


#### Old way
    Example: road-cube to follow along curve
    https://www.youtube.com/watch?v=lRK8UMudejg
    Part 1: road-segment and road-array
    - select road-segment
    - modifiers: add array-modifier (adjust factor-x, count, etc)
    Part 2: centering
    - road-segment: center object in world-center, set object-origin to word-origin
    - path: set origin to world center (by applying all transforms)
    Part 3:
    - select road
    - add modifier: curve
    - select curve
    Part 4: remove artifacts
    - apply array- and curve-modifiers
    - remove bezier curve



## Project texture onto 3d-object
- On the side: open uv-mapping view; load in an image
- Go into camera: select and `CTRL+0` (in object-mode)
- Add background image to camera
- Adjust camera resolution to fit background image
- Move camera so that image lies over model
- Select model in edit-mode.
- Project vertices onto texture: hit `u` followed by `uv-unwrap`
- Select model in object mode
- Add a material (ideally Emission)
- Click on yellow dot left of `color`, pick image


## Water shader
Simple and more complex: https://www.youtube.com/watch?v=olnZyeNBIfM
- Simple
    - musgrave-texture ->
    - bump ->
    - principled BSDF
        - metal high
        - roughness low
- more complex
    - combine simple water with
    - transparent BSDF
    - with fraction determined by lightpath-node (camera path)
- optional:
    - add principled volume node to output volume to create a murky sediment

## Wrap one object around another
Example: rotor-blades
1. create 1 cylinder (called nose)
2. create 1 blade
3. To blade, add array modifier
    1. set count to 3
    2. set factors all to 0
    3. set object offset to "nose"
    4. Make sure blade's origin is at same location as nose's origin (which doesn't have to be the word-center, though)
4. rotate nose by 120 degrees
5. Group blades and nose by first clicking blades, then shift-clicking nose, than `<ctrl>+p`


## Line-art post-processing
- > view-layer
    - check freestyle
    - check both outlines and hatching








# Optical physics behind shaders


## Metalness
Each material is either metallic or dielectric.

**Dielectric materials**
    - have both reflection and refraction + subsurface-scattering. (refraction: light enters surface at a new angle. subsurface-scattering: gets scattered out of material weeker and in any random direction)
    - reflection does not change the reflected light's color.
    - Most dielectric materials have an refraction-index of 0.5

**Metallic materials**
    - only have reflection, no refraction + subsurface-scattering at all
    - reflected light gets some color from the material (eg. reflections off bronze look reddish)


Principled BSDF: just drag the metallic slider - reflection color and subsurface scattering are automatically calculated. (Usually strictly 0 or 1)


## Fresnel
Reflection tends to be more intensive at larger angles: if you look at a ball, there will be stronger reflections *away* from the center, and less reflection in the middle.
However, the rougher the surface, the less Fresnel.
Every object, even bricks, have Fresnel... only potentially very diffuse.

Also: the principled BSDF shader automatically calculates Fresnel.

## Subsurface scattering
We already talked about subsurface scattering in the section on metalness. In rendering practice, however, we refer to SSS *only for fleshy* objects. We can leave the value at 0 for all other materials.


## Specular
You *can* use this to increase or decrease reflection ... but more physically correct would be to instead alter roughness.
Most dielectric materials have an refraction-index of 0.5.
There is a `specular` slider at the principled BSDF. It equals that refraction-index.
So for most dielectric materials, that sliders needs not be touched.
`Specular tint` is for the amount that the material colors reflected light ... but again, that happens automatically for metallic objects; so again no need for adjustment. (In fact, the slider has no effect on metallic objects)
Nice exception for both sliders: water.

## Anisotropic 
Makes reflections stronger in one direction than another. Example: frying pans?

## Sheen
Very subtle. For fabric. 

## Clearcoat
Some materials have two layers to them. Example: car paint (metallic) or protected wooden floor (dielectric) has a clear layer on top of it. Usually that is a very smooth surface (meaning: clearcoat-gloss all the way up. BTW: gloss is the opposite of roughness)

## IOR and transmission
Requires metallic == 0
Ideally with roughness == 0, base-color very light
Makes things like glass.






## Liquid
Some special tips for liquids:
 - Like glass: high transmission, bright base-color, low roughness
 - Make sure you re-calculate normals
 - Make sure there are no gaps between the liquid and anything it touches ... otherwise refractions won't be calculated correctly. Scale up liquid a tiny bit so it goes a little bit inside all its neighbors.
 - Color and (organic-)particle-load: don't change base-color! Instead, alter `volume` settings.
    - use `volume-absorption-shader` (note that this adds a separate shader next to the principled BSDF shader. It also goes to another output: `volume` instead of `surface`)
    - increase density
    - set color to the 99% brightest and 99% saturated ... all darkness comes from density.








# Concepts behind geometry nodes
- **input-nodes**:
    - example: index, position, normal, radius, edge-angle, textures,  ...
    - are what in shaders are called attributes (=per vertex data) and uniforms (=per shader data)
    - **selection**:
        - can be dragged to ghe group-input.selection field: then it's an input that is made availble from the geom-node view to the geom-node-modifier menu on the right hand side
            - the value of that custom input may be set to some vertex-group
        - can be some math-operation on the index-node
- **data-flow nodes**:
    - cylinder, transform, set-tilt, ...
    - change and pass geometry.
- **output-nodes**:
    - 



# Exporting to GLTF and Threejs
- https://discourse.threejs.org/t/how-can-we-use-blenders-3d-model-with-geometry-nodes-in-three-js/40116
- https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html

- Apply all modifiers (there's an option for that in the export menu)
    - importantly also applies geometry-nodes
- Bake every shader that has procedural inputs or non-standard-values to a BSDF.
    - including auto-generated objects like vines.
- In export menu, make sure that textures are included.



## Baking
https://www.youtube.com/watch?v=LLQFopN--LY
Bake anything that has more than texture-inputs to a BSDF shader.
- select object
- open shader-editor 
- add new image-node ... but *don't connect it to anything*.
- in right sidebar, go to `renderer > bake`
- clicking on bake will bake the selected object's surface onto the selected texture-node.
- now connect the newly baked-in texture-node to the BSDF's color-input
If you've messed with metallicness or other parameters, repeat the process for those.
If you've only changed the value of metallicness, but not plugged in a procedural input, instead of a full-fledged texture-node you can just put in a color-node.













## Textures

### Color- aka. diffuse- aka. albedo-texture
The base color

### Bumpmap aka. normalmap
Normals. When using a normalmap-texture with a principled BSDF, make sure you connect it through a normal-map-node.

### Metalness map
Use with principled BSDF

### Roughness map








## Materials
