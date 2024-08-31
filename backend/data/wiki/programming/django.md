# Django

Using `conda activate django`

## CLI
- `django-admin startproject name`
- `python manage.py runserver`
- `python manage.py createsuperuser`
- `python manage.py startapp name`
- `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py shell`
- `python manage.py dbshell`

## Structure
app
    - `admin.py`
        - for registering your models
    - `models.py`
    - `urls.py`
        - routing urls to views
    - `views.py`
        - controllers to load models and return to templates
    - `templates/*.html`
        - folder must be named `templates`

 - A request is routed to a view function:  `f(request) -> response`.
   - if this request makes use of a model and/or a template is up to the view to decide.
   - really, the view here is much rather a *controller*.



## Users

 - user
 - group

## Forms

 - ModelForm:
   - ```python
      class ProjectForm(ModelForm):
         class Meta:
            model = Project
            fields = ['title', 'description']
      ```
 - CreateView:
   - ```python
         class ProjectView(CreateView):
            model = Project
            form = ProjectForm
      ```

## Models
Rails requires you to maintain a file for models (=the way data is read from the db into an object) and another for migrations (the way data is put into the db).
Django does not distinguish in this way between models and migrations - migrations are created automatically from diffs on your model file and the current db-state.

```shell
python manage.py makemigrations
python manage.py migrate
```

```python
from django.db import models 

class Reporter(models.Model):
  full_name = models.CharField(max_length=70) 
  def __str__(self):
    return self.full_name

class Article(models.Model):
  pub_date = models.DateField()
  headline = models.CharField(max_length=200)
  content = models.TextField()
  reporter = models.ForeignKey(Reporter, on_delete=models.CASCADE)
  def __str__(self): 
    return self.headline
```

## Views (aka. controllers)

```python
from django.shortcuts import render, HttpResponse
from .models import TodoItem

def home(request):
    # return HttpResponse("Hello, world!")    <-- returns raw text
    return render(request, "home.html")     # <-- renders a jinja template

def todos(request):
    items = TodoItem.objects.all()          # <-- access the db
    return render(request, "todos.html", {  # <-- template with arguments
        "todos": items
    })
```

## Template (aka. view)

```html
{% extends "base.html" %} 
<!-- `extends` means that this template will overwrite the `content` block in `base.html` -->
  {% block content %}
    <h1>Todo list</h1>
    <ul>
        {% for todo in todos %}
          <li>
              {{ todo.title }}: {% if todo.completed %}Completed{% else %}Not completed{% endif %}
          </li>
        {% endfor %}
    </ul>
  {% endblock %}
```

## Common errors
 - `Reverse for 'project' with keyword arguments '{'pk': ''}' not found.`
   - either there is no url named 'project'
   - or the argument pk has not been set to a concrete value.
 - `Generic detail view SprintCreate must be called with either an object pk or a slug in the URLconf.`
   - you're referencing self.object too early.
