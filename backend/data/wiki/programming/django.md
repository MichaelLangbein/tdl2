# Django

Using `conda activate django`

## CLI
- `django-admin startproject name`
- `python manage.py runserver`
- `python manage.py startapp name`
- `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py shell`
- `python manage.py dbshell`

## Structure
app
    - admin
        - for registering your models
    - model
    - routes
        - routing urls to views
    - views
        - controllers to load models and return to templates

 - A request is routed to a view function f(request) -> response.
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

## Template (aka. view)


## Common errors
 - Reverse for 'project' with keyword arguments '{'pk': ''}' not found.
   - either there is no url named 'project'
   - or the argument pk has not been set to a concrete value.
 - Generic detail view SprintCreate must be called with either an object pk or a slug in the URLconf.
   - you're referencing self.object too early.
