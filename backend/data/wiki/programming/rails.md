# Ruby on Rails

## Resources
 - https://github.com/heartcombo/devise
 - https://www.codecademy.com/learn/rails-auth
 - https://www.railstutorial.org/book/modeling_users


## CLI

- `bundle`
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
  - `console`
  - `db`
    - `:migrate`
    - `:rollback`
      - `VERSION=<roll-back-all-including-this-date>`




## Directories

- `app`: controllers, models, views, helpers, channels, jobs, assets
- `bin`: executable scripts
- `config`: notably contains `routes.rb`
- `db`: all database stuff: migrations, schema, sqlite-file.
- `lib`:
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

All `@classAttributes` set in the controller are available to the view.
Important functions:
- `redirect_to <model-object>`: makes full new request to the model-object. (As opposed to `render`, which keeps the current request and the current db-state and evaluates a view.)



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
 - `link_to <link-text> <destination | model-object>`: if destination is a model-object, `article_path <destination>` is called
 - `render :<view-name> <params>`: evaluate a view



## Models
`./bin/rails generate model Task title:string description:text`
- Creates a migration file in `db/migrate`

`./bin/rails db:migrate`
- creates/updates `db/schema.rb` (basically the *.d.ts file for your database)
- applies changes to actual db


```irb
task = Task.new title: "Base task", description: "Learn rails"
task.save

task2 = Task.find 2
tasks = Task.all
```

Field-types:
 - `name:string`: A short string
 - `name:text`: A variable length string
 - `creator:references --- belongs_to`: Points to a parent-object's id field as a foreign-key. A many-to-one relation.
   - To add the parent's side of the relation, edit `app/models/creator.rb` and add the line `has_many :articles, dependent: :destroy`.
     - This is not required, but if we do add that, then we can get all the articles by a given creator with `@creator.articles`.
 - `avatar:attachment --- has_one_attached`: Points to a file in active_storage.
 - `photos:attachments --- has_many_attached`: Points to files in active_storage.



## Scaffold
Creates a default CRUD implementation: model, views, controller and routes.
`./bin/rails generate scaffold NAME [field:type]`.
Example: 
`./bin/rails generate scaffold Joke setup:text punchline:text user:references`
If you already have a model, you can still create migrations, controller and views around it by using `scaffold_controller` instead.



## Forms
Evaluated form-data is put into the `params` variable.



## Authentication
Easiest done with [devise](https://github.com/heartcombo/devise#starting-with-rails):
`$ rails generate devise <your-user-model-name>`


## Console
A wrapper around `irb` that knows about the current state of your rails-app.
`./bin/rails console`



## Active Storage
Metadata stored in 3 tables. Create those with `rails active_storage:install`.
Configuration of which storage-engine to use is defined in `config/storage.yml`.



## The weird parts
- Autoloading
  - Usually there is no `require`, except for importing code from the `lib` directory
  - 