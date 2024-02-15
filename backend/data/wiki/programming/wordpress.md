# Wordpress

## Justification

It's incredible, but using this old PHP cornerstone really needs a justification. I've compared different frameworks for creating web content:

| framework | UI-builder | CRUD-scaffold | Types | JS/TS   | File-MGMT | templates/themes | forms |
| --------- | ---------- | ------------- | ----- | ------- | --------- | ---------------- | ----- |
| wordpress | +++        | -             | -     | -       | ++        | +++              | +     |
| next.js   | commercial | +             | +++   | +++     |           |                  | +++   |
| rails     | commercial | +++           | -     | -       | +         |                  | ++    |
| django    | +          | +++           | -     | +       | +         |                  | ++    |
| .net      |            | +++           | +++   | blazor? |           |                  | ++    |

Wordpress is still the best in offering a user-friendly UI builder.

What about comparing other page builders?

| builder     | notes                      |
| ----------- | -------------------------- |
| openElement | PHP, jQuery, ancient       |
| GrapesJS    | YCombinator, but not a CMS |
| Silex       | Looks like paint           |

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
- Filter: register a filter to modify a content-type before its being displayed
- Shortcode: a user can enter a short code snippet which will be replaced by something more complex.

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
    const svg = document.getElementById('graphic');
    const bg = svg.querySelector('#background');
    const wka = svg.querySelector('#fullBuilding');
    const rotor = wka.querySelector('#rotorRotatableGroup');

    window.addEventListener('scroll', (e) => {
      bg.setAttribute('transform', `translate(0 ${-0.02 * window.scrollY})`);
      wka.setAttribute('transform', `translate(0 ${-0.03 * window.scrollY})`);
      rotor.setAttribute('transform', `rotate(${0.2 * window.scrollY} 50 50)`);
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
version: '3.6'
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
      - SCRIPT_DEBUG=true # only in dev builds!
      # to wp-config.php add:
      # define( 'SCRIPT_DEBUG', !!getenv_docker('SCRIPT_DEBUG', '')    );

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

## WP CLI

https://developer.wordpress.org/cli/commands/scaffold/post-type/

## Theme development

Both classic themes and block themes adhere to the template hierarchy:
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/wp_template_hierarchy.png" />

Making sure that styles, blocks etc. are not cached:
`wp-config.php / define('WP_DEVELOPMENT_MODE', 'theme');`

### Classic themes

**Required files**:

- index.php : fallback if no other file matches content type
- style.css - has a header with metadata:
  `css
  Theme Name: ...
  Version: ...
  Description: ...
  Tags: ...
`
  **Other files**:
- functions.php : for hooking into wp life-cycle
- content-type specific files:
  - home.php, 404.php, ...
- templates/\*.html

### Block themes

Wordpress uses one abstraction higher than CSS. There's a `theme.json` file that allows you to pick a highly restrictive selection of fonts, colors, layout, spacing, etc., which will be made available to the admin through the UI.

#### Manually

- **parts**: small, reusable elements made of html, to be used in templates.
  - They are referred to in templates or patterns with `<!-- wp:template-part {} /-->`
  - header.html
  - footer.html
- **patterns**: Multiple blocks can be grouped together to make a pattern, which may be used in parts, templates, or user-content. To be used in templates.
  - They are referred to in templates or other patterns with `<!-- wp:pattern {} /-->`
  - should be php
  - requires meta-data comment at top
- **templates**: functional (sub-)pages built out of blocks, parts and patterns. There're being looked up as required by the template hierarchy.
  - You can add your own template ....
  - They are referred to in other templates or patterns with `<!-- wp:template-part {} /-->`
  - Files:
    - index.html
    - potentially any template from the template hierarchy
    - potentially any custom templates spliced into the lookup by you
- **style.css**
  - Theme name and other meta-data - barely any actual CSS, because that's mostly inside theme.json
- **theme.json**
  - $schema: https://schemas.wp.org/trunk/theme.json
  - settings
  - styles
- empty index.php (so that dir can't be inspected from outside)

All the above are used to layout widgets and the sites "frame" - i.e. everything that is not an actual blog-posts content. Content itself is made of blocks and may use patterns.

Users can overwrite your settings:

- Style hierarchy: code < user defined global < user defined per block
- User defined changes are stored in db, not code.

You'll often edit some pattern in the UI and later export it from the database to paste it back into your code. Don't forget to "clear customizations" so that your code, instead of the db, is what's being shown.

#### Create block theme plugin

Creates theme code in themes folder.
Changes your code files even after you've made your own adjustments.
Lots of nice configs, like picking and downloading google fonts.

#### Editing UI

- Site editor
  - **Dashboard/Appearence/Editor**: comprehensive full site, all templates.
  - **Current page/Edit Site**: For editing templates based on hierarchy. Shows currently visible template.
- Page editor
  - **Current page/Edit page**: Edit blocks in content-part of the current page

## JS for custom blocks

### Part -1: default template and Gutenberg ecosystem

`npx @wordpress/create-block@latest todo-list`

- `@wordpress/scripts`
- `@wordpress/element`: react utilities
- `@wordpress/block-editor`:
  - MediaUploadCheck, RichText
  - useBlockProps
  - MediaUpload: actually not implemented in this module:
    - module only contains placeholder...
    - ... actual value is set with a filter: `window.wp.hooks.addFilter('editor.MediaUpload')` ...
    - ... and as such made available in `window.wp.mediaUtils.MediaUpload`
- `@wordpress/editor`:
- `@wordpress/data`: redux state management, connects with wp-api
  - `withSelect`
    - nowadays replaced with a simple hook named `useSelect`
    - wraps a component
    - adds the result of _x_ to the component-props
    - _x_ is a redux query using `select`
  - `withDispatch`
    - replaced by `useDispatch`
    - used to update DB data
- `window.wp`
  - Wordpress creates some components only at runtime. For this reason, they cannot simply be imported with `import {x} from "y"`, but are taken directly from `window.wp`
  - `mediaUtils`: Contains MediaUpload

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
cd counter
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
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

// Wp already knows about this block through php.
// Here we tell it what to do when that block is to be shown.
registerBlockType(metadata.name, {
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
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

const root = createRoot(document.getElementById('mycounter'));

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

## Storing attributes in custom blocks

https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/

Attributes:

- type:
  - `string` | `number`
  - `array`
    - requires `selector`, `source=query`
- `selector`: a css selector. Example: `element[attrname=attrval]`
- `source`:
  - source: undefined
    - data stored in comments surrounding actual markup
  - source: text
    - data stored in child element position of markup
    - requires `selector`
  - source: html
    - like text, but allows markup
  - source: attribute
    - stored in attribute
    - requires `selector`, requires `attribute`
  - source: query
    - requires `query`
    - example: this returns an array of type `{link: string, link-content: string}[]`:
      ```json
      "embedded-links": {
      "type": "array",
      "source": "query",
      "selector": "a",
      "query": {
      "link": {
      "type": "string",
      "source": "attribute",
      "attribute": "href"
      },
      "link-content": {
      "type": "string",
      "source": "text"
      }
      }
      ```

Example application:

```tsx
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, NumberControl } from '@wordpress/components';
import metadata from './block.json';

registerBlockType(metadata.name, {
  attributes: {
    layers: {
      type: 'string',
      source: 'attribute',
      selector: 'div.anchorContainer',
      attribute: 'data-layers',
    },
    lon: {
      type: 'string',
      source: 'attribute',
      selector: 'div.anchorContainer',
      attribute: 'data-lon',
    },
    lat: {
      type: 'string',
      source: 'attribute',
      selector: 'div.anchorContainer',
      attribute: 'data-lat',
    },
    zoom: {
      type: 'string',
      source: 'attribute',
      selector: 'div.anchorContainer',
      attribute: 'data-zoom',
    },
    width: {
      type: 'string',
      source: 'attribute',
      selector: 'div.anchorContainer',
      attribute: 'data-width',
    },
    height: {
      type: 'string',
      source: 'attribute',
      selector: 'div.anchorContainer',
      attribute: 'data-height',
    },
  },

  edit: function ({ attributes, setAttributes }) {
    return (
      <div {...useBlockProps()}>
        <p>Scrollymap/anchor, editor-view: layers, lon/lat/zoom, angle</p>

        <TextControl
          label="layers (comma separated)"
          value={attributes.layers}
          onChange={(newVal) => setAttributes({ layers: newVal })}
        ></TextControl>

        <TextControl
          label="lon"
          value={attributes.lon}
          onChange={(newVal) => setAttributes({ lon: newVal })}
        ></TextControl>

        <TextControl
          label="lat"
          value={attributes.lat}
          onChange={(newVal) => setAttributes({ lat: newVal })}
        ></TextControl>

        <TextControl
          label="zoom"
          value={attributes.zoom}
          onChange={(newVal) => setAttributes({ zoom: newVal })}
        ></TextControl>

        <TextControl
          label="width"
          value={attributes.width}
          onChange={(newVal) => setAttributes({ width: newVal })}
        ></TextControl>

        <TextControl
          label="height"
          value={attributes.height}
          onChange={(newVal) => setAttributes({ height: newVal })}
        ></TextControl>
      </div>
    );
  },
  save: function ({ attributes }) {
    return (
      <div
        className="anchorContainer"
        data-layers={attributes.layers}
        data-lon={attributes.lon}
        data-lat={attributes.lat}
        data-zoom={attributes.zoom}
        data-width={attributes.width}
        data-height={attributes.height}
      ></div>
    );
  },
});
```

## Custom blocks that allow inner blocks

Use case: Create a scrolly-telling-map.

- Create a map-wrapper
- Users can define blocks of text and map-anchors inside the wrapper
- The anchors don't display anything, but store metadata on what the map should look like when the anchor comes into view.
- The wrapper maintains a map-div, that it places in such a way that it lies always atop of the most central map-anchor

Remarkably, creating such a wrapper is not that hard!
https://gutenberg.10up.com/training/inner-blocks/

```tsx
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

registerBlockType('scrollymap/container', {
  edit: function () {
    const blockProps = useBlockProps();
    const innerBlocksProps = useInnerBlocksProps();

    return (
      <div {...blockProps}>
        <span>This is the scrollymap container admin view</span>
        <div {...innerBlocksProps}></div>
      </div>
    );
  },
  save: function () {
    return <InnerBlocks.Content />;
  },
});
```

## Multiple blocks in one plugin

Directory structure:

- scrollymap
  - src
    - anchor
      - admin.tsx
      - block.json
    - container
      - admin.tsx
      - view.tsx
      - block.json
  - package.json
  - scrollymap.php
    - ```php
        <?php
          /**
          * Plugin Name: Scrolly Map
          */
          add_action('init', function () {
              register_block_type( __DIR__ . "/build/anchor/");
              register_block_type( __DIR__ . "/build/container/");
          });
      ```

## Multiple instances of same block on one page

If you have multiple instances of the same block on one page, wordpress is still only going to load _one_ copy of the view-script.

## CSS for custom blocks

- `MyComponent.tsx`
  - `import some.scss` -----> built into `mycomponent.css`
  - `import other.scss` ----> built into `mycomponent.css`
  - `import style.scss` ----> turns into `style-mycomponent.css`
- You'll need to name both `style-mycomponent` and `mycomponent` in your block.json:
  - `"style": ["file:./components/style-mycomponent.css", "file:./components/mycomponent.css"]`

## Inline blocks

As far as I can tell, blocks cannot be placed inside paragraphs. However, we can add functionality to the Gutenberg rich text editor: https://developer.wordpress.org/block-editor/how-to-guides/format-api/.

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
import { createRoot } from 'react-dom/client';

function doTheLog(id: string, data: any) {
  const el = document.getElementById(id) as HTMLLinkElement;

  const y = el.offsetTop;
  const x = el.offsetLeft;

  const body = document.body;
  const rt = document.createElement('div');
  rt.id = popupId(id);
  rt.style.position = 'absolute';
  rt.style.top = '0';
  rt.style.left = '0';
  body.appendChild(rt);
  const root = createRoot(rt);

  function Base(props: { x: number; y: number }) {
    console.log(props);
    return (
      <div
        style={{
          position: 'absolute',
          top: `${props.x} px`,
          left: `${props.y} px`,
        }}
      >
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

## Query loop

A very interesting, prebuilt block. Allows you to list any content type in another page.

## Custom content types

This is currently far from elegant, since we need to support both classic themes and block themes... the config of which is interspersed in between several hooks and a custom block.
There is code duplicated between `add_meta_box` and `register_meta` as well as between `add_meta_box.render_callback` and `metadata_block.edit.tsx`.

Based on https://kinsta.com/blog/wordpress-add-meta-box-to-post/.

PHP:

1. `add_action( 'init', 			    'related_values_unit_cpt' );` -> calls `register_post_type`
   1. `supports => array("title")` so that no user-defined blocks can be added
   2. `'template' => array(	array("related-values/unit-meta-data"	), 'template_lock' => 'all')` so that in block-themes, the metadata-block is used for editing
2. `add_action( 'add_meta_boxes', 'related_values_unit_cpt_fields_classic' );` -> calls `add_meta_box` for compatibility with classic themes
3. `add_action( 'save_post', 		  'related_values_unit_cpt_fields_classic_save' );` -> hooks into save to update metadata from classic meta-box
4. `add_action( 'init', 			    'related_values_unit_cpt_fields' );` -> calls `register_post_meta` for use in metadata-block
5. `add_action( 'init', 			    'related_values_unit_metadata_block' );` -> calls `register_block_type` to adit and display metadata

Custom block to allow editing and displaying meta-data:

1. edit.tsx:
   1. `const postType = useSelect( select => select( 'core/editor' ).getCurrentPostType())`;
   2. `const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );`
2. render.php
   1. `$unitName = get_post_meta( get_the_ID(), '_meta_fields_unit_name', true );`
   2. `$unitRelations = get_post_meta( get_the_ID(), '_meta_fields_unit_relations', true );`

### Using ACF

ACF makes it easier to:

- add fields that relate to other content types
- create content types
- export all that as php code

But it has some drawbacks:

- relatively restrictive license
- requires ACF as a dependency (generated php code is not standalone)
- doesn't create a block to display ACF's in block-themes (at least not in free version)

## REST API

1. Activate the json-api: go to `http://localhost:8080/wp-admin/options-permalink.php` and chose any permalink-type other than `plain`.
2. You can access the api at `http://localhost:8080/wp-json`

## Database

```php
<?php


/**
 * Based on https://accreditly.io/articles/how-to-create-a-crud-in-wordpress-without-using-plugins#content-section-2-creating-a-custom-admin-menu-item
 */


 class TableConnection {

    readonly string $tableName;
    readonly array $fields;
    readonly string $keys;

    public function __construct(
        private $wpdb,
        string $tableName,
        array $fields,  // array("id" => "mediumint(9) NOT NULL AUTO_INCREMENT", "name" => "tinytext NOT NULL", ...)
        string $keys    // "PRIMARY KEY (id), INDEX name (name), INDEX address (address)"
    ) {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        $slug = strtolower($tableName);
        $tableName = $this->wpdb->prefix . $slug;

        $this->wpdb = $wpdb;
        $this->tableName = $tableName;
        $this->fields = $fields;
        $this->keys = $keys;
    }

    public function createTable() {
        $charset_collate = $this->wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $this->tableName (";
        foreach ($this->fields as $name => $description) {
            $sql .= "$name $description ,";
        }
        $sql .= $this->keys;
        $sql .= ") $charset_collate;";

        dbDelta($sql);
    }

    public function deleteTable() {
        $this->wpdb->query( "DROP TABLE IF EXISTS $this->tableName" );
    }

    public function getAll() {
        $results = $this->wpdb->get_results("SELECT * FROM $this->tableName");
        return $results;
    }

    public function getById($id) {
        $row = $this->wpdb->get_row($this->wpdb->prepare("SELECT * FROM $this->tableName WHERE id = %d", $id));
        return $row;
    }

    public function insert($data) {
        $data = $this->sanitize($data);
        if (!$data) {
            echo "Error: sanitation failed.";
            return;
        }
        $this->wpdb->insert($this->tableName, $data);
    }

    public function update($idField, $id, $data) {
        $data = $this->sanitize($data);
        if (!$data) {
            echo "Error: sanitation failed.";
            return;
        }
        $this->wpdb->update( $this->tableName, $data, array($idField => $id) );
    }

    public function delete($id) {
        $this->wpdb->query( "DELETE FROM `$this->tableName` WHERE id = $id" );
    }


    /** add_action('rest_api_init', dbc->registerRest) */
    public function registerRest() {
        register_rest_route(
            "/$this->tableName/v1",
            "/all",
            array(
                "methods" => "GET",
                "callback" => function () {
                    return $this->getAll();
                },
                "permission_callback" => function () {
                    return current_user_can("edit_others_posts");
                }
            )
        );
    }

    private function sanitize($data) {
        $out = array();
        foreach ($this->fields as $key => $val) {
            if ($key == "id") continue;
            if (array_key_exists($key, $data)) {
                $out[$key] = $data[$key];
            } else {
                return false;
            }
        }
        return $out;
    }

 }


class TableUI {

    protected string $nonceName;
    protected string $slug;

    public function __construct(
        protected TableConnection $tableConnection
    ) {

        $slug = strtolower($tableConnection->tableName);
        $nonceName = strtolower($slug) . "_nonce";

        $this->slug = $slug;
        $this->nonceName = $nonceName;
    }

    public function createTable() {
        $this->tableConnection->createTable();
    }

    public function deleteTable() {
        $this->tableConnection->deleteTable();
    }

    /** add_action('admin_menu', $dbc->createAdminMenu); */
    public function createAdminMenu() {
            $page_title = $this->slug;
            $menu_title = $this->slug;
            $capability = 'manage_options';
            $menu_slug = $this->slug;
            $function = function () {echo $this->tableMarkup(); };
            $icon_url = 'dashicons-admin-generic';
            $position = 25;

            add_menu_page($page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position);

            // Submenu pages
            add_submenu_page($menu_slug, 'Add New', 'Add New', $capability, $this->slug . '-add', function () { echo $this->addEntryMarkup(); });
            add_submenu_page($menu_slug, 'Edit', 'Edit', $capability, $this->slug . '-edit', function () {echo $this->editEntryMarkup(); });
            add_submenu_page($menu_slug, 'Delete', 'Delete', $capability, $this->slug . '-delete', function () {echo $this->deleteEntryMarkup(); });
    }

    public function tableMarkup() {
        $results = $this->tableConnection->getAll();

        $markup = '<div class="wrap">';
        $markup .= "<h1 class='wp-heading-inline'>" . $this->tableConnection->tableName . "</h1>";
        $markup .= '<a href="' . admin_url("admin.php?page=" . $this->slug . "-add") . '" class="page-title-action">Add New</a>';
        $markup .= '<hr class="wp-header-end">';

        $markup .= '<table class="wp-list-table widefat fixed striped">';
        $markup .= '<thead><tr>';
        foreach ($this->tableConnection->fields as $key => $description) {
            $markup .= "<th>$key</th>";
        }
        $markup .= "<th></th>";
        $markup .= '</tr></thead>';
        $markup .= '<tbody>';

        foreach ($results as $row) {
            $markup .= '<tr>';
            foreach ($row as $key => $val) {
                $markup .= '<td>' . esc_html($val) . '</td>';
            }
            $markup .= '<td>';
            $markup .= '<a href="' . admin_url('admin.php?page=' . $this->slug . '-edit&id=' . $row->id) . '" >Edit</a>';
            $markup .= " | ";
            $markup .= '<a href="' . admin_url('admin.php?page=' . $this->slug . '-delete&id=' . $row->id) . '" class="delete-link"   >Delete</a>';
            $markup .= '</td>';
            $markup .= '</tr>';
        }
        $markup .= '</tbody>';
        $markup .= '</table>';
        $markup .= '</div>';

        return $markup;
    }

    public function addEntryMarkup() {
        $markup = "";

        $nonceAction = $this->slug . "_add";

        if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST[$this->nonceName]) && wp_verify_nonce($_POST[$this->nonceName], $nonceAction)) {
            $this->tableConnection->insert($_POST);
            $markup .= '<div class="notice notice-success is-dismissible"><p>Datum added successfully!</p></div>';
            $markup .= '<div class="wrap"><button class="button button-primary" onclick="window.location.href=`' . admin_url("admin.php?page=" . $this->slug) . '`">Back</button></div>';
        }

        $markup .= '<div class="wrap">';
        $markup .= '<h1 class="wp-heading-inline">Add new datum</h1>';
        $markup .= '<hr class="wp-header-end">';

        $markup .= '<form method="post">';
        $markup .= '<table class="form-table">';
        foreach ($this->tableConnection->fields as $key => $val) {
            if ($key == "id") continue;
            $markup .= "<tr>";
            $markup .= "<th scope='row'><label for='$key'>$key</label></th>";
            $markup .= "<td><input type='text' name='$key' id='$key' class='regular-text' required></td>";
            $markup .= "</tr>";
        }
        $markup .= '</table>';

        $markup .= '<input type="hidden" name="' . $this->nonceName . '" value="' . wp_create_nonce($nonceAction) . '">';
        $markup .= '<p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="Add New"></p>';
        $markup .= '</form>';
        $markup .= '</div>';

        return $markup;
    }

    public function editEntryMarkup() {
        $markup = "";

        $nonceAction = $this->slug . "_edit";

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $row = $this->tableConnection->getById($id);

        if (!$row) {
            $markup .= '<div class="notice notice-error is-dismissible"><p>Invalid ID!</p></div>';
            return $markup;
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST[$this->nonceName]) && wp_verify_nonce($_POST[$this->nonceName], $nonceAction)) {
            $this->tableConnection->update("id", $id, $_POST);
            $markup .= '<div class="notice notice-success is-dismissible"><p>Datum updated successfully!</p></div>';
            $markup .= '<div class="wrap"><button class="button button-primary" onclick="window.location.href=`' . admin_url("admin.php?page=" . $this->slug) . '`">Back</button></div>';
        }

        $markup .= '<div class="wrap">';
        $markup .= '<h1 class="wp-heading-inline">Edit datum</h1>';
        $markup .= '<hr class="wp-header-end">';

        $markup .= '<form method="post">';
        $markup .= '<table class="form-table">';
        foreach ($row as $key => $val) {
            if ($key == "id") continue;
            $markup .= "<tr>";
            $markup .= "<th scope='row'><label for='$key'>$key</label></th>";
            $markup .= "<td><input type='text' name='$key' id='$key' class='regular-text' required value='$val'></td>";
            $markup .= "</tr>";
        }
        $markup .= '</table>';

        $markup .= '<input type="hidden" name="' . $this->nonceName . '" value="' . wp_create_nonce($nonceAction) . '">';
        $markup .= '<p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="Update"></p>';
        $markup .= '</form>';
        $markup .= '</div>';

        return $markup;
    }

    public function deleteEntryMarkup() {
        $markup = "";

        $nonceAction = $this->slug . "_delete";

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $row = $this->tableConnection->getById($id);

        if (!$row) {
            $markup .= '<div class="notice notice-error is-dismissible"><p>Invalid ID!</p></div>';
            return $markup;
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST[$this->nonceName]) && wp_verify_nonce($_POST[$this->nonceName], $nonceAction)) {
            $this->tableConnection->delete($id);
            $markup .= '<div class="notice notice-success is-dismissible"><p>Datum removed successfully!</p></div>';
            $markup .= '<div class="wrap"><button class="button button-primary" onclick="window.location.href=`' . admin_url("admin.php?page=" . $this->slug) . '`">Back</button></div>';
        }
        else {
            $markup .= '<div class="wrap">';
            $markup .= '<h1 class="wp-heading-inline">Remove datum '. $row->id .'</h1>';
            $markup .= '<hr class="wp-header-end">';

            $markup .= '<form method="post">';
            $markup .= '<input type="hidden" name="' . $this->nonceName . '" value="' . wp_create_nonce($nonceAction) . '">';
            $markup .= '<p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="Delete"></p>';
            $markup .= '</form>';
            $markup .= '<button class="button button-primary" onclick="window.location.href=`' . admin_url("admin.php?page=" . $this->slug) . '`">Cancel</button>';
            $markup .= '</div>';
        }

        return $markup;
    }

}



function createUnitTableCon($wpdb) {
    return new TableConnection(
        $wpdb,
        "units",
        array(
            "id" => "mediumint(9) NOT NULL AUTO_INCREMENT",
            "name" => "tinytext NOT NULL",
        ),
        "PRIMARY KEY (id)"
    );
}

function createUnitRelTableCon($wpdb) {
    return new TableConnection(
        $wpdb,
        "unit_relations",
        array(
            "id" => "mediumint(9) NOT NULL AUTO_INCREMENT",
            "unit1" => "mediumint(9) NOT NULL",
            "unit2" => "mediumint(9) NOT NULL",
            "factor" => "float NOT NULL"
        ),
        "PRIMARY KEY (id), KEY (unit1), KEY (unit2)"
    );
}

function createValueTableCon($wpdb) {
    return new TableConnection(
        $wpdb,
        "values",
        array(
            "id" => "mediumint(9) NOT NULL AUTO_INCREMENT",
            "slug" => "tinytext NOT NULL",
            "text" => "tinytext NOT NULL",
            "value" => "float NOT NULL",
            "unit" => "mediumint(9) NOT NULL"
        ),
        "PRIMARY KEY (id), KEY (unit)"
    );
}


class UnitController extends TableUI {
    public function __construct($wpdb) {
        $unitTable = createUnitTableCon($wpdb);
        parent::__construct(
            $unitTable
        );
    }
}
```

Used in plugin like so:

```php

require_once(realpath( dirname( __FILE__ ) ) . '/db-controller.php');

function getUnitController() {
    global $wpdb;
    return new UnitController($wpdb);
}

function getUnitRelController() {
    global $wpdb;
    return new UnitRelController($wpdb);
}


function getValueController() {
    global $wpdb;
    return new ValueController($wpdb);
}

register_activation_hook( __FILE__, function () {
    $uc = getUnitController();
    $uc->createTable();
    $urc = getUnitRelController();
    $urc->createTable();
    $vc = getValueController();
    $vc->createTable();
});
register_deactivation_hook( __FILE__, function () {
    $uc = getUnitController();
    $uc->deleteTable();
    $urc = getUnitRelController();
    $urc->deleteTable();
    $vc = getValueController();
    $vc->deleteTable();
});
add_action('admin_menu', function () {
    $uc = getUnitController();
    $uc->createAdminMenu();
    $urc = getUnitRelController();
    $urc->createAdminMenu();
    $vc = getValueController();
    $vc->createAdminMenu();
});
```

## Static site

Things that don't work with static sites:

- search
- forms
- comments

Only partial static site:
https://wordpress.org/support/topic/do-you-have-to-convert-your-whole-site-to-static-or-partial-conversion-supported/

## Deployment

| Content type    | Deployment                 |     |     |     |
| --------------- | -------------------------- | --- | --- | --- |
| Page, Post      | Stored in DB               |     |     |     |
| Media           |                            |     |     |     |
| Block           | Defined in code            |     |     |     |
| Shortcode       | Defined in code            |     |     |     |
| Template(-part) | Per UI, exportable to code |     |     |     |
| Pattern         | Per UI, exportable to code |     |     |     |

https://github.com/marketplace/actions/deploy-wordpress
