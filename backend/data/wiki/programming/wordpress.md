# Wordpress

## Concepts

- Page
- Post
- **Page/Post editor**: Content editing through UI. Uses blocks for content.
  - Page editor allows you to add any blocks you like. They will be placed in the `content-block`, which is a special block that you can place in the site-editor.
- **Site editor**: `Appearance/Editor`: Theme editing through UI. Uses blocks for structure.
  - Has a special block `content`. This block cannot be edited on a template-level, but will be filled by the authors for each page/post/etc. individually.
- **Theme**
  - **Templates**: layouts of blocks that can be applied to content types
    - Example: in the "twenty-twenty-three" theme, a "page" content type can use one of many templates: "page", "page-without-title", "page-with-wide-image", ...
    - Templates are applied in Content editor/settings (on the right)/template
    - Templates are edited in the Site editor
    - They are further subdivided into template-parts
  - **Patterns**: sets of blocks that can be placed together

### Exporting templates

Go to appearance / Editor, then on the right "..." menu, click on "export".

### Exporting patterns

Go to manage patterns, click "export as json".

Example:

```json
{
  "__file": "wp_block",
  "title": "Compare left right",
  "content": "<!-- wp:columns {\"style\":{\"spacing\":{\"padding\":{\"right\":\"var:preset|spacing|20\",\"left\":\"var:preset|spacing|20\"},\"margin\":{\"top\":\"0\",\"bottom\":\"0\"},\"blockGap\":{\"left\":\"var:preset|spacing|40\"}},\"border\":{\"width\":\"0px\",\"style\":\"none\",\"radius\":\"26px\"}},\"backgroundColor\":\"accent\",\"fontSize\":\"small\"} -->\n<div class=\"wp-block-columns has-accent-background-color has-background has-small-font-size\" style=\"border-style:none;border-width:0px;border-radius:26px;margin-top:0;margin-bottom:0;padding-right:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--20)\"><!-- wp:column {\"className\":\"infoBox infoBoxRight\"} -->\n<div class=\"wp-block-column infoBox infoBoxRight\"><!-- wp:heading -->\n<h2 class=\"wp-block-heading\">Wind power</h2>\n<!-- /wp:heading -->\n\n<!-- wp:image {\"align\":\"left\",\"id\":43,\"width\":\"200px\",\"sizeSlug\":\"large\",\"linkDestination\":\"none\",\"className\":\"is-style-default\"} -->\n<figure class=\"wp-block-image alignleft size-large is-resized is-style-default\"><img src=\"http://localhost:8080/wp-content/uploads/2023/12/svg2roughjs_windpower.svg\" alt=\"\" class=\"wp-image-43\" style=\"width:200px\"/></figure>\n<!-- /wp:image -->\n\n<!-- wp:paragraph -->\n<p>Lorem ipsum dolor sit amet, consetetur  et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\n<!-- /wp:paragraph --></div>\n<!-- /wp:column -->\n\n<!-- wp:column {\"style\":{\"spacing\":{\"padding\":{\"right\":\"0\",\"left\":\"0\"}}},\"className\":\"infoBox infoBoxRight\"} -->\n<div class=\"wp-block-column infoBox infoBoxRight\" style=\"padding-right:0;padding-left:0\"><!-- wp:heading -->\n<h2 class=\"wp-block-heading\">Solar power</h2>\n<!-- /wp:heading -->\n\n<!-- wp:image {\"align\":\"right\",\"id\":45,\"width\":\"200px\",\"sizeSlug\":\"large\",\"linkDestination\":\"none\"} -->\n<figure class=\"wp-block-image alignright size-large is-resized\"><img src=\"http://localhost:8080/wp-content/uploads/2023/12/svg2roughjs_solar.svg\" alt=\"\" class=\"wp-image-45\" style=\"width:200px\"/></figure>\n<!-- /wp:image -->\n\n<!-- wp:paragraph -->\n<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>\n<!-- /wp:paragraph --></div>\n<!-- /wp:column --></div>\n<!-- /wp:columns -->",
  "syncStatus": ""
}
```

#### Example: custom parallax header

1. create new page
2. in settings (on right) chose template: "page with wide title"
3. Edit template:
   3.1. remove header (without editing the actual header sub-template, since it's being used in other templates, too)
   3.2. replace featured image with custom html block
   3.3. select custom html block's parent, display it as full-width

... wait, actually, that's silly. This way the same hero will be displayed for all pages with template "wide title". Better:

1. create new page
2. in settings (on right) chose template: create new template
   2.1. remove all blocks
   2.2. add a footer at the end
   2.3. add `content` block at top - as top level, no columns or further styling.
3. Then do the actual content creating in page-editor, not site-editor
   3.1. top: custom html block (with below code)
   3.2. under that: columns (25/50/25)
   3.3. in middle: any paragraph text you like.

In general, I think that sometimes the predefined templates can be a bit restrictive, having a fully custom template type is useful under any circumstances.

Here's the custom html:

```html
<div style="width: 100%;">
  <svg id="graphic" width="100%" viewBox="0 0 100 35" id="outer" xmlns="http://www.w3.org/2000/svg">
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
      <rect id="background" width="100" height="35" fill="url(#skyGrad)"></rect>

      <svg id="fullBuilding" x="5" y="5" width="20" height="40" viewBox="0 0 100 200">
        <rect x="47.5" y="46" width="5" height="100" fill="white"></rect>
        <rect x="45" y="46" width="10" height="8" fill="white"></rect>

        <svg id="fullRotor" x="0" y="0" width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <path id="blade" d="M 0,50 C 9,40, 0,30, 0,0 Z" fill="white"></path>
          </defs>
          <g id="rotorRotatableGroup" transform="rotate(10 50 50)">
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

  <script>
    const svg = document.getElementById("graphic");
    const bg = svg.querySelector("#background");
    const wka = svg.querySelector("#fullBuilding");
    const rotor = wka.querySelector("#rotorRotatableGroup");

    window.addEventListener("scroll", (e) => {
      bg.setAttribute("transform", `translate(0 ${-0.02 * window.scrollY})`);
      wka.setAttribute("transform", `translate(0 ${-0.03 * window.scrollY})`);
      rotor.setAttribute("transform", `rotate(${0.2 * window.scrollY} 50 50)`);
    });
  </script>
</div>
```

## Paid plugins

Wordpress uses a GPL license.

Lots of people sell GPL licensed plugins, so you can make money this way. But the user is purchasing the ability to acquire the plugin, support, future updates, etc, not the plugin's code itself.

### The TLDR:

- Your code must use a GPL compatible license, the best and easiest option is GPL.
  - If your license forbids something the GPL allows it is not compatible. It must be as permissive as the GPL or more so. So no telling people they can only install on a single site, or limit to X users.
  - Not all licenses are compatible, check beforehand, e.g. the BSD license is compatible, as is the MIT license. The Apache v1 license is not.
  - See this article for more information on license compatibility: https://www.gnu.org/licenses/license-list.en.html
- You can charge for distribution, but you can't charge for the code itself.
- There's nothing preventing someone buying your plugin and redistributing the code once it's publicly distributed. GPL code is free by definition.
- You can charge for services such as updates and support, or other hosted services
- Lots of people have businesses selling or supporting GPL licensed plugins

### How do plugins like Gravityforms protect their plugin from being redistributed to the wild?

They can't.

Since WordPress is GPL code, all code publicly distributed must also be licensed either as GPL, or GPL compatible.

The GPL states you cannot charge for code, but you can charge for distribution. So when you buy gravity forms, you're not paying for the plugin, you're paying for the downloading and acquisition of the plugin.

Once you have the plugin it is perfectly legal to burn it to a CD and mail it to 20,000 people free of charge. You won't get the support or updates (unless you pay them again, or you have a support contract), and it would be a pretty nasty thing to do (they have a business!), but it's perfectly legal.

No matter what you do, someone will figure out how to redistribute it for free, so stop worrying about it, those people were never going to pay anyway and won't get the support for updates.

The only method that appears to work is to do the functionality on your own server and use API keys, selling a service.

For the actual purchasing component:

### License Keys

Put a payment mechanism on your site, and use it to generate API keys. Make the user put these keys into their backend, or couple their sites URL with their purchase, and use that to enable the restricted features.

### Paid for Plugin

Set up a shop plugin of sorts, and use the virtual downloadable product type. There are services and sites that you can use to handle this if you don't want to host a site yourself

## Development environment

docker-compose.yml

```yml
version: "3.6"
services:
  wordpress:
    image: wordpress:latest
    container_name: wordpress
    volumes:
      - ./wordpress:/var/www/html
    environment:
      - WORDPRESS_DB_NAME=wordpress
      - WORDPRESS_TABLE_PREFIX=wp_
      - WORDPRESS_DB_HOST=db
      - WORDPRESS_DB_USER=root
      - WORDPRESS_DB_PASSWORD=password
      - WORDPRESS_DEBUG=1 # any non-empty value will do
    depends_on:
      - db
      - phpmyadmin
    ports:
      - 8080:80

  db:
    image: mariadb:latest
    container_name: db
    volumes:
      - db_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_USER=root
      - MYSQL_PASSWORD=password
      - MYSQL_DATABASE=wordpress

  phpmyadmin:
    depends_on:
      - db
    image: phpmyadmin/phpmyadmin:latest
    container_name: phpmyadmin
    ports:
      - 8180:80
    environment:
      PMA_HOST: db
      MYSQL_ROOT_PASSWORD: password

volumes:
  db_data:
```

`docker compose up`

## JS

### Part 0: custom block basic concepts

- static block
  - admin-view (`js.registerBlockType.edit`): react ------------------> admin
  - user-view (`js.registerBlockType.save`): react -----> db --------> user
- dynamic block

  - admin-view (`js.registerBlockType.edit`): react ------------------> admin
  - user-view (`php.register_block_type.`): php --------------------> user

- Static blocks create content once through react, and it is then served as static html directly from the database.
- Dynamic blocks create content anew on every pageload through php.
- The output of `registerBlockType.save` for static blocks is actually [very, very limited](https://github.com/WordPress/gutenberg/issues/36265). You mustn't use any react-hooks, for example, in that output.
  - `.edit`'s output, o.t.o.h., is allowed to use any react hook.
- ... but: we can add additional js/ts(x) logic with a `viewScript` ... which the next steps will explain.

### Part 1: create a module

Create the directory:

```bash
cd wordpress/wp-content/plugins
mkdir counter
cd conter
```

Create a php file with same name as module (counter.php):

```php
<?php
/**
 * Plugin Name: counter
 */

add_action('init', function () {
    register_block_type( __DIR__ . "/build/");
});
```

### Part 2: create build-able ts(x) code

```bash
npm init
npm install --save-dev @wordpress/scripts
```

package.json:

```json
"scripts": {
  "start": "wp-scripts start",
  "build": "wp-scripts build"
},
```

src/block.json

```json
{
  "apiVersion": 3,
  "title": "Counter",
  "name": "test/counter",
  "category": "widgets",
  "icon": "smiley",
  "editorScript": "file:./index.tsx",
  "viewScript": "file:./view.tsx"
}
```

### Part 3: define admin-view of block:

src/index.tsx:

```tsx
import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";

// Wp already knows about this block through php.
// Here we tell it what to do when that block is to be shown.
registerBlockType("test/counter", {
  // return component shown in editor-view
  edit: function () {
    return <p {...useBlockProps()}> Counter, editor-view</p>;
  },
  // return component root html shown in customer-view
  save: function () {
    return <div id="mycounter">Hi! I will be replaced with a react component.</div>;
  },
});
```

### Part 4: define user-view of block:

src/view.tsx:

```tsx
import { createRoot } from "react-dom/client";
import { useState } from "react";

const root = createRoot(document.getElementById("mycounter"));

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};

const App = () => {
  return (
    <div>
      Rendered react component
      <Counter></Counter>
    </div>
  );
};

root.render(<App></App>);
```

### Part 4: build

```bash
npm run start
```

This will:

- compile ts(x) to js
- compile sass to css
- create an `index.asset.php`, which lists all dependencies.
  - Webpack already knows that wordpress has its own version of react. If it sees react in your code, it will also add it automatically to `index.asset.php`.
- create a `view.assets.php`
- create a compiled `block.json` in build, ... which is where we pointed to with our plugin-file `counter.php`.

## React as a shortcode

```php
<?php

/**
 * Plugin Name: Related values
 * Version: 0.1
 * Description: Creates a hover text for `[relate value="120" name="kWh" to="'cycling','driving'"]`
 */

$units = [
    [
        "name"     => "power",
        "unit"     => "kWh",
        "compares" => [
            ["name" => "cycling", "factor" => 1.2],
            ["name" => "driving", "factor" => 0.1]
        ]
    ], [
        "name"     => "love",
        "unit"     => "hearts",
        "compares" => []
    ]
];

function related_values_shortcode($attrs, $content, $shortcode_tag)
{
    global $units;

    $id           = uniqid();
    $value        = $attrs["value"];
    $name         = $attrs["name"];
    $to           = array_map(
        function ($val) {
            return trim($val);
        },
        explode(",", $attrs["to"])
    );
    $unitsEncoded = json_encode($units);


    $output = <<<HTML
        <a
            id="$id"
            style="color: blue;"
            onmouseover='window.doTheLog("$id", $unitsEncoded)'
            onmouseout='window.removeTheLog("$id")'
            >
            $value $name
        </a>
    HTML;

    return $output;
}


add_action("wp_enqueue_scripts", function () {
    $url = plugin_dir_url(__FILE__) . "/build/index.js";
    // NOTE: don't forget to add the react-dependencies.
    wp_register_script("related_values_script", $url, ["react", "react-dom"], false, true);
});

add_action("init", function () {
    wp_enqueue_script("related_values_script");
    add_shortcode("relate", "related_values_shortcode");
});
```

```tsx
import { createRoot } from "react-dom/client";

function doTheLog(id: string, data: any) {
  const el = document.getElementById(id) as HTMLLinkElement;

  const y = el.offsetTop;
  const x = el.offsetLeft;

  const body = document.body;
  const rt = document.createElement("div");
  rt.id = popupId(id);
  rt.style.position = "absolute";
  rt.style.top = "0";
  rt.style.left = "0";
  body.appendChild(rt);
  const root = createRoot(rt);

  function Base(props: { x: number; y: number }) {
    console.log(props);
    return (
      <div style={{ position: "absolute", top: `${props.x} px`, left: `${props.y} px` }}>
        <p>Here I am.</p>;
      </div>
    );
  }

  root.render(<Base x={x} y={y}></Base>);
}

function removeTheLog(id: string) {
  const popup = document.getElementById(popupId(id));
  popup?.remove();
}

function popupId(id: string) {
  return `popup-${id}`;
}

// NOTE: saving functions to window, so they survive minification.
// @ts-ignore
window.doTheLog = doTheLog;
// @ts-ignore
window.removeTheLog = removeTheLog;
```

## Angular as a shortcode

- create plugin dir `angularMap`
- in plugin dir, `ng new angularMap` and `npm run build`
- add plugin definition `angularMap.php`:

```php
<?php
/**
 * Plugin Name:         Angular Map
 * Version:             1.0.0
 *
 */

/**
 * Simple debug trace to wp-content/debug.log
 * @usage _log( $var );
 */
function _log($log) {
    if (true !== WP_DEBUG) {
        return;
    }
    if (is_array($log) || is_object($log)) {
        error_log(print_r($log, true));
    } else {
        error_log($log);
    }
}

add_action('wp_enqueue_scripts', function () {
    $buildDir = __DIR__ . '/angularMap/dist/angular-map/';
    $buildDirUrl = plugin_dir_url(__FILE__) . 'angularMap/dist/angular-map/';
    $files = scandir($buildDir);

    $styleFile = false;
    $mainFile = false;
    $polyfillFile = false;
    $runtimeFile = false;
    foreach ($files as $file) {
        if (str_contains($file, "styles") && str_contains($file, ".css"))
            $styleFile = $file;
        if (str_contains($file, "main") && str_contains($file, ".js"))
            $mainFile = $file;
        if (str_contains($file, "polyfills") && str_contains($file, ".js"))
            $polyfillFile = $file;
        if (str_contains($file, "runtime") && str_contains($file, ".js"))
            $runtimeFile = $file;
    }

    if (!$styleFile || !$mainFile || !$polyfillFile || !$runtimeFile) {
        _log("Couldn't find compiled angular-files.");
        return;
    }

    wp_enqueue_style('ng_styles', $buildDirUrl . $styleFile);
    wp_register_script('ng_main', $buildDirUrl . $mainFile, [], false, true);
    wp_register_script('ng_polyfills', $buildDirUrl . $polyfillFile, [], false, true);
    wp_register_script('ng_runtime', $buildDirUrl . $runtimeFile, [], false, true);
});

add_shortcode('ng_wp', function () {
    wp_enqueue_script('ng_main');
    wp_enqueue_script('ng_polyfills');
    wp_enqueue_script('ng_runtime');

    return "<app-root></app-root>";
});

// Add the shortcode [ng_wp] to any page or post.
// The shortcode can be whatever. [ng_wp] is just an example.
```

## REST API

1. Activate the json-api: go to `http://localhost:8080/wp-admin/options-permalink.php` and chose any permalink-type other than `plain`.
2. You can access the api at `http://localhost:8080/wp-json`

## Database

Creating a custom content type: https://gist.github.com/kosso/47004c9fa71920b441f3cd0c35894409

## Static site

Only partial static site:
https://wordpress.org/support/topic/do-you-have-to-convert-your-whole-site-to-static-or-partial-conversion-supported/

## Deployment

| Content type    | Deployment                 |     |     |     |
| --------------- | -------------------------- | --- | --- | --- |
| Page, Post      | Stored in DB               |     |     |     |
| Block           | Defined in code            |     |     |     |
| Shortcode       | Defined in code            |     |     |     |
| Template(-part) | Per UI, exportable to code |     |     |     |
| Pattern         | Per UI, exportable to code |     |     |     |
