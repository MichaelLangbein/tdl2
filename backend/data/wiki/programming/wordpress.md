# Wordpress

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
    return (
      <div id="mycounter">Hi! I will be replaced with a react component.</div>
    );
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
// The shorcode can be whatever. [ng_wp] is just an example.
```

## REST API

1. Activate the json-api: go to `http://localhost:8080/wp-admin/options-permalink.php` and chose any permalink-type other than `plain`.
2. You can access the api at `http://localhost:8080/wp-json`

## Database

Creating a custom content type: https://gist.github.com/kosso/47004c9fa71920b441f3cd0c35894409

## Sortcodes

https://kinsta.com/blog/wordpress-shortcodes/

## Static site

Only partial static site:
https://wordpress.org/support/topic/do-you-have-to-convert-your-whole-site-to-static-or-partial-conversion-supported/
