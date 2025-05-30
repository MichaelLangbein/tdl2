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

### Most common functions in views:

| Function/Class                    | Common Arguments                                                                         | Description                                                                                                                                                          | Example Usage                                                                                                                                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render()                          | request, template_name, context (optional)                                               | Renders a given template with a given context dictionary and returns an HttpResponse object.                                                                         | `from django.shortcuts import render`<br>`def my_view(request):`<br>` context = {'name': 'World'}`<br>` return render(request, 'my_template.html', context)`                                                                    |
| redirect()                        | to, permanent=False,                                                                     | Returns an HttpResponseRedirect to the appropriate URL for the arguments passed.                                                                                     | `from django.shortcuts import redirect`<br>`def my_view(request):`<br>` # Redirect to a URL name`<br>` return redirect('named_url_pattern')`<br>` # Redirect to an absolute URL`<br>` # return redirect('/another-url/')`       |
| get_object_or_404()               | klass,                                                                                   | Calls get() on a given model manager, but it raises Http404 instead of the model’s DoesNotExist exception.                                                           | `from django.shortcuts import get_object_or_404`<br>`from .models import MyModel`<br>`def detail_view(request, pk):`<br>` obj = get_object_or_404(MyModel, pk=pk)`<br>` return render(request, 'detail.html', {'object': obj})` |
| HttpResponse()                    | content, content_type (optional), status (optional)                                      | An HTTP response class with a string as content.                                                                                                                     | `from django.http import HttpResponse`<br>`def simple_view(request):`<br>` return HttpResponse("Hello, this is a simple response.")`                                                                                            |
| JsonResponse()                    | data, encoder (optional), safe=True (optional)                                           | An HttpResponse subclass that helps to create a JSON-encoded response.                                                                                               | `from django.http import JsonResponse`<br>`def api_view(request):`<br>` data = {'key': 'value', 'count': 42}`<br>` return JsonResponse(data)`                                                                                   |
| reverse() / reverse_lazy()`       | viewname, urlconf (optional), args (optional), kwargs (optional), current_app (optional) | Utility functions to look up a URL by its name (as defined in urls.py). reverse_lazy is used for URLs that may not have been loaded yet (e.g., in class attributes). | `from django.urls import reverse`<br>`from django.http import HttpResponseRedirect`<br>`def my_view(request):`<br>` url = reverse('detail_view_name', args=[item_id])`<br>` return HttpResponseRedirect(url)`                   |
| Request object attributes/methods | e.g., request.method, request.POST, request.GET, request.user, request.FILES             | The request object itself provides access to metadata about the current HTTP request.                                                                                | `def form_handling_view(request):`<br>` if request.method == 'POST':`<br>` name = request.POST.get('name')`<br>` # ... process form ...`<br>` current_user = request.user`                                                      |

## Template (aka. view)

base.html

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jokes</title>
    </head>
    <body>
        {% block content %}Placeholder content{% endblock %}
    </body>
</html>
```

list.html

```html
{% extends "./base.html" %}
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

### Most common tags and filters in templates:

| Name             | Type   | arguments                                             | Description                                                                                                                                        | Example                                                                                                                                                                                                                     |
| ---------------- | ------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {{ variable }}   | Tag    | variable_name                                         | Outputs the value of a variable passed from the view's context. Applies HTML escaping by default. Can use dot notation for attributes/keys.        | `<h1>Hello, {{ user.name }}!</h1><br/><p>Your score is: {{ scores.math }}</p>`                                                                                                                                              |
| {% for %}        | Tag    | item in iterable %}{% empty %}{% endfor %}`           | Loops over each item in an iterable (list, queryset, etc.). {% empty %} is optional for when the iterable is empty.                                | `<ul>{% for item in item_list %}<br/> <li>{{ item.name }}</li><br/>{% empty %}<br/> <li>No items found.</li><br/>{% endfor %}</ul>`                                                                                         |
| {% if %}         | Tag    | condition %}{% elif condition %}{% else %}{% endif %} | Conditional rendering. Evaluates a condition and renders content accordingly. elif and else are optional.                                          | `{% if user.is_authenticated %}<br/> <p>Welcome, {{ user.username }}!</p><br/>{% elif is_guest %}<br/> <p>Welcome, Guest!</p><br/>{% else %}<br/> <p>Please log in.</p><br/>{% endif %}`                                    |
| {% url %}        | Tag    | 'url_name' [arg1] [key=value]                         | Generates a URL by reversing a URL pattern name defined in urls.py. Helps keep URLs maintainable.                                                  | `<a href="{% url 'article_detail' article.id %}">Read more</a><br/><a href="{% url 'search' query='django' %}">Search</a>`                                                                                                  |
| {% static %}     | Tag    | 'path/to/static/file'                                 | Generates the absolute URL for a static file (CSS, JS, images) based on STATIC_URL and configured static file finders. Requires {% load static %}. | `{% load static %}<br/><link rel="stylesheet" href="{% static 'css/style.css' %}">`                                                                                                                                         |
| {% extends %}    | Tag    | 'base_template.html'                                  | Specifies that the current template inherits from a base template. Must be the first tag in the template.                                          | `{% extends "base.html" %}`                                                                                                                                                                                                 |
| {% block %}      | Tag    | block_name %}{% endblock %}`                          | Defines a block of content that child templates can override. Used in conjunction with {% extends %}.                                              | `{# In base.html #}<br/>{% block content %}<p>Default content.</p>{% endblock %}<br/><br/>{# In child.html #}<br/>{% extends "base.html" %}<br/>{% block content %}<br/> <h2>Page Specific Content</h2><br/>{% endblock %}` |
| {% include %}    | Tag    | 'template_name.html' [with context_var=value]`        | Includes the content of another template.                                                                                                          | `{% include "includes/navigation.html" with active_nav='home' %}`                                                                                                                                                           |
| date             | Filter | variable                                              | Formats a date/datetime object. FORMAT_STRING uses PHP-style date formatting characters.                                                           |                                                                                                                                                                                                                             |
| length           | Filter | iterable                                              | Returns the length of an iterable or string.                                                                                                       |                                                                                                                                                                                                                             |
| safe             | Filter | variable                                              | Marks a string as not requiring further HTML escaping. Use with caution on trusted content only to prevent XSS.                                    |                                                                                                                                                                                                                             |
| {% csrf_token %} | Tag    |                                                       | Provides Cross-Site Request Forgery protection for forms submitted via POST. Essential for security.                                               | `<form method="post">{% csrf_token %}<br/> ... your form fields ...<br/></form>`                                                                                                                                            |

## Forms

urls.py

```python
urlpatterns = [
    path("/path/to/form", myForm, name="myForm")
]
```

FormView.py

```python
def myForm(req):
    if req.method == "POST":
        yourName = req.POST["yourName"]
        return redirect("homePage", {"yourName": yourName})
    else:
        return render("FormTemplate.html", req, {})
```

FormTemplate.html

```html
<form action="{% url myForm %}" method="post">
    {% crsf_token %}
    <label for="yourName">Your name:</label>
    <input id="yourName" type="text" name="yourName" value="{{ yourName }}" />
    <input type="submit" value="OK" />
</form>
```

## Static files

https://www.youtube.com/watch?v=RhJIMUMJ_Do

## Template tags

Basically a way to create custom tags or functions that are callable inside a template.
https://docs.djangoproject.com/en/5.2/howto/custom-template-tags/

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

## Setting up user-management

https://www.youtube.com/watch?v=CTrVDi3tt8o&t=719s

-   in urls.py, add `path('accounts/', include('django.contrib.auth.urls'))`
-   create `templates/logged_out.html, login.html, password_reset_[complete|confirm|done|email|form].html`
-   to ensure login in view functions, decorate functions with `@login_required`
-   to ensure login in view classes, extend classes from `LoginRequiredMixin`

## Setting up ownership

-   create custom decorator: `def isOwnPostOrAdmin(fun, *args, **kwargs): `
-   when dealing with generic view classes, apply that decorator like this: `@method_decorator(isOwnPostOrAdmin, name='dispatch')`
-   or create a custom mixin that hooks into (=overwrites) the `dispatch` method:
    ```python
    class ProductExistsRequiredMixin:
        def dispatch(self, request, *args, **kwargs):
            if Product.objects.filter(pk=1, activate=True):
                return super().dispatch(request, *args, **kwargs)
            else:
                raise PermissionDenied
    ```

## Setting up permissions

-   add permissions to models using `Modelname > Meta > permissions = [(permission_key, permission_clear_text), ...]`
-   in admin panel, associate permissions with groups
-   templates can access permissions in the `perms` variable
-   view functions can check permissions by decorating with `@permission_required('catalog.can_mark_returned')`
-   view classes can check permissions by extending from `PermissionRequiredMixin` and adding a property `permission_required = ('catalog.can_mark_returned', 'catalog.change_book')`
    -   a few permissions are created automatically: `change_book, add_book, delete_book`
-   alternatively, view classes can use `@method_decorator([never_cache, login_required], name='dispatch')`

# Common errors

-   `Reverse for 'project' with keyword arguments '{'pk': ''}' not found.`
    -   either there is no url named 'project'
    -   or the argument pk has not been set to a concrete value.
-   `Generic detail view SprintCreate must be called with either an object pk or a slug in the URLconf.`
    -   you're referencing self.object too early.

# Deployment

## CGI vs WSGI vs ASGI

Django now per default uses ASGI.

| Protocol | implemented by  | processes                                                                                                                    | Connections     |
| -------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------- |
| CGI      | apache2/mod_cgi | 1 proc/request                                                                                                               | HTTP            |
| WSGI     | python/gunicorn | 1 long running process, <br>- spawning 1 blocking thread per request                                                         | HTTP            |
| ASGI     | python/uvcorn   | 1 long running process, <br>- sync view: spawning 1 blocking thread per request<br>- async view: in event-loop (eg async.io) | HTTP, websocket |

-   nginx
-   uvcorn as a systemd process
