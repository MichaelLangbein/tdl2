# Python

## venv
- python -m venv ./venv  # creates a venv in the dir ./venv
- source ./venv/Scrips/activate
- pip install <some-package>
- deactivate
- pip freeze > requirements.txt
- pip install -r requirements.txt


## wheels
Python packages on Pypi come in *source-distributions*. 
Those contain both python source-files and c-source-files for any extensions.
Wheels are variantes of a package with pre-compiled binaries, ready made for specific distros.
When you see a message `Building wheels for collected packages:`, that means that a package is only available as a source-dist for your platform and binaries must be compiled locally.
For this to work, compilers like `g++` and dev-packages like `python-dev` (contains `*.h`s and `*.a`s) need to be present on your local machine.


## conda
Better than venv because:
- allows non-python binaries (like gdal, tensorflow, libblas, yfinance, ...)
- not bound to local python-version

Cheat-sheet:
- conda
  - config
    - --add channels conda-forge
    - --remove channels defaults
    - --set 
      - channel_priority strict
      - auto_activate_base false
    - --show channels
    - Or just alter `.condarc`
  - create 
    - --name <new-env-name>
  - activate <env-name>
  - env 
    - list
    - export --no-builds | grep -v "prefix" > environment.yml
    - remove --name <env-name>
    - create --name <new-env-name> --file path/to/environment.yml  (weirdly, `conda create --name xx --file yy.yml` does not work sometimes, but `conda env create --name xx --file yy.yml`.)
Conda to pip:
  - pip list --format=freeze > requirements.txt




# Matplotlib


## Basics

- Figure: canvas on which plots are created. Contains one or more axes
- Axis: 
- Artist: Text, Line, Circle, ...

```python
fig = plt.figure(figsize=5,4)
# left, bottom, width, height (as fractions of total)
axis1 = fig.add_axes([0.1, 0.1, 0.4, 0.9])  # <- multiple axes may overlap
axis1.set_xlabel('dafdsa')
axis1.set_title('fdafds')
axis1.plot(xData, yData, label='fdsafg')
axis1.scatter(xData, yData, label='fdsafds')  # you can stack multiple plots on the same axis
axis1.legend(loc=0)  # 0: tries to find best location for legend
# text: 0/0 is center of axis
axis1.text(0, 40, 'message')
axis1.set_xticks(xData)
axis1.set_xticklabels(xLabels)


# if you don't want overlap and have matplotlib do arrangement for you:
fig, axes = plt.subplots(figsize=(8,4), nrows=1, ncols=3)
plt.tight_layout()
```

## Plotting raster and polygon data
```python
def _plotRasterAndVector(raster: np.ndarray, geometries: shapely.geometry[]):
    fig = plt.figure(figsize=(10,8))
    ax = fig.add_axes([0.05, 0.05, 0.95, 0.95])
    ax.imshow(raster)
    for geometry in geometries:
        ax.plot(geometry.exterior.xy)
    plt.show()

def plotRasterAndVector(raster: rio.fh, vector: shapely.FeatureCollection):
    crs = raster.crs
    geometries = [project(f.geometry, crs) for f in vector.features]
    _plotRasterAndVector(raster.read(1), geometries)
```