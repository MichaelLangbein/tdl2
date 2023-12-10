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


### How do plugins like Gravityforms protect their plugin from being redistributed to the wild ?

They can't.

Since WordPress is GPL code, all code publicly distributed must also be licensed either as GPL, or GPL compatible.

The GPL states you cannot charge for code, but you can charge for distribution. So when you buy gravity forms, you're not paying for the plugin, you're paying for the downloading and acquisition of the plugin.

Once you have the plugin it is perfectly legal to burn it to a CD and mail it to 20,000 people free of charge. You won't get the support or updates ( unless you pay them again, or you have a support contract ), and it would be a pretty nasty thing to do ( they have a business! ), but it's perfectly legal.

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
   restart: always
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
   restart: always
 
 phpmyadmin:
   depends_on:
     - db
   image: phpmyadmin/phpmyadmin:latest
   container_name: phpmyadmin
   restart: always
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

### Part 1: compiling TS

`@wordpress/scripts` builds code usable in wordpress from typescript.
```bash
npm init -y
npm install --save-dev @wordpress/scripts
touch src/index.ts
# do some code
npx wp-scripts start
```
This will:
- compile ts to js
- compile sass to css
- create an index.asset.php, which lists all dependencies.

Webpack already knows that wordpress has its own version of react. If it seas react in your code, it will also add it automatically to `index.asset.php`.
Wordpress includes `react` and `react-DOM` by default. Any JS app can use them. Just `wp_enqueue_script('handle', plugins_url('assets/public/scripts.js', __FILE__), array('react', 'react-DOM'), 'some-version-hash');`


### Part 2: using compiled TS in a custom (static) block

1. Add a `block.json` in your plugin-directory.
```json
{
    "apiVersion": 3,
    "title": "My static block",
    "name": "statblock/firstblock",
    "category": "widgets",
    "icon": "smiley",
    "editorScript": "file:./build/index.js"
}
```

2. Tell wp where to find the that there is a block.json and where to find it. For that, create an `index.php`
```php
<?php
/**
 * Plugin Name: statblock
 */

// Function called when wp parses the module.
// When module is initialized, we register the block type with php,
// by giving php the path to the block.json
add_action('init', function () {
    register_block_type( __DIR__ );
});
```

3. Write tsx to tell wordpress what to execute when block is seen.
```tsx
// import react from "react";
import { registerBlockType } from '@wordpress/blocks';

// Wp already knows about this block through php.
// Here we tell it what to do when that block is to be shown.
registerBlockType('statblock/firstblock', {
    // return component shown in editor-view
    edit: function () {
        return <p> Hello world (from the editor)</p>;
    },
    // return component shown in client-view
    save: function () {
        return <p> Hola mundo (from the frontend) </p>;
    },
} );
```


### Part 3: attributes - maintaining state accross page-reloads

### Part 4: WP API

1. Activate the json-api: go to `http://localhost:8080/wp-admin/options-permalink.php` and chose any permalink-type other than `plain`.
2. You can access the api at `http://localhost:8080/wp-json`

## Database
