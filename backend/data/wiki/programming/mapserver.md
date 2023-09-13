# mapserver

- mostly c
- `mapserv` creates maps based on a `.map` file ... this is an offline process
- exposed to web trough apache2
- cgi through fcgid and apache2-cgi module
- http://localhost/cgi-bin/mapserv?map=/home/user/mapserver_quickstart.map&SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0
    - note `/cgi-bin/mapserv`
    - note `map=/home/user/mapserver_quickstart.map` <- must be accessible to apache


## Installation

1. Install apache:
    ```bash
    apt-get install -y apache2 apache2-mpm-worker libapache2-mod-fastcgi
    a2enmod actions fastcgi alias
    apt-get install libapache2-mod-php5 php5-common php5-cli php5-fpm php5
    ```
2. Find apache's cgi-dir: `cat /etc/apache2/sites-available/default | grep 'cgi-bin'`
3. Move binary to cgi-bin-dir


## Running offline:
https://mapserver.org/utilities/map2img.html#map2img 
## Debugging
https://www.mapserver.org/optimization/debugging.html
```yml
MAP
  ...
  CONFIG "MS_ERRORFILE" "/tmp/ms_error.txt"
  DEBUG 5                       # very, very verbose level
  CONFIG "CPL_DEBUG" "ON"       # to also activate gdal logging
  CONFIG "CPL_DEBUG" "ON"       # to also activate curl logging
  CONFIG "CPL_CURL_VERBOSE" "ON"
  CONFIG "PROJ_DEBUG" "ON"      # to also activate proj logging
  ...
  LAYER
    ...
  END
END
```
Calling with `map2img -m /var/www/mapserver/mymapfile.map -o test.png -all_debug 5`
Details on filtereing that output here: https://www.mapserver.org/optimization/debugging.html


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
Commonly, we put mapfiles in `/var/www/mapserver/*.map` and data in `/var/www/data/`.
A mapfile can then write `SHAPEPATH ../data` to access `/var/www/data/`.


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



## Geojson-data: bad; Flatgeobuf: good.

```yml
 IMAGETYPE      PNG
  EXTENT         -77.182712 -12.549659 -76.612665 -11.727448
  SIZE           400 300
  SHAPEPATH      "../data"    # path relative to mapfile. If mapfile is in /var/www/mapserver/, then this would be /var/www/data
  IMAGECOLOR     255 255 255

  LAYER
      NAME "someName"
      TYPE POLYGON
      STATUS ON
      CONNECTIONTYPE OGR          # connection-type required for geojson
      CONNECTION "geojson/eqDamageRefUpdated.json"
      DATA "eqDamageRefUpdated"              # the OGR layername, found through ogrinfo

      CLASS
              NAME    "damage"
              STYLE
                      RANGEITEM       "weighted_damage"
                      COLORRANGE      "#8cbaa7" "#8cbaa7"
                      DATARANGE       0.0 1.0
              END
              STYLE
                      RANGEITEM       "weighted_damage"
                      COLORRANGE      "#e8e9ab" "#e8e9ab"
                      DATARANGE       1.0 2.0
              END
              STYLE
                      RANGEITEM       "weighted_damage"
                      COLORRANGE      "#fed7aa" "#fed7aa"
                      DATARANGE       2.0 3.0
              END
              STYLE
                      RANGEITEM       "weighted_damage"
                      COLORRANGE      "#d78b8b" "#d78b8b"
                      DATARANGE       3.0 4.0
              END
      END

  END

END
```

**Severe problem with geojson**: mapserver need to parse whole file for every bbox. Reason: geojson doesn't have a spatial index built in. You're best off converting to a shapefile instead... or a flatgeobuf:


Example with shapefile (mapserver's default):
```yml
MAP
  IMAGETYPE      PNG
  EXTENT         -77.182712 -12.549659 -76.612665 -11.727448
  SIZE           400 300
  SHAPEPATH      "../data/shp"
  IMAGECOLOR     255 255 255

	LAYER
		NAME "damage"
		TYPE POLYGON
		STATUS ON
		DATA 		"peru_70000011/eqDamageRefUpdated.shp"

		# CLASSITEM	"builings" <- not required, because we do complex expressions instead of simple string comparisons (although those would be faster)
		CLASS
			NAME 		"empty"
			EXPRESSION 	( [buildings] <= 0 )		# syntax: https://gis.stackexchange.com/questions/113819/multiple-classitems-in-a-mapfile
			STYLE
				COLOR			"#a0a0a0"
				OUTLINECOLOR	"#6f6f6f"
			END
		END
		CLASS
			NAME		"damage"
			EXPRESSION 	( [buildings] > 0 )
			STYLE
				RANGEITEM		"weighted_d"		# note how the column name is truncated to 10 letters. 
				COLORRANGE		"#8cbaa7" "#8cbaa7"
				OUTLINECOLOR 	"#729787"
				DATARANGE		0.0 1.0
			END
			STYLE
				RANGEITEM		"weighted_d"
				COLORRANGE		"#e8e9ab" "#e8e9ab"
				OUTLINECOLOR	"#c4c490"
				DATARANGE		1.0 2.0
			END
			STYLE
				RANGEITEM		"weighted_d"
				COLORRANGE		"#fed7aa" "#fed7aa" 
				OUTLINECOLOR	"#bfa280"
				DATARANGE		2.0 3.0
			END
			STYLE
				RANGEITEM		"weighted_d"
				COLORRANGE		"#d78b8b" "#d78b8b"
				OUTLINECOLOR	"#a86d6d"
				DATARANGE		3.0 4.0
			END
		END

	END

END

```

Example with geobuf:
```yml
MAP
  IMAGETYPE      PNG
  EXTENT         -77.182712 -12.549659 -76.612665 -11.727448
  SIZE           400 300
  SHAPEPATH      "../data"
  IMAGECOLOR     255 255 255

                    LAYER
                        NAME "someName"
                        TYPE POLYGON
                        STATUS ON
                        CONNECTIONTYPE  flatgeobuf                      # no need for OGR-connection-type here; mapserver has its own, native drivers for fgb
                        CONNECTION      "fgb/eqDamageRefUpdated.fgb"
                        DATA            "eqDamageRefUpdated"              # the OGR layername, found through ogrinfo (make sure ogrinfo supports fgb: `ogrinfo --formats`)
                        CONNECTIONOPTIONS
                                "VERIFY_BUFFERS" "NO"                   # helps with performance
                        END

                        CLASS
                                NAME    "damage"
                                STYLE
                                        RANGEITEM       "buildings"
                                        COLORRANGE      "#a0a0a0" "#a0a0a0"
                                        DATARANGE       0.0 0.0001
                                END
                                STYLE
                                        RANGEITEM       "weighted_damage"
                                        COLORRANGE      "#8cbaa7" "#8cbaa7"
                                        DATARANGE       0.0 1.0
                                END
                                STYLE
                                        RANGEITEM       "weighted_damage"
                                        COLORRANGE      "#e8e9ab" "#e8e9ab"
                                        DATARANGE       1.0 2.0
                                END
                                STYLE
                                        RANGEITEM       "weighted_damage"
                                        COLORRANGE      "#fed7aa" "#fed7aa"
                                        DATARANGE       2.0 3.0
                                END
                                STYLE
                                        RANGEITEM       "weighted_damage"
                                        COLORRANGE      "#d78b8b" "#d78b8b"
                                        DATARANGE       3.0 4.0
                                END
                        END

                    END

END
```




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
#%%
import time
import datetime
import numpy as np
from raster import makeTransform, saveToTif
from gaussian import makeGaussianSample
from osgeo import gdal
import pandas as pd
import geopandas as gpd
from shapely.geometry import box
import os 


#%%
thisDir = os.path.dirname(os.path.realpath(__file__))
dataDir = os.path.join(thisDir, "data")
if not os.path.exists(dataDir):
    os.makedirs(dataDir)
indexFileName = os.path.join(dataDir, "tileIndex.shp")


#%% creating data
noDataValue = -9999
rows = 40
cols = 60
bbox = { "lonMin": 11.214, "latMin": 48.064, "lonMax": 11.338, "latMax": 48.117 }

trueData = makeGaussianSample(cols, rows)
trueData = np.uint8(trueData * 255)
transform = makeTransform(rows, cols, bbox)

timeSteps = 30
deltaC = int(cols / timeSteps)
deltaTime = 60 * 60
startTimeString = "14.10.1986"
startTime = time.mktime(
    datetime.datetime.strptime(startTimeString, "%d.%m.%Y").timetuple()
)

for t in range(timeSteps):
    currentTime = int(startTime + t * deltaTime)
    startCol = t * deltaC
    endCol = startCol + deltaC
    data = np.ones((rows, cols)) * noDataValue
    data[:, startCol:endCol] = trueData[:, startCol:endCol]
    saveToTif(f"{dataDir}/data_{currentTime}.tif", data, "EPSG:4326", transform, noDataValue, currentTime)


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
if indexFileName.endswith(".shp"):
    df.to_file(indexFileName)
elif indexFileName.endswith(".csv"):
    pdf = pd.DataFrame(df.assign(geometry=df["geometry"].apply(lambda p: p.wkt)))
    pdf.to_csv(indexFileName)

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
    

    
    PROCESSING "SCALE=0,255"
    PROCESSING "SCALE_BUCKETS=4"
    CLASS
      EXPRESSION ([pixel] < 50.0)
      STYLE
        COLOR 200 0 0
      END
    END
    CLASS
      EXPRESSION ([pixel] < 100)
      STYLE
        COLOR 125 75 0
      END
    END
    CLASS
      EXPRESSION ([pixel] < 150)
      STYLE
        COLOR 100 100 0
      END
    END
    CLASS
      EXPRESSION ([pixel] >= 150)
      STYLE
        COLOR 50 150 0
      END
    END

    
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


### dockerizing
```Dockerfile
FROM ghcr.io/osgeo/gdal:ubuntu-small-3.7.0 as buildStage

# workdir: deliberately using same name as deployment target in runStage
# this is because createData saves absolute file-paths to index-file
WORKDIR /etc/mapserver/   


RUN apt-get update
RUN apt-get install -y python3 python3-pip
COPY . .
RUN pip3 install -r requirements.txt
RUN python3 ./createData.py


FROM camptocamp/mapserver:7.6-20-04 as runStage


COPY --from=buildStage /etc/mapserver/data /etc/mapserver/data
# this container expects the mapfile to be named `mapserver.map`
COPY --from=buildStage /etc/mapserver/mapserver.map /etc/mapserver/

```