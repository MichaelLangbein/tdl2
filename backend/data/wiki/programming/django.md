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


### Common errors
 - Reverse for 'project' with keyword arguments '{'pk': ''}' not found.
   - either there is no url named 'project'
   - or the argument pk has not been set to a concrete value.
 - Generic detail view SprintCreate must be called with either an object pk or a slug in the URLconf.
   - you're referencing self.object too early.

### Users

 - user
 - group

### Forms

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
