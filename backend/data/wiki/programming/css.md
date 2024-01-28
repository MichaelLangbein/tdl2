# Position

- _static_: The default
- _relative_: Default + allows top, bottom, left and right
  - useful as parent for absolute div's
- _absolute_: Relative to nearest positioned parent (positioned: anything but static)
  - **note**: the parents of absolutely positioned elements won't automatically grow to encompass their child anymore.
- _fixed_: Similar to absolute, but positioned relative to the browser viewport. Scrolling will not move this element.
- _sticky_:
  - element is confined to its parent
  - but within those confines, it slides along with the viewport like fixed.

# Display

Display refers to how an element relates to its peers or its children.
Per default, div's are displayed in block-style, while spans are displayed inline-style.

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
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
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
      <div id="c3" class="tableEntry">
        I am pretty small and lie over c4
      </div>
      <div id="c4" class="tableEntry">
        I'm the background for the whole second row
      </div>
    </div>
  </body>
</html>
```

# Animation

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

# Critical rendering path

Some info [by google](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path).

# Tools

https://www.sessions.edu/color-calculator/
https://coolors.co/598072
https://colors.dopely.top/color-harmony-finder/Double-complementary/dc4b96
