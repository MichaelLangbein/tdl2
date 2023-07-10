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

- requires two layers: https://mapserver.org/ogc/wms_time.html#example-of-wms-t-with-postgis-tile-index-for-raster-imagery
  - one for index
    - contains a tile-index: https://mapserver.org/optimization/tileindex.html
    - could probably also be a sqlite-connection : https://mapserver.org/input/vector/sqlite.html
    - can be just created with gdaltindex: https://gdal.org/programs/gdaltindex.html
    - or with a python script: https://gis.stackexchange.com/questions/442928/create-tileindex-by-time-for-mapserver
  - one for raster data



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


StartDir = "/full/path/to/data/"
indexFileName = "tileIndex.shp"

def getBounds(path):
    raster = gdal.Open(path)
    ulx, xres, xskew, uly, yskew, yres = raster.GetGeoTransform()
    lrx = ulx + (raster.RasterXSize * xres)
    lry = uly + (raster.RasterYSize * yres)
    return box(lrx, lry, ulx, uly)

df = gpd.GeoDataFrame(columns=['filePath', 'geometry','timeStamp'])
for fname in os.listdir(StartDir):
    if fname.endswith(".tif"):
        fullname = os.path.join(StartDir, fname)
        ds=gdal.Open(fullname)
        metadata=ds.GetMetadata()
        ds=None
        df = df.append({'filePath': fullname, 'geometry': getBounds(fullname),'timeStamp': metadata['timexxx']}, ignore_index=True)

df.to_file(indexFileName)
```


```yml
LAYER
 NAME "someRasterLayer"
 TYPE RASTER
 STATUS ON
 DEBUG ON
 PROJECTION
   "init=epsg:4326"
 END

 METADATA
   "wms_title" "my time-enabled raster layer"
   "wms_srs"   "EPSG:4326"
   "wms_extent" "-126 24 -66 50"
   "wms_timeextent" "2003-08-01/2006-12-31/PT5M"
   "wms_timeitem" "timeStamp"                      # `timeStamp` is a column in your tileindex-shapefile
   "wms_timedefault" "2006-06-23T03:10:00Z"
   "wms_enable_request" "*"
 END
 OFFSITE 0 0 0
 TILEINDEX "./path/to/tileindex.shp"
 TILEITEM "filePath"                             # `filePath` is a column in `tileindex.shp` table with varchar of the filepath to each image
END
```
