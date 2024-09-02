# Django

Using `conda activate django`

## CLI

-   `django-admin startproject name`
-   `python manage.py runserver`
-   `python manage.py createsuperuser`
-   `python manage.py startapp name`
-   `python manage.py makemigrations`
-   `python manage.py migrate`
-   `python manage.py shell`
-   `python manage.py dbshell`

## Structure

app

-   `admin.py`
    -   for registering your models
-   `models.py`
-   `urls.py`
    -   routing urls to views
-   `views.py`
    -   controllers to load models and return to templates
-   `templates/*.html`
    -   folder must be named `templates`

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
    <li>{{ todo.title }}: {% if todo.completed %}Completed{% else %}Not completed{% endif %}</li>
    <a href="{% url "todo_detail_view" todo.id %}">Go to item</a>
    {% endfor %}
</ul>
{% endblock %}
```

# Saving on typing: generic

## Generic (= class based) views

```python
# views.py
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .forms import ProjectForm

class ProjectView(CreateView):
    model = Project
    form = ProjectForm
```

View types:

-   View
-   CreateView
    -   model = Author
    -   fields = ["name"]
-   EditView
-   ListView
-   DetailView
-   DeleteView
-   FormView
    -   template_name = "contact.html" <-- includes some `form.to_p`
    -   form_class = ContactForm
    -   success_url = reverse_lazy("list_view")

## Generic forms

```python
# forms.py
class ProjectForm(ModelForm):
    class Meta:
      model = Project
      fields = ['title', 'description']
```

Form types:

-   Form
-   ModelForm

# User management

Django already has a built-in user-mgmt.

Setting up **user-management**:

-   in urls.py, add `path('accounts/', include('django.contrib.auth.urls'))`
-   create `templates/logged_out.html, login.html, password_reset_[complete|confirm|done|email|form].html`
-   to ensure login in view functions, decorate functions with `@login_required`
-   to ensure login in view classes, extend classes from `LoginRequiredMixin`

Using **ownership**:

-   create custom decorator: `def isOwnPostOrAdmin(fun, *args, **kwargs): `

Setting up **permissions**:

-   add permissions to models using `Modelname > Meta > permissions = [(permission_key, permission_clear_text), ...]`
-   in admin panel, associate permissions with groups
-   templates can access permissions in the `perms` variable
-   view functions can check permissions by decorating with `@permission_required('catalog.can_mark_returned')`
-   view classes can check permissions by extending from `PermissionRequiredMixin` and adding a property `permission_required = ('catalog.can_mark_returned', 'catalog.change_book')`
    -   a few permissions are created automatically: `change_book, add_book, delete_book`
-   alternatively, view classes can use `@method_decorator(login_required, name='dispatch')`

# Common errors

-   `Reverse for 'project' with keyword arguments '{'pk': ''}' not found.`
    -   either there is no url named 'project'
    -   or the argument pk has not been set to a concrete value.
-   `Generic detail view SprintCreate must be called with either an object pk or a slug in the URLconf.`
    -   you're referencing self.object too early.
