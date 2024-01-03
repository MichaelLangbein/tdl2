# Common frontend designs

## Scrollytelling

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

      .bg {
        background-color: beige;
        padding: 5rem;
      }

      .container {
        display: grid;
        background-color: aliceblue;
        width: 800px;

        grid-template-rows: [row0] 1fr [row1] 1fr [row2] 1fr [row3] 1fr [row4] 1fr [row5];
        grid-template-columns: [col0] 1fr [col1] 1fr [col2];
      }

      .tableEntry {
        background-color: antiquewhite;
        border: 1px dotted gray;
        margin: 1rem;
        height: 250px;
      }

      .map {
        background-color: aqua;
      }

      .blank {
        background-color: white;
      }

      #map3 {
        grid-area: row3 / col0 / row4 / col2;
      }
    </style>
  </head>
  <body>
    <div class="bg">
      <div id="container" class="container">
        <div id="text1" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="blank1" class="tableEntry blank"></div>

        <div id="text2" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="map1" class="tableEntry map"></div>

        <div id="text3" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
        <div id="map2" class="tableEntry map"></div>

        <div id="map3" class="tableEntry map"></div>

        <div id="map4" class="tableEntry map"></div>
        <div id="text4" class="tableEntry">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi tempore pariatur quaerat quo nobis ea nisi
            itaque nihil iusto eos, quis, ipsum nam necessitatibus consequuntur nemo libero hic labore id.
          </p>
        </div>
      </div>
    </div>
  </body>
  <script type="module" src="/src/main.ts"></script>
</html>
```

```ts
interface Settings {
  parent?: string;
  animatedElements: [
    {
      placeholders: string[];
      onScrolled: (degrees: { [placeholder: string]: number }) => void;
    }
  ];
}

/**
 * # Scrollyteller
 *
 * For each `animatedElement`:
 * - looks at the placeholders
 * - places the element at a position that is interpolated between the positions of the two most central placeholders, weight by their distance from the centers
 *
 * Design principles:
 * - The `animatedElement` itself is not being destroyed
 * - Nothing is painted into the placeholders, the `animatedElement` is a separate element with `fixed` positioning.
 *
 *
 * @TODOs:
 * - allow to pick different interpolation methods (linear, squared, cubic, ...)
 * - move the line of reference: on top of page, line should be pretty high up, on bottom of page, line should be pretty far down
 *
 */
class Scrollyteller {
  constructor(private settings: Settings) {
    const container = settings.parent ? document.querySelector(settings.parent) : document;
    if (!container) return;

    function interpolate(data: { weight: number; value: number }[]): number {
      const sumOfWeights = data.map((d) => d.weight).reduce((prev, curr) => prev + curr, 0);
      let mean = 0;
      for (const datum of data) {
        mean += (datum.value * datum.weight) / sumOfWeights;
      }
      return mean;
    }

    for (const animatedElementSettings of settings.animatedElements) {
      const animatedElement = document.createElement("div");
      animatedElement.style.position = "fixed";
      animatedElement.style.setProperty("border", "1px solid red");
      settings.parent ? container.appendChild(animatedElement) : document.body.appendChild(animatedElement);

      const placeholders = animatedElementSettings.placeholders.map((ph) => container.querySelector(ph));

      function onScroll(scrollEvent: Event | null) {
        const viewPortHeight = window.innerHeight;

        const tops: { weight: number; value: number }[] = [];
        const lefts: { weight: number; value: number }[] = [];
        const widths: { weight: number; value: number }[] = [];
        const heights: { weight: number; value: number }[] = [];
        const degrees: { [key: string]: number } = {};

        for (const placeholder of placeholders) {
          if (placeholder) {
            const viewPortOffset = placeholder.getBoundingClientRect();
            const distToCenter = Math.abs(viewPortOffset.top + viewPortOffset.height / 2 - viewPortHeight / 2);
            if (distToCenter < viewPortHeight / 2) {
              tops.push({ weight: 1 / distToCenter, value: viewPortOffset.top });
              lefts.push({ weight: 1 / distToCenter, value: viewPortOffset.left });
              widths.push({ weight: 1 / distToCenter, value: viewPortOffset.width });
              heights.push({ weight: 1 / distToCenter, value: viewPortOffset.height });
              degrees[placeholder.id] = distToCenter;
            }
          }
        }

        const top = interpolate(tops);
        const left = interpolate(lefts);
        const width = interpolate(widths);
        const height = interpolate(heights);

        animatedElement.style.setProperty("top", `${top}px`);
        animatedElement.style.setProperty("left", `${left}px`);
        animatedElement.style.setProperty("width", `${width}px`);
        animatedElement.style.setProperty("height", `${height}px`);

        animatedElementSettings.onScrolled(degrees);
      }

      container.addEventListener("scroll", (scrollEvent) => onScroll(scrollEvent));
      onScroll(null);
    }
  }
}

const scr = new Scrollyteller({
  animatedElements: [
    {
      placeholders: ["#map1", "#map2", "#map3", "#map4"],
      onScrolled: (degrees) => console.log(degrees), // normally, animate elements here
    },
  ],
});
```
