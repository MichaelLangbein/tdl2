# Ruby on Rails

## Resources

- https://github.com/heartcombo/devise
- https://www.codecademy.com/learn/rails-auth
- https://www.railstutorial.org/book/modeling_users

## CLI

- `bundle`: ruby's equivalent to npm
  - `install`
  - `add <gem-name>`
  - `update`
- `rails`
  - `new blog`
  - `server`
  - `generate`
    - `model <name> [filename:type]`
    - `controller <name> <method-names>`
    - `scaffold <name> [field:type]`
    - `migration <migration-description>`
  - `destroy`: undoes a `generate`.
    - `model <name>`
    - ... identical to the above ...
  - `console`
  - `db`
    - `:migrate`
    - `:rollback`
      - `VERSION=<roll-back-all-up-to-but-not-including-this-date>`
  - `test`

## Directories

- `app`: controllers, models, views, helpers, channels, jobs, assets
- `bin`: executable scripts
- `config`: notably contains `routes.rb`
- `db`: all database stuff: migrations, schema, sqlite-file.
- `lib`: your own business logic - separate from rails logic
- `log`: app-log-files
- `public`: static files and compiled assets.
- `vendor`: for third-party software. Includes vendored gems

## Routing

A route maps a request to a controller-action.
Defined in `config/routes.rb`.

Routes-DSL:

- `get 'tasks/:id', to: 'tasks#show'` makes `params[:id]` available in the controller
- we can nest urls with:

## Controllers

`./bin/rails generate controller <controller-name> <method-names>`

- Creates a controller
- Adds a route to `config/routes.rb`
- Adds a view
- Adds a helper-file to `helpers/<controller>_helper.rb`

All `@<class-attributes>` set in the controller are available to the view.
Important functions:

- **Filters**:
  - `before_action :<method-name> only: [:new, :crate, :<other-method-names>]`: run
  - `after_action`
  - `around_action`: does something before, then `yield`s, then finishes with `ensure`
- **Rendering**:
  - `render <template-name>`: evaluates a view; view will have access to all of this controller's attributes
- **Routing**:
  - `redirect_to <destination | model-object>`: makes full new request to the model-object.
    - `destination`: `root_path` or `<your-model-name>_path` or `model-object`
    - As opposed to `render`, which keeps the current request and the current db-state and evaluates a view.
- **Globals**:
  - `params.require(:post).permit(:title, :body, :address)`: denies all other posted data
    - `params` is a method that looks like a hash containing both query-string parameters and post-body parameters
  - `session`: is a method that looks like a hash containing session data
  - `flash`: is a method that looks like a hash used as a nonce
    - Often used for error messages that shall disappear on next load
  - `cookies`: is a method that looks like a hash
  - `request`
  - `response`

## Views

By default located at `views/<controller-name>/<method-name>.html.erb`. Are created by cli alongside a controller.
Partials begin with an `_` character and are included in a view with `render`.

```erb
    <% @tasks.each do |task| %>
        <li>
            <%= task.title %> - <%= task.description %>
        </li>
    <% end %>
```

Important functions:

- `article_path <model-object>`: converts `Article` instance into `articles/id`
- `asset_path`
- `link_to <link-text> <destination | model-object>`
  - `destination`:
    - `root_path`
    - or `<your-model-name>_path`
    - or `model-object`
    - or `<controllername>_<methodname>_path`
- `button_to <label-text>, <model-object>, method: :delete`
- `render`:
  - `render :<view-name> <params>`: evaluate a view
  - `render <model-object>`: turns into `render views/_<object-name>`
- `format`
  - `format.html`
  - `format.json`

## Models and Migrations

- Model: the object-template for ORM outputs
  - If you want to add extra-powers to the data once it has been read from the database, change the model.
- Migration: code that changes the database
  - If you want changes in the database, create a migration.
- Notably, django does not distinguish that strictly between an active-record object (a model) and a migration. Django creates migrations based on diff's on the models.

`./bin/rails generate model Task title:string description:text`

- Creates a migration file in `db/migrate`

`./bin/rails db:migrate`

- creates/updates `db/schema.rb` (basically the \*.d.ts file for your database)
- applies changes to actual db

```ruby
task = Task.new title: "Base task", description: "Learn rails"
task.save
# Task.create does `new` and `save` at the same time

task2 = Task.find 2
tasks = Task.all
```

Field-types:

- `name:string`: A short string
- `body:text`: A variable length string
- `author:references` in cli becomes in model `belongs_to`: Points to a parent-object's id field as a foreign-key. A many-to-one relation.
  - To add the parent's side of the relation, edit `app/models/creator.rb` and add the line `has_many :articles, dependent: :destroy`.
    - This is not required, but if we do add that, then we can get all the articles by a given creator with `@creator.articles`.
  - alias: `belongs_to`
- `avatar:attachment` in cli becomes in model `has_one_attached`: Points to a file in active_storage.
- `photos:attachments` in cli becomes in model `has_many_attached`: Points to files in active_storage.

Important methods:

- `validates :title, presence: true, length: {minimum: 5, maximum: 50}`
- `after_create :<method-name>`
- `before_update :<method-name>`

### Dummy data

```ruby
# db/seeds.rb
10.times do |x|
  Post.create title: "fdsafs", body: "fdafdafasd"
end
```

```bash
rails db:drop
rails db:migrate
rails db:seed
```

### Migrations

- CLI: `rails g migration AddNameToSubscribers name:string`

### Tree like models

https://prograils.com/three-ways-iterating-tree-like-active-record-structures

## Scaffold

Creates a default CRUD implementation: model, views, controller and routes.
`./bin/rails generate scaffold NAME [field:type]`.
Example:
`./bin/rails generate scaffold Joke setup:text punchline:text user:references`
If you already have a model, you can still create migrations, controller and views around it by using `scaffold_controller` instead.

## Forms

Evaluated form-data is put into the `params` variable.

```
<%= form_with(model: comment) do |form| %>

<% end %>
```

## Authentication

### Devise

Easiest done with [devise](https://github.com/heartcombo/devise#starting-with-rails):

```bash
$ rails generate devise:install
# update your config/environments/development.rb,
# your config/routes.rb,
# and app/views/layouts/application.html.erb
$ rails generate devise <your-user-model-name>
$ rails db:migrate
```

### Authentication Zero

## Console

A wrapper around `irb` that knows about the current state of your rails-app.
`./bin/rails console`

## Active Storage

Metadata stored in 3 tables. Create those with `rails active_storage:install`.
Configuration of which storage-engine to use is defined in `config/storage.yml`.

## Javascript

https://www.typescriptbites.io/articles/setting-up-rails-7-for-typescript-and-react

### Hotwire

- Turbo frames:
  - instead of updating the whole page on every interaction, turbo only fetches a part of a page.
  - rendering of that part still happens on server, though.
  - mark areas that are to be fetched and replaced through turbo with `turbo_frame`
  - turbo can only update one frame at a time. If you share state between many frames, then use turbo streams.
- Turbo streams:
  - syncs state between many users (as for chats) and/or many frames (like map and layer-control) using websockets.
- Stimulus
  - add 2 tags to your html: controller and action.
    - `<form data-controller="myController">`
    - `<input type="submit" data-action="click->myController#send" >`
  - those will be linked to a `Controller`:
    - in file `myController-controller.js`: `extends Controller` and add method `send`
  - `rails g stimulus home`

## The weird parts

- Auto-loading
  - Usually there is no `require`, except for importing code from the `lib` directory
  -
