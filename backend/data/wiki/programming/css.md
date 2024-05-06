# Position

- _static_: The default
- _relative_: Default + allows top, bottom, left and right
  - useful as parent for absolute div's
- _absolute_: Relative to nearest positioned parent (positioned: anything but static)
  - **note**: the parents of absolutely positioned elements won't automatically grow to encompass their child anymore.
  - **note**: absolutely positioned children can no longer use their parents for width-percentages.
- _fixed_: Similar to absolute, but positioned relative to the browser viewport. Scrolling will not move this element.
  - width:100% doesn't always seem to work with position:fixed. You're better off with left:0;right:0 then.
- _sticky_:
  - element is confined to its parent
  - but within those confines, it slides along with the viewport like fixed.
  - **note**: sticky will only work if:
    - the parent has an absolute height
      - except if the parent is the window
    - and the parent has overflow: visible (https://css-tricks.com/dealing-with-overflow-and-position-sticky/)
      - a sticky element “sticks” to its nearest ancestor that has a “scrolling mechanism” (created when overflow is hidden, scroll, auto, or overlay), even if that ancestor isn’t the nearest actually scrolling ancestor. This effectively inhibits any “sticky” behavior. (From MDN Web Docs)
      - great script to check why sticky is not working: https://element.how/css-debugging-position-sticky-not-working/#:~:text=are%20expected%20to.-,Why%20isn't%20position%3Asticky%20working%3F,same%20height%20as%20its%20parent.
    - if the parent is a flex-box, the sticky item should have `align-self: flex-start` (https://stackoverflow.com/questions/44446671/my-position-sticky-element-isnt-sticky-when-using-flexbox)

# Display

Display refers to how an element relates to its peers or its children.
Per default, div's are displayed in block-style, while spans are displayed inline-style.

- _flow_: the standard layout-algorithm
  - z-index is not implemented in this algorithm
- _block_: Element starts on a new line \& takes up the entire width.
  May contain other block or inline elements.
  Elements that are block-level by default include <div>, <p>, <h1>-<h6>, <ul>, <li>, \& <canvas>.
- _inline_: Element can start anywhere on an existing line.
  Height and width properties have no effect.
  Elements that are inline by default include <span>, <input>, <button>, \&<img>.
- _inline-block_: Element is displayed inline but height and width may be defined. May also be used with grid, flex, or table as these are block-level elements.
- _none_: Removes this element \& all children (to just make an item invisible but still take up space on the page use the visibility property)
- _table_
- _grid_: Element is displayed block-level with inner content in grid layout.
- _flex_ Element is displayed block-level with inner content in flexbox layout.
  - width inside of flex-algorithm is more of a suggestion
- _contents_: create no box for this element, just paste the children in

# Resize

- `resize`
  - Only works when `overflow != visible`
  - Adds widget to bottom right
  - Can be moved to bottom left by changing the read direction: `direction: rtl`

# Selectors

- `.class1.class2`: selects all elements with both class1 and class2 within its own class-attribute
- `.class1 .class2`: selects all elements with class2 that are descendants of class1 (does not have to be immediate ancestor!)
- `element.class`: selects al element with class
- `div,p`: selects all div and all p
- `div p`: selects all p inside div
- `div>p`: selects all p that are _immediate_ descendants of div
- `div+p`: first p after div
- `div~p`: every p that comes after an div
- `[attr]`: every element with attribute attr
- `[attr=val]`:
- `[attr~=val]`:
- `[attr*=val]`: where attr contains the substring 'val'
- `::after`: inserted after the content of an element, but still inside of it.

# Pseudoclasses

- `p::before`

  - injects a new pseudo-element inside of p, but before any other content of p.
  - only works with `content: ''`

    - `content: 'hello'` adds some 'hello' text into the element. Commonly we just use `content: ''` because we only need the content-filed, no actual content.

  - pseudo-classes don't work on `img` elements, or any elements that have no content.
  - `::before` inside a flex-box becomes a flex-item itself, therefore impacting the spacing of the other flex-items.

# Flexbox

Flexbox handles the proportions of items in a row or column.

Parent properties:

- `display: flex;`
- `flex-direction: colum | row` sets primary axis direction
- `justify-content: center;` centers along primary axis
- `align-items: center;` centers along the secondary axis

Child properties. Children start at their flex-basis width and their size increases at a _rate_ of flex-grow.

- `flex-grow`: fraction taken by element if more space available than required. Default 0 means: don't resize me even if more space is available.
- `flex-shrink`: fraction taken by element if less space available than required. Default is 1, which means: shrink all elements at the same rate.
- `flex-basis: 20\%, 5rem, auto, content, ...`: the default size of element before remaining space is distributed. Default is auto, which means: use my width. Contrary to min-width, flex-basis may get lower.
- `flex 0 1 auto`: shorthand for grow, shrink, basis.

# Grid

Grid handles the proportions of columns and rows in two dimensions. It's basically what used to be table-based layout, but responsive.

```css
.gridContainer {
  display: grid;

  /* columns will be filled from left to right */
  grid-template-columns: 70% 30%;
  grid-gap: 1em;
}
```

Grid elements may overlap each other:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .container {
        display: grid;
        background-color: aliceblue;
        width: 500px;
        height: 1000px;

        grid-template-rows: [top] 1fr [mid-row] 1fr [bottom];
        grid-template-columns: [left] 1fr [mid-col] 1fr [right];
      }

      .tableEntry {
        background-color: antiquewhite;
        border: 1px dotted gray;
        margin: 1rem;
      }

      #c1 {
        background-color: aquamarine;
      }

      #c2 {
        background-color: azure;
      }

      #c3 {
        background-color: bisque;
        grid-area: mid-row / left / bottom / mid-col;
        z-index: 2;
        margin: 2rem;
      }

      #c4 {
        background-color: cadetblue;
        grid-area: mid-row / left / bottom / right;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div id="c1" class="tableEntry">I'm a normal entry</div>
      <div id="c2" class="tableEntry">I'm a normal entry</div>
      <div id="c3" class="tableEntry">I am pretty small and lie over c4</div>
      <div id="c4" class="tableEntry">I'm the background for the whole second row</div>
    </div>
  </body>
</html>
```

# Animation

CSS animations:

- pick the element that you want to animate
- the `transition` or `animation` property is triggered when:

  - one of the animate-able properties changes doe to js adding a new class

- transition
  - `transition: <which property to animate (default=all)> <duration> <ease | linear | bezier> <delay>`
  - works with:
    - height (but only pixel value)
    - max-height: use this instead of height!
- animation: for multi-step animations

  - `animation: <custom name> <duration> <ease | linear>`
  - ````@keyframes <custom name> {
       0% {

       }
       50% {

       }
       100% {

       }
    }```
    ````

- performance:

# Clip paths

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>

        <style>
            * {
                box-sizing: border-box;
            }
            :root {
                --color1: rgb(200, 249, 233);
                --color2: rgb(129, 253, 253);
                --curveHeight: 4rem;
            }
            .body {
                width: 100%;
            }
            .row {
                /* Moving up, under the next higher row */
                margin-top: calc(-1 * var(--curveHeight));
                /* Making sure that after sliding under next higher row the text is still visible*/
                padding-top: calc(var(--curveHeight) + 1rem);
                padding-bottom: 1rem;
            }
            .row1 {
                background-color: var(--color1);
            }
            .row2 {
                background-color: var(--color2);
            }
            .curveShadow1 {
                /* Shadows don't work on elements with clip path, because the
                path clips the shadows off. So place on this helper-parent instead. */
                filter: drop-shadow(0px .5rem .5rem var(--color1));
            }
            .curveShadow2 {
                filter: drop-shadow(0px .5rem .5rem var(--color2));
            }
            .curve {
                width: 100%;
                height: var(--curveHeight);
            }
            .curve1 {
                background-color: var(--color1);
                /* Stencilling out the shape */
                clip-path: url(#clipPath1);
            }
            .curve2 {
                background-color:  var(--color2);
                clip-path: url(#clipPath2);
            }
            p {
                width: max(60%, 500px);
                margin: auto;
            }
        </style>
    </head>
    <body>
        <svg width="0" height="0">
            <defs>
                <clipPath id="clipPath1" clipPathUnits="objectBoundingBox">
                    <path d="M 0,0    L 1,0   L 1,0.8   C 0.8,0.7 0.75,0.5 0.5,0.8  S 0.1,0.8, 0,0.8   Z"></path>
                </clipPath>
                <clipPath id="clipPath2" clipPathUnits="objectBoundingBox">
                    <path d="M 0,0    L 1,0   L 1,0.8   C 0.9,0.5 0.75,1.1 0.5,0.8  S 0.1,0.9, 0,0.8   Z"></path>
                </clipPath>
            </defs>
        </svg>

        <div class="body">

                <div class="row row1"><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe deleniti rerum at labore doloremque sequi repellendus numquam nobis expedita. Doloribus vitae natus placeat iste molestias consectetur unde eos beatae nobis!</p></div>
                <div class="curveShadow1"><div class="curve curve1"></div></div>


                <div class="row row2"><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe deleniti rerum at labore doloremque sequi repellendus numquam nobis expedita. Doloribus vitae natus placeat iste molestias consectetur unde eos beatae nobis!</p></div>
                <div class="curveShadow2"><div class="curve curve2"></div></div>


                <div class="row row1"><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe deleniti rerum at labore doloremque sequi repellendus numquam nobis expedita. Doloribus vitae natus placeat iste molestias consectetur unde eos beatae nobis!</p></div>
                <div class="curveShadow1"><div class="curve curve1"></div></div>


                <div class="row row2"><p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe deleniti rerum at labore doloremque sequi repellendus numquam nobis expedita. Doloribus vitae natus placeat iste molestias consectetur unde eos beatae nobis!</p></div>
                <div class="curveShadow2"><div class="curve curve2"></div></div>


    </body>
</html>
```

# Critical rendering path

Some info [by google](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path).

# Underlying algorithms

## Phases

1.  Style computation: Assigns value to every css property.
    1. accounts for selector-specificity
    2. accounts for inheritance
       1. text- & font-props are inherited
       2. colors are inherited
       3. rest is not
    3. fill missing props with inherited or defaults
    4. absolutize values
       1. converts vw, em, % into pixel values
       2. converts colors to sRGB
2.  Box construction for each (pseudo-)element
    1. Almost all elements get a box,
    2. ... except display:none and display:contents, which get no box
    3. ... except tables and list-items, which get two boxes
3.  Layout
    1. calculates `x,y,width,height` for each box
4.  Painting

## Stacking context: z-ordering, pos:abs, pos:sticky, dialogs, ...

- new context created when:
  - position:sticky
  - position:absolute + z-index
  - opacity < 1, mix-blend-mode
  - ...
- z-index will only work within the current stacking context
- if child-node B comes after child-node A, then B is layered higher than A.
- can be re-set with `isolation: isolate`

# Tools

https://www.sessions.edu/color-calculator/
https://coolors.co/598072
https://colors.dopely.top/color-harmony-finder/Double-complementary/dc4b96
