# SVG

- units
  - percentages: always relative to the nearest parent svg-element or symbol-element. (More exactly: to the view-box of the element if given, otherwise to the elements actual size)
- g
  - don't have a width or height. They grow to their contents.
  - do allow `transform`, though
  - group attributes cascade down to all children
  - groups can be nested
- svg
  - do have a width and height
  - may be nested
  - may not have `transform`. Firefox does respect a svg-transform, but that's an exception.
    - https://stackoverflow.com/questions/33058883/nested-svg-ignores-transformation-in-chrome-and-opera
- transforms:
  - For SVG elements, the origin is, assuming we have no transform applied on the element itself or any of its ancestors inside the <svg> element, at the 0 0 point of the next parent svg.
    - https://css-tricks.com/transforms-on-svg-elements/

## Header

```svg
<?xml version="1.0" encoding="utf-8"?>

<!-- xmlns="http://www.w3.org/2000/svg" required for display in browsers -->
<svg width="100" height="30" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
```

## Rotations in svg's are relative to the nearest parent-svg, not to the root svg.

```svg
<svg id="outer" width="500" height="500" viewBox="0 0 100 100" style="background-color: lightblue;">

    <!-- indicating center of svg -->
    <rect x="49" y="49" width="2" height="2" fill="gray"></rect>

    <!-- rotated around `outer`'s top left -->
    <rect x="50" y="50" width="50" height="10" transform="rotate(10)" fill="#629c70"></rect>

    <svg id="inner" width="50" height="50" viewBox="0 0 100 100" x="50" y="50" style="background-color: red;">
        <!-- rotated around `inner`'s top left -->
        <rect x="0" y="0" width="100" height="20" transform="rotate(10)" fill="#62819c"></rect>
    </svg>
</svg>
```

## Mask and clipping

```svg
<svg width="100" height="100" style="background-color: lightblue;">

    <mask id="msk">
        <!-- everything black will be hidden -->
        <rect width="100" height="100" fill="black"></rect>
        <!-- everything white will be visible -->
        <circle cx="50" cy="50" r="20" fill="white"></circle>
    </mask>

    <!-- actually, more often we'd apply the mask to a sub-svg -->
    <rect x="10" y="10" width="80" height="80" fill="magenta" mask="url(#msk)"></rect>

</svg>
```

## Filter

Can be used to apply hand drawn styles:
https://fskpf.github.io/

## Path

Upper case: absolute, lower case: relative

- `M x,y`: place brush here
- `L x,y`: draw line to `x,y`
- `C x1,y1, x2,y2, xd,yd`: draw Bezier curve with first handle at `x1,y1`, second handle at `x2,y2` and target at `xd,yd`
- `S x2,y2, xd,yd`: like `C`, but assumes that first handle is mirror of the previous curve's second handle
- `Q x,y, xd,yd`: like `C`, but assumes that first and second handle are in same place
- `T`:
- `A`: elliptical arch
- `Z`: draw straight line to last `M` position

## `Defs` and `Use`

```svg
<svg id="outer" width="500" height="500" viewBox="0 0 100 100" style="background-color: lightblue;">

    <defs>
        <path id="blade" d="M 0,50 C 10,50, 0,30, 0,0 Z"></path>
    </defs>

    <use href="#blade" x="50" y="0" transform="" />
    <use href="#blade" x="50" y="0" transform="rotate(120 50 50)" />
    <use href="#blade" x="50" y="0" transform="rotate(240 50 50)" />
</svg>
```

## Placing a graphic in such a way that it can be easily rotated around its center

- graphic rel to `0, 0, 100, 100`
- graphic in group: provides rotation around `50 50`
- group in svg: provides translation and scaling

```svg
<svg width="500" height="300" id="outer" style="background-color: lightblue;">
    <!-- placed svg. viewBox set to `0 0 100 100` such that rotation is around `50 50` -->
    <svg id="placed" x="${xPos}" y="${yPos}" width="${width}" height="${width}" viewBox="0 0 100 100">
        <defs>
            <path id="blade" d="M 0,50 C 9,40, 0,30, 0,0 Z" fill="gray" stroke="black" stroke-width="0.1"></path>
        </defs>
        <!-- grouped, such that rotation applies to all at same time -->
        <g transform="rotate(${rotationDegrees} 50 50)">
            <use href="#blade" x="50" y="0" transform="" />
            <use href="#blade" x="50" y="0" transform="rotate(120 50 50)" />
            <use href="#blade" x="50" y="0" transform="rotate(240 50 50)" />
            <circle cx="50" cy="50" r="3" fill="gray" stroke="black" stroke-width="0.1"></circle>
        </g>
    </svg>
</svg>
```

## Common shapes

**Triangle**:

```svg
    <svg x="47" y="47" width="50" height="50" viewBox="0 0 100 100">
        <g transform="rotate(40 50 50)">
            <path d="M 50 0 L 93.3 75 L 6.7 75 Z"></path>
        </g>
    </svg>
```

# Cool effects

## wind-power header

```svg

<?xml version="1.0" encoding="utf-8"?>


<svg width="100" height="35" id="outer" xmlns="http://www.w3.org/2000/svg">

    <mask id="outlineMask">
        <rect width="100" height="35"></rect>
        <path d="M 0,0 L 100,0 L 100,30 C 80,25, 59,30, 40,30 S 10,20, 0, 25 Z" fill="white"></path>
    </mask>

    <defs>
        <linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#00e1ff" />
            <stop offset="100%" stop-color="#fcfcfc" />
        </linearGradient>
    </defs>

    <svg id="contents" mask="url(#outlineMask)">

        <rect width="100" height="35" fill="url(#skyGrad)"></rect>

        <svg id="fullBuilding" x="5" y="5" width="20" height="40" viewBox="0 0 100 200">

            <rect x="47.5" y="46" width="5" height="100" fill="white"></rect>
            <rect x="45" y="46" width="10" height="8" fill="white"></rect>

            <svg id="fullRotor" x="0" y="0" width="100" height="100" viewBox="0 0 100 100">
                <defs>
                    <path id="blade" d="M 0,50 C 9,40, 0,30, 0,0 Z" fill="white"></path>
                </defs>
                <g transform="rotate(10 50 50)">
                    <svg x="45" y="45" width="10" height="10" viewBox="0 0 100 100">
                        <g transform="rotate(15 50 50)">
                            <path d="M 50 0 L 93.3 75 L 6.7 75 Z" fill="white"></path>
                        </g>
                    </svg>
                    <use href="#blade" x="50" y="0" transform="" />
                    <use href="#blade" x="50" y="0" transform="rotate(120 50 50)" />
                    <use href="#blade" x="50" y="0" transform="rotate(240 50 50)" />
                    <circle cx="50" cy="50" r="2.5" fill="white"></circle>
                </g>
            </svg>

        </svg>

    </svg>

</svg>
```

## Hand drawn look

https://fskpf.github.io

## Grainy texture

```html
<svg id="mySvg">
  <filter id="grainy">
    <feTurbulence type="turbulence" baseFrequency="6" />
  </filter>
  <path d="..." filter="url(#grainy)" />
</svg>

.someElement { background: url(#mySvg); }

<!-- 
/ or to apply the filter to a dom-element: 
/ .myElement { 
/   filter: url(#grainy); 
/ }
-->
```
