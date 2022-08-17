# Deckgl

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

