# Blender

## Modelling
Simple 20min tutorial on basics of face-sculpting: https://www.youtube.com/watch?v=GiUAmKZRf9I&t=939s





## Draping

### Shrink-wrap modifier

### UV-mapping






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

### Metalness
Each material is either metallic or dielectric.

**Dielectric materials**
    - have both reflection and refraction + subsurface-scattering. (refraction: light enters surface at a new angle. subsurface-scattering: gets scattered out of material weeker and in any random direction)
    - reflection does not change the reflected light's color.
    - Most dielectric materials have an refraction-index of 0.5

**Metallic materials**
    - only have reflection, no refraction + subsurface-scattering at all
    - reflected light gets some color from the material (eg. reflections off bronze look reddish)


Principled BSDF: just drag the metallic slider - reflection color and subsurface scattering are automatically calculated. (Usually strictly 0 or 1)


### Fresnel
Reflection tends to be more intensive at larger angles: if you look at a ball, there will be stronger reflections *away* from the center, and less reflection in the middle.
However, the rougher the surface, the less Fresnel.
Every object, even bricks, have Fresnel... only potentially very diffuse.

Also: the principled BSDF shader automatically calculates Fresnel.

### Subsurface scattering
We already talked about subsurface scattering in the section on metalness. In rendering practice, however, we refer to SSS *only for fleshy* objects. We can leave the value at 0 for all other materials.


### Specular
You *can* use this to increase or decrease reflection ... but more physically correct would be to instead alter roughness.
Most dielectric materials have an refraction-index of 0.5.
There is a `specular` slider at the principled BSDF. It equals that refraction-index.
So for most dielectric materials, that sliders needs not be touched.
`Specular tint` is for the amount that the material colors reflected light ... but again, that happens automatically for metallic objects; so again no need for adjustment. (In fact, the slider has no effect on metallic objects)
Nice exception for both sliders: water.

### Anisotropic 
Makes reflections stronger in one direction than another. Example: frying pans?

### Sheen
Very subtle. For fabric. 

### Clearcoat
Some materials have two layers to them. Example: car paint (metallic) or protected wooden floor (dielectric) has a clear layer on top of it. Usually that is a very smooth surface (meaning: clearcoat-gloss all the way up. BTW: gloss is the opposite of roughness)

### IOR and transmission
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
