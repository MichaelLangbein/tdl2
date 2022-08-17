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
```
version: '3.1'

services:

  wordpress:
    depends_on:
      - db
    image: wordpress
    ports:
      - 8080:80
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: WpDb
      WORDPRESS_DB_USER: WpUser
      WORDPRESS_DB_PASSWORD: WpUserPw
    volumes:
      - ./wp:/var/www/html

  db:
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: WpDb
      MYSQL_USER: WpUser
      MYSQL_PASSWORD: WpUserPw
      MYSQL_ROOT_PASSWORD: please
    volumes:
      - ./db:/var/lib/mysql

```

`docker compose up`



## PHP
https://www.youtube.com/watch?v=hbJiwm5YL5Q

### actions

### filters

### admin settings

### pages

### menus


## JS

### Gutenberg block types

### React bindings


## Database

### Custom post types

### Own database table