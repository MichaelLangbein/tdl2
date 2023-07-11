# mapserver

- mostly c
- `mapserv` creates maps based on a `.map` file ... this is an offline process
- exposed to web trough apache2
- cgi through fcgid and apache2-cgi module
- http://localhost/cgi-bin/mapserv?map=/home/user/mapserver_quickstart.map&SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0
    - note `/cgi-bin/mapserv`
    - note `map=/home/user/mapserver_quickstart.map` <- must be accessible to apache


## apache-config

### allow cgi
In `/etc/apache2/sites-available/000-default.conf`:
```conf
        ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/
        <Directory "/usr/lib/cgi-bin/">
                AllowOverride All
                Options +ExecCGI -MultiViews +FollowSymLinks
                AddHandler fcgid-script .fcgi
                Require all granted
        </Directory>
```

### allow dir
Apache must have access to the directory where you store your .map file and your data.
Per default, `/var/www/` is apache's webroot. 


To add another directory, in `/etc/apache2/sites-available/000-default.conf`:
```conf
<DirectoryMatch "/path/to/dir/">
    Require all granted
</DirectoryMatch>
```
And add the apache-user to the owners of `path/to/dir`.

## map-config

```yml
MAP
  IMAGETYPE      PNG
  EXTENT         -97.238976 41.619778 -82.122902 49.385620
  SIZE           400 300
  SHAPEPATH      "./data"      # actually not only shapes, but all data
  IMAGECOLOR     255 255 255

  LAYER
    NAME "modis"
    DATA "raster/mod09a12003161_ugl_ll_8bit.tif"
    STATUS ON
    TYPE RASTER
    PROCESSING "Bands=1,2,3"     # string passed to GDAL
    OFFSITE 71 74 65
  END

  LAYER 
    NAME         "states_poly"
    DATA         "states_ugl.shp"
    STATUS       OFF
    TYPE         POLYGON

    CLASSITEM "CLASS"   # How do you know which item to use? use `ogrinfo` to display basic attribute infos
    CLASS
      NAME       "States"
      EXPRESSION 'land' # allows more complex queries on CLASSITEM, too: https://www.mapserver.org/mapfile/expressions.html#expressions
      STYLE
        COLOR    232 232 232
      END
    END
    CLASS
      NAME  "Water"
      EXPRESSION 'water'
      STYLE
        COLOR 150 150 250
      END
    END

  END

  LAYER
    NAME         "states_line"
    DATA         "states_ugl.shp"
    STATUS       OFF
    TYPE         LINE

    CLASS
      NAME       "State Boundary"
      STYLE
        COLOR    32 32 32
      END
    END
  END

END


# vim: set syntax=yaml:
```


Query this map via `http://localhost/cgi-bin/mapserv?map=/var/www/.map&mode=map&layer=states_line&layer=modis`


## WMS-TIME


```bash
# https://mapserver.org/utilities/tile4ms.html
find . -name "*.tif" -print > ./listOfTiffsFullPaths.txt
tile4ms ./listOfTiffsFullPaths.txt tileindex
rm ./listOfTiffsFullPaths.txt
gdalinfo ./tileindex.shp
```

or 
```bash
# https://gdal.org/programs/gdaltindex.html
gdaltindex -tileindex filePath -write_absolute_path ./tileIndex.shp ./data/elev_1.tiff ./data/elev_2.tiff ./data/elev_3.tiff
```

or, most thoroughly:
```python
import os, sys
from osgeo import gdal
import geopandas as gpd
from shapely.geometry import box

#%%
thisDir = os.path.dirname(os.path.realpath(__file__))
dataDir = os.path.join(thisDir, "out")
indexFileName = os.path.join(dataDir, "tileIndex.shp")

#%% creating data
noDataValue = -9999
rows = 40
cols = 40
bbox = { "lonMin": 11.214, "latMin": 48.064, "lonMax": 11.338, "latMax": 48.117 }

trueData = makeGaussianSample(cols, rows)
transform = makeTransform(rows, cols, bbox)

timeSteps = 30
deltaC = int(cols / timeSteps)
deltaTime = 60 * 60
startTimeString = "14.10.1986"
startTime = time.mktime(datetime.datetime.strptime(startTimeString, "%d.%m.%Y").timetuple())

for t in range(timeSteps):
    currentTime = int(startTime + t * deltaTime)
    startCol = t * deltaC
    endCol   = startCol + deltaC
    data = np.ones((rows, cols)) * noDataValue
    data[:, startCol:endCol] = trueData[:, startCol:endCol]
    saveToTif(f"{dataDir}]/data_{currentTime}.tif", data, "EPSG:4326", transform, noDataValue, currentTime)


#%% creating metadata


def getBounds(path):
    raster = gdal.Open(path)
    ulx, xres, xskew, uly, yskew, yres = raster.GetGeoTransform()
    lrx = ulx + (raster.RasterXSize * xres)
    lry = uly + (raster.RasterYSize * yres)
    return box(lrx, lry, ulx, uly)

rows = []
for fname in os.listdir(dataDir):
    if fname.endswith(".tif"):
        fullname = os.path.join(dataDir, fname)
        ds=gdal.Open(fullname)
        metadata=ds.GetMetadata()
        ds=None
        newRow = {'filePath': fullname, 'geometry': getBounds(fullname),'timeStamp': metadata['timexxx']}
        rows.append(newRow)

df = gpd.GeoDataFrame.from_dict(rows)
df.to_file(indexFileName)
```


```yml
MAP
  IMAGETYPE      PNG
  EXTENT         11.214 48.064 11.338 48.117
  SIZE           400 300
  IMAGECOLOR     255 255 255  # the above lines are only so that a non-wms request works, too.
  PROJECTION
    "init=epsg:4326"
  END
  
  LAYER
    NAME "someRasterLayer"
    TYPE RASTER
    STATUS ON
    DEBUG ON
   
    METADATA
      "wms_title"         "my time-enabled raster layer"
      "wms_srs"           "EPSG:4326"
      "wms_extent"        "11.214 48.064 11.338 48.117"
      "wms_timeextent"    "1986-10-14T00:00:00Z/1986-10-15T05:00:00Z/PT1H"
      "wms_timedefault"   "1986-10-14T00:00:00Z"
      "wms_timeitem"      "timeStamp"            # `timeStamp` is a column in your tileindex-shapefile
      "wms_enable_request" "*"
    END
    OFFSITE 0 0 0
    TILEINDEX "./data/tileIndex.shp"
    TILEITEM "filePath"                          # `filePath` is a column in `tileindex.shp` table with varchar of the filepath to each image
     FILTER (`[timeStamp]` = `1986-10-14T00:00:00Z`)  # just so there's a default value for non-wms requests, too.
  END

END
# vim: set syntax=yaml:
```

Access this with 
- http://localhost/cgi-bin/mapserv?map=/var/www/mapserver/mymap.map&&mode=map&layer=someRasterLayer
- http://localhost/cgi-bin/mapserv?map=/var/www/mapserver/mymap.map&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities
- http://localhost/cgi-bin/mapserv?map=/var/www/mapserver/mymap.map&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=someRasterLayer&STYLES=&SRS=EPSG:4326&BBOX=11.214,48.064,11.338,48.117&WIDTH=400&HEIGHT=300&FORMAT=image/png&TIME=1986-10-14T02:00:00Z

### Also works with CSV instead of shapefile
```python
pdf = pd.DataFrame(df.assign(geometry=df["geometry"].apply(lambda p: p.wkt)))
pdf.to_csv(indexFileName)
```
And then replace the `TILEINDEX` file-ending.