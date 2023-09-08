# Blender


# Favorite hotkeys
- "F3": search
- "CTRL-ALT-0": put camera into current scene-view



# Navigation, origin, Cursor, apply

Cursor
- you can select a point in the scene that is not related to an object. That selection-location is your cursor.
- you can for example move an object's origin to the cursor (`object`->`set origin`->`to 3d cursor`).
- position cursor with <shift>+<right-click (dragging)>, commonly with snapping enabled ("magnet" icon next to proportional edit icon)
- pie-menu with <shift>+<s>

Origin
- every object has an origin. It's shown in orange when you select the object.
- rotating, scaling etc. are relative to the origin.
- often when editing all of an objects vertices, the origin is left behind in the initial position.


Apply all transforms
- <ctrl>-<a>
- moves the objects origin back into the world center




# Relation to WebGL
- geometry nodes: vertex shader
- shader: fragment shader




# Tips and tricks

## Painting one texture over another
Example: path over grass
- grass and path as textures
- both into a mix-node
- fraction = new texture (named "mask")
- paint onto mask texture inside scene with "texture-paint" mode

## Particles only on cerain areas
Example: trees only on selected area
- Create vertex group (Object data properties -> Vertex groups)
    - add vertices to vertex group either by selecting them and then hitting "assign"
    - or by painting on them in the "weight paint" mode
- Create particles
- In particle settings, select previously selected vertex group

## Object along curve
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
    - principled bdsf
        - metal high
        - roughness low
- more complex
    - combine simple water with
    - transparent bdsf
    - with fraction determined by lightpath-node (camera path)
- optional:
    - add principled volume node to output volume to create a murky sediment







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























## Exporting
When exporting, make sure that your textures are included and that all modifiers are applied. 



## Textures

### Color- aka. diffuse- aka. albedo-texture
The base color

### Bumpmap aka. normalmap
Normals. When using a normalmap-texture with a principled BSDF, make sure you connect it through a normal-map-node.

### Metalness map
Use with principled BSDF

### Roughness map








## Materials
