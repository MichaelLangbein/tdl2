# Threejs

## Spaces

ObjectSpace --[ modelMatrix ]--> WorldSpace --[ viewMatrix ]--> CameraObjectSpace --[ projectionMatrix ]--> ScreenSpace

 - ObjectSpace = Could be anything. Often just as exported from blender.
 - WorldSpace  = right-handed.
 - ScreenSpace = [-1, 1]^3  aka ClippingSpace.

JS                                           -> GLSL
--------------------------------------------+-----------------------
obj.matrixWorld                              -> modelMatrix
cam.matrixWorldInverse                       -> viewMatrix
cam.projectionMatrix                         -> projectionMatrix
cam.matrixWorldInverse * object.matrixWorld  -> modelViewMatrix


## Important GLSL uniforms

 - `position`
   - in modelSpace
 - `cameraPosition`
   - in worldSpace

## Important JS variables

 - `object.matrix` is the matrix transform of the object.
 - `object.matrixWorld` is the matrix transform of the object, taking into consideration the matrix transform of the object's parent. (The object's parent may also have a parent, so the calculation of object.matrixWorld is recursive.). `matrix` and `matrixWorld` will be identical if the object has no parent.


## Text
https://r105.threejsfundamentals.org/threejs/lessons/threejs-align-html-elements-to-3d.html


## 3dTiles
https://github.com/nytimes/three-loader-3dtiles
https://github.com/NASA-AMMOS/3DTilesRendererJS
