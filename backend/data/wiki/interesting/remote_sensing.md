# Remote sensing

It's not all that easy to find good media about the remote sensing field. I do however enjoy the snippy tone of [http://blog.imagico.de/](http://blog.imagico.de/).

## Lingo

Elevation

- DSM (German DOM): Digital surface model - includes buildings and trees. Commonly from LIDAR.
- DEM: Digital elevation model - ground level; from DSM, with buildings and trees removed, or Radar or photogrammetry.
- DTM (German DGM): Digital terrain models - either synonym to DEM or a vectorized DEM with additional features where buildings and trees are
  - In Germany, the best source for an official DTM is BKG (Bundesamt für Kartographie und Geodäsie), größtenteils aus LIDAR, offered in 1m resolution
  - The best commercial solution is by the company Hexagon
  - The best raw data provider is Terrasar-X, which in spotlight mode has 25cm x 25cm resolution ... but really not a very good vertical accuracy (1-2 meters!)
- TIN: Triangular irregular network

## Electromagnetic radiation

Satellites all work the same way: they are flying machines that carry a camera. The camera has one or more sensors, each of which can observe some part of the electromagnetic spectrum.
Radar satellites have their own 'light' source: they actively send out radio-radiation and collect the reflection.

- Optical
- Radar: not hindered by clouds. Good for flood-detection
- Microwave: good for atmospheric observation

_Frequencies capable of penetrating the atmosphere_
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/rs_atmospheric_absorption.png" />

_Guide to the selection of frequencies in VIS \& NIR range_
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/rs_vis_nir_curves.png" />

_Example of important groups in VIS \& NIR_
<img width="30%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/rs_vis_nir_groups.png" />

## Orbital periods and acquisition

Satellites usually have an orbital period of 1 - 2 hours. They revisit the same spot on earth every 2-3 weeks.
(This example data is taken from landsat: an orbit takes 99 minutes, and it visits the same spot every 16 days.
Note that landsat always stays on the sunny side of earth - most visible-light satellites do this.)
Commonly, satellite series have offset periods so one machine of the same series visits the same spot every nth of a full orbital period.
However, some satellites can narrow or broaden their sensors, so even if a satellite visits the same spot again, it might not make the same snapshot again.
To handle the high demand and low availability of satellite images, acquisition plans are being made.
Usually, these take into account seasonal effects, water vapor, and also a ranking of requests from different scientific institutions.

Note that not all satellites can change their focus. Sentinel-5P, for example, does _sweep broom staring_, i.e. always looks down at exactly the same angle and swath width.
Consequently, there are no acquisition plans for Sentinel-5P.

- Lower earth orbit: 160-1000 km above sea level. ISS is at 600 km, OCO2 at 700 km. ~15.000 km/h for OCO.
  - A-track: a.k.a. the afternoon track. Passes equator from south at 14:00.
- Geo-stationary: 30.000 km above sea level. For communication- and relay-satellites. ~ 10.000 km/h.
- Moon: 300.000 km

## Radar

Radar is a little different from the optical VIS / NIR satellites.
The earth does not emit any radar-radiation (naturally, only a few pulsars do). So SAR-satellites need to actively send out signals.
On the bright side (haha) that means that SAR can be used at night. Also, with radio waves being longer than optical waves, they can penetrate clouds.
SAR-satellites often only carry a single antenna. This means that the band-centered strategies of PCA and max-llh-classification don't work there, since there is only one band.

- Earth does not emit any radar (in fact, only lightning and some pulsars do emit radar naturally). So, radar must be an active sensor. Advantage: works at night.
- The higher the wavelength, the better the penetration power: L\&P bands go through foliage and into the topsoil.
- The lower the wavelength, the better the resolution.
- Two data-products: amplitude and phase.
- Side-facing. This way water can specularly reflect radar and appear perfectly black in image.

Radar has some really weird properties.

Distance traveled by ray 1 = $d_1$
Distance traveled by ray 2 = $d_2 = d_1 + \delta$
$$d_2 = d_1 + \delta$$
$$t1 = 2 d_1 / c$$
$$t2 = 2 (d_1 + \delta) / c$$
Pulse duration $\tau$. Two points can only be differentiated if their beams return at least $\tau$ seconds apart.
$$t_2 - t_1 = \tau $$
$$ \tau = 2 \delta / c$$
Minimum slant distance between the two points:
$$\delta = \tau c / 2$$
Minimum ground distance between the two points:
$$r = \tau c / (2 \sin(\theta) )$$

Thus:

- The resolution is only a function of the incidence angle $\theta$ and the pulse duration $\tau$ - not of the platform altitude. A satellite gets an equally good resolution as an aircraft does.
- Resolution gets _better_ the higher the incidence angle $\theta$. This is why radar is always side-facing. There is no spatial resolution directly under the platform. Opposite to optical sensors, resolution gets better the further out the observation.
- **Polarization**: EM waves have a plane. In fact, there is a plane for the electrical wave and a perpendicular one for the magnetic field.
    If a horizontally polarized light beam hits my eye, I'd only see a horizontal line. Non-polarized light consists of many waves with all possible angles. If they hit my eye, I's see a circle, not a line.
    A radar antenna emits electric waves either vertically (V) or horizontally (H). The scattered signal \*might} have changed that polarization. Some antennas can pick up both V and H and differentiate between the two.
    Antenna designs:

- receive H, Transmit H: HH. Strong signal from horizontal, non-voluminous surfaces. Streets.
- receive H, Transmit V: HV. Strong signal from horizontal, voluminous surfaces. Rough fields, low shrubbery
- VH. Strong signal from vertical, voluminous surfaces. High trees
- VV. Strong signal from vertical, non-voluminous surfaces. Walls.

Note that direct sunlight is unpolarized - the sun sends out waves in all possible orientations.
But light can fall on objects that align polarization. Pretty much any time light reflects from something, it gets (at least partially, that is, elliptically) polarized.
The more refraction, the more likely a change in polarization. Consequently, polarization change happens much when there is volume-scattering (branches, dry soil, ...)
The direction of polarization is often parallel to the surface.

### Radar to RGB

- The band math used depends on the units of your input SAR data.
  - If your input SAR data is in decibels, the band combination must be VV for red, VH for green, and VV-VH for blue.
  - If your input SAR data is in linear units, use VV for red, VH for green, and VV/VH for blue.
- The color composite shows
  - water bodies (ocean, rivers, and flooded areas) in blue and purple tones,
  - vegetated and forested regions in green,
  - urban structures in yellow.
  - Pink can be optimally oriented urban structures (oriented orthogonally to the radar look direction), debris in the water, or flooded vegetation.

## Important satellites

**Landsat** program is the longest-running enterprise for acquisition of satellite imagery of Earth.
On July 23, 1972 the Earth Resources Technology Satellite was launched. This was eventually renamed to Landsat.
The most recent, Landsat 8, was launched on February 11, 2013. The instruments on the Landsat satellites have acquired millions of images.
The images, archived in the United States and at Landsat receiving stations around the world,
can be viewed through the U.S. Geological Survey (USGS) 'EarthExplorer' website.
Landsat 7 data has eight spectral bands with spatial resolutions ranging from 15 to 60 meters;
the temporal resolution is 16 days.[2] Landsat images are usually divided into scenes for easy downloading.
Each Landsat scene is about 115 miles long and 115 miles wide (or 100 nautical miles long and 100 nautical miles wide, or 185 kilometers long and 185 kilometers wide).

**Modis on Aqua and Terra** (NASA) is a spectro-radiometer. It measures 36 bands.

**ENVISAT** was ESA's environmental satellite. First satellite to measure CO2. Huge: large as a bus.
Launched 2002, scheduled until 2007, eventually lost contact 2012. Didn't manage to go to graveyard orbit - still hangs around at 800km.
Passes two objects a year > 10kg within 200m. Danger of causing Kessler syndrome.
Since replaced by the Sentinel-series.

**Sentinel** ESA is currently developing seven missions under the Sentinel programme.
The Sentinel missions include radar and super-spectral imaging for land, ocean and atmospheric monitoring.
Each Sentinel mission is based on a constellation of two satellites to fulfill and revisit the coverage requirements
for each mission, providing robust datasets for all Copernicus services.

**TerraSAR-X / Tandem-X**: two nearly identical satellites using interferometry. Produces _WorldDEM_.

- 25 * 25 cm horizontal accuracy in spotlight-mode
- better than 2 meters vertical accuracy in _absolute_ terms
- few millimeters vertical accuracy when comparing values (eg for volcanic rising)

## Important service providers

**Copernicus** is a EU program that makes satellite data freely available for the public. It financed ENVISAT and then the Sentinel program.
It also now made a contract with Finnish mini-SAR-company Iceye, publishing their data to the public for free.
Also, the remote-sensing field is only going to be commercially viable if we provide higher level products than the satellites alone.
Copernicus delivers _thematic_ maps that do _not_ show the underlying satellite data on their [Copernicus services](https://www.copernicus.eu/en) pages.
This may well be the most valuable source of data for remote-sensing based products.
Some good examples include:

- [CO2 timeseries](https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-carbon-dioxide?tab=overview)
- ...

**Sentinelhub** [homepage](https://www.sentinel-hub.com/), [eo-browser](https://www.sentinel-hub.com/explore/eobrowser/) is intended as a more user-oriented tool.
It facilitates Google-Earth-esque processing in the backend, having you only download the end-product. Nice features include: 3d-view, creation of timeseries-gifs, pins that can be aggregated to a story.
The webpage has a somewhat redacted selection of products - for example, I couldn't find S3-water data.
But it also offers a set of python tools. Documentation can be found [here](https://sentinelhub-py.readthedocs.io/en/latest/examples/process_request.html#Example-5:-Other-Data-Collections).
All data is listed [here](https://www.sentinel-hub.com/explore/data/).
Overall, before you work on some processing on your own, it is a very good idea to check if sentinel-hub already has the data, or at least parts of it.

**Scihub** ([here](https://scihub.copernicus.eu/)) is the open access hub for sentinel data.

**Eumetsat** contains Sentinel-3 L2 water products [here](https://coda.eumetsat.int/#/home).
For some reason, people have decided that S3-L2-W should be hosted on another page than all the other Sentinel products.

**CHIRPS** is ...

**EODC**: [Earth Observation Data Center for Water Resources Monitoring](https://www.eodc.eu/)

**Eurac**: [Eurac](http://www.eurac.edu) is a private research company ...

**Google Earth Engine** provides ...

**NASA's ECS** (Earth observation center Core System) is a vast catalogue of ...

**Earth explorer** (<https://earthexplorer.usgs.gov/>) USGS access point to Landsat and others. Manual download via UI great, API terrible

**Kaggle** (see [here](https://www.kaggle.com/search?q=sentinel) ) is a useful source for ready-labeled datasets for training.

**Amazon S3** keeps a lot of satellite data as COGs.

- Sentinel 1 from [here](https://registry.opendata.aws/sentinel-1/)
  - The above page does not seem to conform to STAC 1.0. Maybe [the US-specific data](https://raw.githubusercontent.com/scottyhq/sentinel1-rtc-stac/main/13SBD/catalog.json) is a bit better.
- Sentinel 2 from [here](https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/2020/S2A_36QWD_20200701_0_L2A/TCI.tif)
- Sentinel3 data from [here](https://github.com/Sentinel-5P/data-on-s3/blob/master/DocsForAws/Sentinel3Description.md)
- Landsat from [here](https://landsat-pds.s3.amazonaws.com/c1/L8/139/045/LC08_L1TP_139045_20170304_20170316_01_T1/LC08_L1TP_139045_20170304_20170316_01_T1)

The coverage is still pretty inconsistent and spotty. It makes sense to fall back to updated, curated lists like [this one](https://github.com/Fernerkundung/awesome-sentinel).

**PLANET** is a large US firm which has acquired ...

- VanderSat: a dutch agricultural satellite company which creates [soil-moisture and land-surface-temperature data](https://docs.vandersat.com/VanderSat_Data_Products.html#land-surface-temperature-lst-teff) from the microwave-satellites AMSR-2 (owned by JAXA) and -E (owned by NASA, on Aqua) ...which is weird, because usually you do thermal from infra-red, not microwave.
- Synergise: Slovenian company that created Sentinelhub
- Rapid Eye: one of first private constellations, optical, Berlin

## Obtaining data

In geo-science, actually obtaining data is an art... unfortunately. At least, OSM and AWS+STAC make things a little more standardized.

```python
#%%
#%%
import numpy as np
import matplotlib.pyplot as plt
import rasterio as rio
import rasterio.features as riof
import rasterio.transform  as riot
from pyproj.transformer import Transformer
from pystac_client import Client
import os
import requests as req
from urllib.parse import urlparse
import json


#%% part -1: bbox
bbox = [
    11.213092803955078,
    48.06580565720895,
    11.300640106201172,
    48.09161057547795
]

#%% Part 0: directories
thisDir = os.getcwd()
assetDir = os.path.join(thisDir, 'assets')
osmDir = os.path.join(assetDir, 'osm')
s2Dir = os.path.join(assetDir, 's2')
os.makedirs(osmDir, exist_ok=True)
os.makedirs(s2Dir, exist_ok=True)


#%% Part 1: download S2 data

def downloadAndSaveS2(saveToDirPath, bbox, maxNrScenes=1, maxCloudCover=10, bands=None):
    catalog = Client.open("https://earth-search.aws.element84.com/v0")

    searchResults = catalog.search(
        collections=['sentinel-s2-l2a-cogs'],
        bbox=bbox,
        max_items=maxNrScenes,
        query={
            "eo:cloud_cover": { "lt": maxCloudCover },
            "sentinel:valid_cloud_cover": { "eq": True }  # we want to have the cloud mask in there, too.
        },
    )

    def shouldDownload(key, val):
        if not val.href.endswith('tif'):
            return False
        if bands is not None and key not in bands:
            return False
        return True

    def rioSaveTif(targetFilePath, data, crs, transform, noDataVal):
        h, w = data.shape
        options = {
            'driver': 'GTiff',
            'compress': 'lzw',
            'width': w,
            'height': h,
            'count': 1,
            'dtype': data.dtype,
            'crs': crs,
            'transform': transform,
            'nodata': noDataVal
        }
        with rio.open(targetFilePath, 'w', **options) as dst:
            dst.write(data, 1)

    #  downloading only bbox-subset
    fullData = {}
    for item in searchResults.get_items():
        itemData = {}
        for key, val in item.assets.items():
            if shouldDownload(key, val):
                with rio.open(val.href) as fh:
                    coordTransformer = Transformer.from_crs('EPSG:4326', fh.crs)
                    coordUpperLeft = coordTransformer.transform(bbox[3], bbox[0])
                    coordLowerRight = coordTransformer.transform(bbox[1], bbox[2])
                    pixelUpperLeft = fh.index( coordUpperLeft[0],  coordUpperLeft[1] )
                    pixelLowerRight = fh.index( coordLowerRight[0],  coordLowerRight[1] )
                    # make http range request only for bytes in window
                    window = rio.windows.Window.from_slices(
                        ( pixelUpperLeft[0],  pixelLowerRight[0] ),
                        ( pixelUpperLeft[1],  pixelLowerRight[1] )
                    )
                    print(f"Downloading {key} data ...")
                    subset = fh.read(1, window=window)
                    itemData[key] = subset

                url = urlparse(val.href)
                fileName = os.path.basename(url.path)
                targetDir = os.path.join(saveToDirPath, item.id)
                os.makedirs(targetDir, exist_ok=True)
                fullFilePath = os.path.join(targetDir, fileName)
                rioSaveTif(fullFilePath, subset, fh.crs, fh.transform, fh.nodata)

        fullData[item.id] = itemData
    return fullData


s2Data = downloadAndSaveS2(s2Dir, bbox, 1, 10, ["visual"])

# %% Part 2: download OSM data
# Tested with http://overpass-turbo.eu/#

def nodeToPoint(node):
    coordinates = [node["lon"], node["lat"]]
    properties = {key: val for key, val in node.items() if key not in ["type", "lon", "lat"]}
    point =  {
        "type": "Feature",
        "geometry" : {
            "type": "Point",
            "coordinates": coordinates,
            },
        "properties" : properties,
    }
    return point

def nodeToPoly(node):
    coordinates = [[[e["lon"], e["lat"]] for e in node["geometry"]]]
    properties = node["tags"]
    properties["id"] = node["id"]
    return {
        "type": "Feature",
        "geometry" : {
            "type": "Polygon",
            "coordinates": coordinates,
            },
        "properties" : properties,
    }

def osmToGeojson(data, saveFreeNodes=False):
    elements = data["elements"]

    ways =  [e for e in elements if e["type"] == "way"]
    polygons = [nodeToPoly(n) for n in ways]
    features = polygons

    if saveFreeNodes:
        nodes = [e for e in elements if e["type"] == "node"]
        freeNodes = []
        for node in nodes:
            isFreeNode = True
            for way in ways:
                if node["id"] in way["nodes"]:
                    isFreeNode = False
                    break
            if isFreeNode:
                freeNodes.append(node)
        freePoints = [nodeToPoint(n) for n in freeNodes]
        features += freePoints

    json = {
        "type": "FeatureCollection",
        "features": features
    }
    return json

def downloadAndSaveOSM(saveToDirPath, bbox, getBuildings=True, getTrees=True, getWater=True):
    overpass_url = "http://overpass-api.de/api/interpreter"

    stringifiedBbox = f"{bbox[1]},{bbox[0]},{bbox[3]},{bbox[2]}"

    buildingQuery = f"""
        [out:json];     /* output in json format */
        way[building]( {stringifiedBbox} );
        (._;>;);        /* get the nodes that make up the ways  */
        out geom;
    """

    treesQuery = f"""
        [out:json];
        (
            way[landuse=forest]( {stringifiedBbox} );
            way[landuse=meadow]( {stringifiedBbox} );
            way[landuse=orchard]( {stringifiedBbox} );
        );              /* union of the above statements */
        (._;>;);
        out geom;
    """

    waterQuery = f"""
        [out:json];
        way[natural=water]( {stringifiedBbox} );
        (._;>;);
        out geom;
    """

    fullData = {}

    if getBuildings:
        response = req.get(overpass_url, params={'data': buildingQuery})
        data = response.json()
        geojson = osmToGeojson(data)
        filePath = os.path.join(saveToDirPath, 'buildings.geo.json')
        with open(filePath, 'w') as fh:
            json.dump(geojson, fh, indent=4)
        fullData["buildings"] = geojson

    if getTrees:
        response = req.get(overpass_url, params={'data': treesQuery})
        data = response.json()
        geojson = osmToGeojson(data)
        filePath = os.path.join(saveToDirPath, 'trees.geo.json')
        with open(filePath, 'w') as fh:
            json.dump(geojson, fh, indent=4)
        fullData["trees"] = geojson

    if getWater:
        response = req.get(overpass_url, params={'data': waterQuery})
        data = response.json()
        geojson = osmToGeojson(data)
        filePath = os.path.join(saveToDirPath, 'water.geo.json')
        with open(filePath, 'w') as fh:
            json.dump(geojson, fh, indent=4)
        fullData["water"] = geojson

    return fullData


osmData = downloadAndSaveOSM(osmDir, bbox)

# %%

def rasterizeGeojson(geojson, bbox, imgShape):
    """
    | a  b  c |    | scale  rot  transX |
    | d  e  f | =  | rot   scale transY |
    | 0  0  1 |    |  0      0     1    |

    Transformation
        from pixel coordinates of source
        to the coordinate system of the input shapes.
    See the transform property of dataset objects.
    """

    imgH, imgW = imgShape

    lonMin, latMin, lonMax, latMax = bbox
    scaleX = (lonMax - lonMin) / imgW
    transX = lonMin
    scaleY = -(latMax - latMin) / imgH
    transY = latMax

    # tMatrix = np.array([
    #     [scaleX, 0, transX],
    #     [0, scaleY, transY],
    #     [0, 0, 1]
    # ])
    # lon_tl, lat_tl, _ = tMatrix @ np.array([0, 0, 1])
    # lon_br, lat_br, _ = tMatrix @ np.array([imgH, imgW, 1])
    # assert(lon_tl == lonMin)
    # assert(lat_tl == latMax)
    # assert(lon_br == lonMax)
    # assert(lat_br == latMin)

    transform = riot.Affine(
        a=scaleX,  b=0,  c=transX,
        d=0,   e=scaleY,  f=transY
    )
    rasterized = riof.rasterize(
        [(f["geometry"], 1) for f in geojson["features"]],
        (imgH, imgW),
        all_touched=True,
        transform=transform
    )
    return rasterized

waterRasterized = rasterizeGeojson(osmData["water"], bbox, s2Data["S2B_32UPU_20230210_0_L2A"]["visual"].shape)

# %%
fig, axes = plt.subplots(2, 1)
axes[0].imshow(s2Data["S2B_32UPU_20230210_0_L2A"]["visual"])
axes[1].imshow(waterRasterized)
# %%

#%%

```

Where STAC/COG data is not available, you'll have to fall back to proprietary solutions. One nice library is ESA's `sentinelsat`.

```bash
conda install sentinelsat -y

# sentinelsat is a python-tool exclusively for querying sentinel meta-data
# and for downloading sentinel data from scihub.
sentinelsat \\
    --user <username> \\
    --password <password> \\
    --geometry ./aoi.json \\
    --sentinel 3 \\
    --instrument OLCI \\
    --cloud 10 \\  # max cloud cover in percent
    --download \\  # will download the actual files (not cut to AOI)
    --limit 2
```

### STAC

```ts
/**
 * assets: link to raw data
 * links: link to other STAC-data-structures
 *
 * An item might be a scene, and its assets would be a band each.
 *
 * Items are sometimes paginated as a FeatureCollection with a link = "next"
 * and a link = "previous".
 */
interface Item extends GeoJSON.Feature {
    stac_version: number;
    stac_extensions: Extension[];
    links: Link[];
    assets: Asset[];
    collection: string;
}

interface Catalog {
    stac_version: number;
    stac_extensions?: Extension[];
    id: string;
    type: "Catalog";
    description: string;
    links: Link[];
    title?: string;
}

interface Collection extends Catalog {
    license: string;
    extent: { spatial; temporal };
    providers: Privider[];
    keywords: string[];
    assets: Asset[];
    summaries?: Summary[];
}
```

_Some_ STACs implement the `search` method.
Commonly with the search method one can use the STAC-API [filter extension](https://github.com/stac-api-extensions/filter):

```
https://landsatlook.usgs.gov/stac-server/search
    ?collections=landsat-c2l1
    &bbox=9.2752,47.3835,13.0932,48.5816
    &datetime=2018-02-12T00:00:00Z/2018-03-18T12:31:12Z
    &limit=10
    &filter=eo:cloud_cover<=20
    &filter-lang=cql-text
```

_Some others_ instead implement the [query extension](https://github.com/stac-api-extensions/query) for the search method:

```python
stacUrl = "https://landsatlook.usgs.gov/stac-server"
landsatStac = psc.Client.open(stacUrl)

# %%
search = landsatStac.search(
    bbox = [9.2752, 47.3835, 13.0932, 48.5816],
    datetime = '2019-06-01/2021-06-01',
    collections=["landsat-c2l1"],
    # query works, filter doesnt. That's because Landsatlook conforms to Query, but not to ItemSearch.
    query = {
        "platform": {"eq": "LANDSAT_8"},
        "eo:cloud_cover": {"lte": 10.0}
    },
    max_items = 10
)
```

Generally, the filter-extension is recommended over the query extension ... but not yet in widespread use.

Query only works with POST requests, by the way.

### COG's

<https://medium.com/planet-stories/a-handy-introduction-to-cloud-optimized-geotiffs-1f2c9e716ec3>

**TIFF**

- head
  - first 2 bytes: byte order
    - 49 49 == little endian
  - next 2 bytes: the number 42; to indicate that this is a tiff
    - 2a 00 == 42 in little endian
  - next 4 bytes: offset to first IFD
- IFD: Image file directory
  - tiffs are divided up into pages, which are individual images within a tiff.
  - consists of:
    - first 2 bytes: nr of tags
    - next 12 bytes \* nr of tags: tag-data
    - next 4 bytes: offset to next IFD or 0 if no more IFDs.
- Tag:
  - consists of:
    - fist 2 bytes: tag id
    - next 2 bytes: tag datatype
    - next 4 bytes: nr of values
    - then: tag-data or pointer to data
- Important tags:
  - TileWidth
  - TileLength
  - TileOffsets
  - TileByteCounts

**GeoTIFF**

- Additional tags:
  - for geo-referencing

**COG**

- A GeoTiff
- With guarantees that the following file structure is maintained:
- first TIFF header
- then all IFDs (1, 2, 3, ..., last)
- then image data for the IFDs (last, ..., 3, 2, 1)
    This way we know from the header and ifd's which range in the file to request for a given tile.
    Requests are made with a HTTP `Range` header on a GET request.
    I guess that image 1 contains images 2,3,4,5; image 2 contains images 6,7,8,9; etc.

```js
import "./style.css";
import { fromUrl } from "geotiff";

// https://github.com/geotiffjs/geotiff.js/

const cogUrl = "https://oin-hotosm.s3.amazonaws.com/56f9b5a963ebf4bc00074e70/0/56f9c2d42b67227a79b4faec.tif";

// makes a Range-request for bytes 0-65.536 to get the header (range is just a guess; but surely the header fits in that many bytes.)
const tif = await fromUrl(cogUrl);

// makes a Range-request (Range: bytes=48955392-49020928) to retrieve the image-*description* for the image with index 1
const firstImageDescription = await tif.getImage(5);

// The below only work on images with affine transform
// console.log(firstImageDescription.getOrigin());
// console.log(firstImageDescription.getResolution());
// console.log(firstImageDescription.getBoundingBox());

// get actual raster data
// much bigger request (Range: bytes=49020928-65142784 = 16MB) <-- but smaller the deeper the image is in the pyramid. Returns Uint8Array[]
// const raster = await firstImageDescription.readRasters();

// get only a window out of an image
const left = 50;
const top = 10;
const right = 150;
const bottom = 60; // these coordinates are relative image pixels, not geographic
// makes several requests to fetch only the window
const data = await firstImageDescription.readRasters({ window: [left, top, right, bottom] });
console.log(data);
```

## Image preprocessing

## Image segmentation

### PCA

Sentinel 2 has 12 optical bands - that's not counting the additional water-vapor and classification-layers.
But they contain a lot of duplicated information.
We get very good segmentation when we recombine the bands to their most diagonal combinations.

```python
def pcaBandReduction(data, nrOutputBands):
    r, c, b = data.shape
    D = np.reshape(data, (r*c, b))
    Dm = D - np.mean(D)
    Cdm = Dm.transpose() @ Dm
    eVals, eVecs = np.linalg.eig(Cdm)
    P = eVecs
    Dmt = Dm @ P[:, 0:nrOutputBands]
    transformedData = np.reshape(Dmt, (r, c, nrOutputBands))
    return transformedData


reducedData = pcaBandReduction(allData, 3)
```

This yields this very nice image below. It segments objects into:

    - Pink: water
    - Yellow: building
    - Green: forrest
    - White: fields
    - Turquoise: clouds

_Weßling after PCA on the 10 biggest S2 channels_
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/pca_wessling.png" />

We can add an interpretation to the different combination-weights:
_Interpretation of the most important primary components_
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/pca_wessling_pcs.png" />

### Maximum-likelihood classifier

Maximum likelihood is probably the simplest form of supervised learning you can do.
Let's assume that we can group pixels according to their band-values in the groups field, forrest, water, and building.
We want to know the probability of a pixel being in the class 'water', given it's band-values.

$$ P(W|b_1, b_2, b_3, ...) = P(b_1, b_2, b_3 | W) \frac{P(W)}{P(b_1, b_2, b_3)} $$

The term $P(b_1, b_2, b_3 | W)$ is our likelihood. When just comparing different probabilities we may ditch the fraction $\frac{P(W)}{P(b_1, b_2, b_3)}$. As such, the simplest classification algorithm could be implemented like this:

```python
import scipy.stats._multivariate as mult


def getLikelihoodFunction(samples):
    """
        samples: n * b numpy array
            n: nr of samples
            b: nr of bands
    """
    mu = np.mean(samples, axis=0)
    dm = samples - mu
    Cov = dm.transpose() @ dm
    return mult.multivariate_normal(mu, Cov, allow_singular=True)


def maxLikelihoodClassify(labelledData, data):
    """
        labelledData: list of np.arrays
        data: np.array
        All np.arrays of size n * b
            n: nr of samples
            b: nr of bands
    """

    n, b = data.shape
    l = len(labelledData)

    llhs = [
        getLikelihoodFunction(labelSampleData)
        for labelSampleData in labelledData
    ]

    allClassifications = np.zeros((n, l), dtype=np.dtype('float32'))
    for i, llh in enumerate(llhs):
        allClassifications[:, i] = llh.pdf(data)

    maxLlhClasses = np.argmax(allClassifications, axis=1)
    return maxLlhClasses


#%%
waterSamples = allData[190:201, 275:300, :].reshape(11*25, 10)
buildingSamples = allData[170:200, 300:390, :].reshape(30*90, 10)
treesSamples = allData[50:100, 250:300, :].reshape(50*50, 10)
fieldSamples = allData[50:90, 330:360, :].reshape(40*30, 10)
dataLinear = allData.reshape(268*661, 10)


classes = maxLikelihoodClassify([waterSamples, buildingSamples, treesSamples, fieldSamples], dataLinear)
classesImg = classes.reshape(268, 661, 1)
plt.imshow(classesImg, cmap="Set3")

```

This classifies our Weßling scene quite nicely.
**Supervised classification of Weßling scene using maximum-likelihood**
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/science/max_likelihood_wessling.png">

### U-Net

The U-Net is a popular, convolutional neural net for image segmentation.

```python
#%%
import os


inputDir = "./data/images"
targetDir = "./data/annotations/trimaps"
imageSize = (160, 160)
numClasses = 3
batchSize = 32

inputImagePaths = sorted([
    os.path.join(inputDir, fName)
    for fName in os.listdir(inputDir)
    if fName.endswith(".jpg")
])

targetImagePaths = sorted([
        os.path.join(targetDir, fName)
    for fName in os.listdir(targetDir)
    if fName.endswith(".png") and not fName.startswith(".")
])

#%% Data-loader

from tensorflow import keras as k
import numpy as np
from tensorflow.keras.preprocessing.image import load_img

class OxfordPets(k.utils.Sequence):
    def __init__(self, batchSize, imgSize, inputImgPaths, targetImgPaths):
        self.batchSize = batchSize
        self.imgSize = imgSize
        self.inputImgPaths = inputImgPaths
        self.targetImgPaths = targetImgPaths

    def __len__(self):
        """ Gives tf the amount of batches available """
        return len(self.targetImgPaths) // self.batchSize

    def __getitem__(self, idx):
        """ Returns tuple (input, target) corresponding to batch #idx """
        i = idx * self.batchSize

        batchInputImgPaths = self.inputImgPaths[i : i + self.batchSize]
        batchTargetImgPaths = self.targetImgPaths[i : i + self.batchSize]

        x = np.zeros((self.batchSize, self.imgSize[0], self.imgSize[1], 3), dtype='float32')
        for j, path in enumerate(batchInputImgPaths):
            img = load_img(path, target_size=self.imgSize)
            x[j, :, :, :] = img

        y = np.zeros((self.batchSize, self.imgSize[0], self.imgSize[1], 1), dtype='uint8')
        for j, path in enumerate(batchTargetImgPaths):
            img = load_img(path, target_size=self.imgSize, color_mode='grayscale')
            y[j] = np.expand_dims(img, 2)
            # Ground truth labels are 1, 2, 3. Subtract one to make them 0, 1, 2:
            y[j] -= 1
        return x, y



#%%
from tensorflow.keras import layers


def makeModel(imgSize, numClasses):
    inputs = k.Input(shape=imgSize + (3,))

    ### First half of model: downsampling inputs

    # Entry block
    x = layers.Conv2D(32, 3, strides=2, padding="same")(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    previousBlockActivation = x

    # Blocks 1, 2, 3 are identical apart from the feature depth
    for filters in [64, 128, 256]:
        x = layers.Activation('relu')(x)
        x = layers.SeparableConv2D(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)

        x = layers.Activation('relu')(x)
        x = layers.SeparableConv2D(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)

        x = layers.MaxPooling2D(3, strides=2, padding='same')(x)

        # Project residual
        residual = layers.Conv2D(filters, 1, strides=2, padding='same')(previousBlockActivation)
        x = layers.add([x, residual])
        previousBlockActivation = x  # Setting aside next residual


    ### Second half of network: upsampling inputs

    for filters in [256, 128, 64, 32]:
        x = layers.Activation('relu')(x)
        x = layers.Conv2DTranspose(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)

        x = layers.Activation('relu')(x)
        x = layers.Conv2DTranspose(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)

        x = layers.UpSampling2D(2)(x)

        # Project residual
        residual = layers.UpSampling2D(2)(previousBlockActivation)
        residual = layers.Conv2D(filters, 1, padding='same')(residual)
        x = layers.add([x, residual])
        previousBlockActivation = x


    outputs = layers.Conv2D(numClasses, 3, activation='softmax', padding='same')(x)

    model = k.Model(inputs, outputs)
    return model


k.backend.clear_session()

model = makeModel(imageSize, numClasses)
model.summary()


#%%
import random

# Split our img paths into a training and a validation set
val_samples = 1000
random.Random(1337).shuffle(inputImagePaths)
random.Random(1337).shuffle(targetImagePaths)
trainInputImgPaths = inputImagePaths[:-val_samples]
trainTargetImgPaths = targetImagePaths[:-val_samples]
valInputImgPaths = inputImagePaths[-val_samples:]
valTargetImgPaths = targetImagePaths[-val_samples:]

# Instantiate data Sequences for each split
trainGen = OxfordPets(batchSize, imageSize, trainInputImgPaths, trainTargetImgPaths)
validGen = OxfordPets(batchSize, imageSize, valInputImgPaths, valTargetImgPaths)


#%%
# Configure the model for training.
# We use the "sparse" version of categorical_crossentropy
# because our target data is integers.
model.compile(optimizer="rmsprop", loss="sparse_categorical_crossentropy")

callbacks = [
    k.callbacks.ModelCheckpoint("oxford_segmentation.h5", save_best_only=True)
]

# Train the model, doing validation at the end of each epoch.
epochs = 15
model.fit(trainGen, epochs=epochs, validation_data=validGen, callbacks=callbacks)

#%%
valPreds = model.predict(validGen)

```

## Remote sensing for water quality

Nasa has very good documentation for this on [their website](https://earthdata.nasa.gov/learn/pathfinders/water-quality-data-pathfinder).

- Salinity: measured by SMOS (ESA) and Aquarius (NASA)
- Ocean current. Shine _really_ long wave radar on the ocean - several kilometers (thats LF, VLF and ULF radio waves, btw). At this range, waves cancel out and you get the medium height of the water to a few centimeters exact. Using Navier-Stokes, water height is related to current. Unfortunately, this really only works for surface currents.

## Remote sensing for floods

## Remote sensing for thermal radiation

Repo: <https://github.com/MichaelLangbein/thermal>

Basic phyics:

```python
#%%
import numpy as np


"""
|name                 |Formula                 |Unit         |      Notes                                                           |
|---------------------|------------------------|-------------|----------------------------------------------------------------------|
|Energy               |Q                       |[J]          |                                                                      |
|Flux                 |F = dQ/dt               |[w]          |                                                                      |
|Irradiance           |E = F/A                 |[W/m^2]      |  Flux arriving at receiver-surface. E = rho T⁴ by Boltzmann's law.   |
|                     |                        |             |  Think of *ir*radiance as *integrated* radiance                      |
|Monochr. irradiance: |Elambda = dE/dlambda    |[W/m^3]      |  E_lambda = B * PI for equally distributed radiance                  |
|Radiance             |B = dElambda / domega   |[W/m^3 angle]|  Planck's law: B(lambda, T)                                          |
"""


k   = 1.381e-23   # Boltzmann  [J/K]
h   = 6.626e-34   # Planck     [Js]
c   = 2.998e8     # lightspeed [m/s]
rho = 5.670e-8    # S.Bolzmann [W/(m²K⁴)]


"""
UV
VIS
IR: NIR, thermal
Micro
Radio
"""

# Top: high wavelength, low energy
lambda_radio_start = 1000000
lambda_radio_end   = 1  # [m]
lambda_micro_start = lambda_radio_end
lambda_micro_end   = 1e-3
lambda_ir_start    = lambda_micro_end
lambda_ir_end      = 0.75e-6
lambda_vis_start   = lambda_ir_end
lambda_vis_end     = 0.38e-6
lambda_uv_start    = lambda_vis_end
lambda_uv_end      = 10e-9
# Bottom: low wavelength, high energy


def wave_energy(wavelength):
    energy = h * c / wavelength  # [J]
    return energy


def black_body_radiance(wavelength, temperature):
    """
        Planck's law: https://en.wikipedia.org/wiki/Planck%27s_law
        wavelength: [meter]
        temperature: [°Kelvin]
    """
    factor = (2.0 * h * c**2) / (wavelength**5)
    exponent = (h * c) / (wavelength * k * temperature)
    radiance =  factor / (np.exp(exponent) - 1)
    return radiance


def black_body_temperature(wavelength, radiance):
    """
        Planck's law, solved for T
        wavelength: [meter]
        radiance: [W/m³ angle]
    """
    factor = (h * c) / k
    loged = (2 * h * c**2) / (wavelength**5 * radiance)
    return factor / (wavelength * np.log(loged + 1))



def black_body_most_intense_wavelength(temperature):
    """
        Wien's law:
        dB/dlambda = 0 -> lambda_max = 0.002898 [meter*Kelvin] /T
    """
    return 0.002898 / temperature


def black_body_irradiance(temperature):
    """
        Boltzmann's law:
        E = int_0^infty pi * I(lambda, T) dlambda = rho * T^4
    """
    return rho * np.power(temperature, 4)



# Facts about thermal:
# - can be taken by day and night (because it's being emmited, not reflected)
# - atmosphere aborbs some thermal, so only a few specific bands can be measured
# - but atmospheric *scattering* is minimal, so need not account for that
# - thermal sensors are cooled to close to absolute zero, so they don't radiate themselves
# - thermal resolution is often worse than optical, because waves have less energy
# - mirrors reflect lots of visible light, but not much thermal
# - Aluminum foil reflects thermal (emissivity: 0.08). You can place such foil behind your radiator
# - Snow does, too: that's why it doesn't melt until long in the summer (it also reflects visible, which is why it's white)
# - Stainless steel does, too (emissivity: 0.16).
# - Distilled water doesnt: emissivity 0.99. In fact, water absorbs almost all incident energy and reflects very little. Thus its high emissivity.
# - Thermal does not go through glass, but easily through plastic. Alluminum is a very good IR reflector: https://www.youtube.com/watch?v=baJtBDJDQDQ
# -
# For now my suspicion is that there is no material on the outside of buildings that reflects heat very strongly... so we can ignore this for now.
#
# https://www.isprs.org/proceedings/xxxiii/congress/part1/239_xxxiii-part1.pdf
# - 3-35 micro-meter is commonly called TIR
# - 8-14 micro-meter is barely absorbed in atmosphere
#     - especially 10-12 is good, because avoids ozone-absorption peak at 9.6
#     - below 10 absorbed by water vapor, above 12 absorbed by CO2
# - 3-5 and 17-25 are still ok
# - but 3-5 overlaps with solar reflection during day and 17-25 is not well investigated
# - pre-dawn pictures are preferred, because minimal effect of solar heating
# - pretty hard to co-register thermal, because of its poor resolution

# https://eo4society.esa.int/wp-content/uploads/2021/04/2017Land_D2T3-P_Cartalis_Thermal.pdf
# - only radiative heat-transfer travels through space, so satellites can only observe that. We can ignore convection and conduction.
# - thermal capacity c [cal / gram / °C]: ability of material to store heat. meassured as calories to heat one gram by one degree.
# - thermal conductivity K [cal / cm / sec]: rate of heat transfer. meassured as calories passing through 1cm distance in a second between two surfaces with 1°C difference
# - thermal intertia P [cal / cm² / sqrt(sec) / °C]: P = sqrt(K * c * density)
# - NIR & SWIR behaves almost like VIS in that it is mostly reflected sunlight
# - TIR is heat energy which is not reflected (except on aluminum), but radiated because of objects' own heat
# - Forrest fires are very hot, so their dominant wavelength is low and NIR or SWIR are appropriate bands
# - Ambient buildings are not, so TIR is a better band
# - Distilled water: emissivity 0.99. In fact, water absorbs almost all incident energy and reflects very little. Thus its high emissivity.
# - Sheet metal roofs reflect a lot and absorb little. Thus, metal objects as cars, planes, and metal roofs look very cold (dark) on thermal images.
# -


#%%
if __name__ == '__main__':

    #%% Exercise 1:
    # burning wood
    # mostly radiates IR (== heat)
    # but also a little VIS

    t_wood_burning = 273 + 900                                      # [K]
    irrad = black_body_irradiance(t_wood_burning)                   # 107000 [W/m²]
    lambd = black_body_most_intense_wavelength(t_wood_burning)      # 2.4e-6 m
    assert(lambda_ir_start > lambd > lambda_ir_end)                 # max wave is in IR

    radVisStart = black_body_radiance(lambda_vis_start, t_wood_burning)  # 145 [W/m³]
    radVisEnd   = black_body_radiance(lambda_vis_end,   t_wood_burning)  # 39 MIO [W/m³]
    visRange = lambda_vis_start - lambda_vis_end
    radRange = radVisEnd - radVisStart
    irradVis = np.pi * (radVisStart * visRange + 0.5 * visRange * radRange)  # poor man's integration
    assert(irradVis < irrad)



    # %% Exercise 2:
    # Irradiance from sun
    F_sun = 3.9e26  # [W]
    A_sun = 4 * np.pi * 7e8**2
    E_sun = F_sun / A_sun

    # Flux through sphere around sun is equal to flux through shpere around sun with radius all the way to earth
    # F_sun = F_sun_earth
    # E_earth_distance = E_sun A_sun / A_earth_distance
    A_earth_distance = 4 * np.pi * 1.5e11**2
    E_earth = F_sun / A_earth_distance

    # That's only 0.002% of the irradiance directly on the sun's surface.

    # %%
```

Remote sensing data analysis:

```python
#%%
import numpy as np
import json
from raster import readTif, tifGetBbox, saveToTif, makeTransform
from vectorAndRaster import rasterizeGeojson
from rasterio import CRS
from inspect import getsourcefile
from os.path import abspath, dirname
import matplotlib.pyplot as plt



def extractClouds(data, qaPixelData, noDataValue = -9999):
    """
    extracts clouds
    https://www.usgs.gov/landsat-missions/landsat-collection-2-quality-assessment-bands
    https://pages.cms.hu-berlin.de/EOL/gcg_eo/02_data_quality.html

    I think I can do this with just the L1 QA_PIXEL bands.
    Only take values where QA_PIXEL == 21824
    There should be more information in L2 QA-layers, but those are not always available
    (My suspicion is that landsat only has L2 onver the US)

    @TODO: get data for all confidence intervals, not only 21824
        code = 0
        code |= 0 << 0  # image data only
        code |= 0 << 1  # no dilated clouds
        code |= 0 << 2  # no cirrus
        code |= 0 << 3  # no cloud
        code |= 0 << 4  # no cloud shadow
        code |= 0 << 5  # no snow
        code |= 1 << 6  # clear sky
        code |= 0 << 7  # no water
    """

    dataFiltered = np.zeros(data.shape)
    dataFiltered = np.where(qaPixelData == 21824, data, noDataValue)

    return dataFiltered


def readMetaData(pathToMetadataJsonFile):
    fh = open(pathToMetadataJsonFile)
    metadata = json.load(fh)
    return metadata


def scaleBandData(rawData, bandNr, metaData):
    mult = float(metaData["LANDSAT_METADATA_FILE"]["LEVEL1_RADIOMETRIC_RESCALING"][f"RADIANCE_MULT_BAND_{bandNr}"])
    add = float(metaData["LANDSAT_METADATA_FILE"]["LEVEL1_RADIOMETRIC_RESCALING"][f"RADIANCE_ADD_BAND_{bandNr}"])
    return rawData * mult + add


def radiance2BrightnessTemperature(toaSpectralRadiance, metaData):
    # Brightness Temperature:
    # If the TOA were a black-body, it would have to have this temperature
    # so that the sensor would receive the measured radiance.
    # Obtained using Planck's law, solved for T (see `black_body_temperature`) and calibrated to sensor.

    k1ConstantBand10 = float(metaData["LANDSAT_METADATA_FILE"]["LEVEL1_THERMAL_CONSTANTS"]["K1_CONSTANT_BAND_10"])
    k2ConstantBand10 = float(metaData["LANDSAT_METADATA_FILE"]["LEVEL1_THERMAL_CONSTANTS"]["K2_CONSTANT_BAND_10"])
    toaBrightnessTemperature = k2ConstantBand10 / np.log((k1ConstantBand10 / toaSpectralRadiance) + 1.0)

    return toaBrightnessTemperature


def bt2lstSingleWindow(toaBrightnessTemperatureCelsius, emissivity, emittedRadianceWavelength = 0.000010895):
    rho = 0.01438                               # [mK]; rho = Planck * light-speed / Boltzmann
    scale = 1.0 + emittedRadianceWavelength * toaBrightnessTemperatureCelsius * np.log(emissivity)  / rho
    landSurfaceTemperature = toaBrightnessTemperatureCelsius / scale
    return landSurfaceTemperature


def bt2lstSplitWindow(toaBT10, toaBT11, emissivity10, emissivity11, cwv = None):
    """
        as per "A practical split-window algorithm for estimating LST",
        by Cen Du, Huazhong Ren, Remote Sens, 2015
        - `cwv`: column water vapor [g/cm^2]
    """

    def getCoeffsForCWV(cwv):
        # See table 1 of paper
        if cwv == None:  # Default values
            return -0.41165, 1.00522, 0.14543, -0.27297, 4.06655, -6.92512, -18.27461, 0.24468
        if 0 <= cwv <=2.25:
            return -2.78009, 1.01408, 0.15833, -0.34991, 4.04487, 3.55414, -8.88394, 0.09152
        elif 2.25 < cwv <= 3.25:
            return 11.00824, 0.95995, 0.17243, -0.28852, 7.11492, 0.42684, -6.62025, -0.06381
        elif 3.25 < cwv <= 4.25:
            return 9.62610, 0.96202, 0.13834, -0.17262, 7.87883, 5.17910, -13.26611, -0.07603
        elif 4.25 < cwv <= 5.25:
            return 0.61258, 0.99124, 0.10051, -0.09664, 7.85758, 6.86626, -15.00742, -0.01185
        elif 5.25 < cwv <= 6.3:
            return -0.34808, 0.98123, 0.05599, -0.03518, 11.96444, 9.06710, -14.74085, -0.20471
        else:
            raise Exception(f"Unknown value for column water vapor: {cwv}")


    emissivityDelta = emissivity10 - emissivity11
    emissivityMean = (emissivity10 + emissivity11) / 2.0
    b0, b1, b2, b3, b4, b5, b6, b7 = getCoeffsForCWV(cwv)

    term0 = b0

    term1 = (
            b1
          + b2 * (1 - emissivityMean) / emissivityMean
          + b3 * emissivityDelta / np.power(emissivityMean, 2)
        ) * (toaBT10 + toaBT11) / 2

    term2 = (
            b4
          + b5 * (1 - emissivityMean) / emissivityMean
          + b6 * emissivityDelta / np.power(emissivityMean, 2)
        ) * (toaBT10 - toaBT11) / 2

    term3 = b7 * np.power(toaBT10 - toaBT11, 2)

    lst = term0 + term1 + term2 + term3
    return lst


def emissivityFromNDVI(valuesNIR, valuesRed):
    # NDVI:
    # -1.0 ... 0.0 :  water
    # -0.1 ... 0.1 :  rock, sand, snow
    #  0.2 ... 0.5 :  grassland, soil, agricultural, light vegetation
    #  0.6 ... 1.0 :  deep vegetation
    # NDBI:
    # -1.0 ... 0.0 : water
    #  0.0 ... 1.0 : built up

    ndvi = (valuesNIR - valuesRed) / (valuesNIR + valuesRed)


    ## Step 2.2: Vegetation proportion
    ndviVegetation = 0.5
    ndviSoil = 0.2
    vegetationProportion = np.power((ndvi - ndviSoil) / (ndviVegetation - ndviSoil), 2)


    ## Step 2.3: Land-surface emissivity

    # Emissivity: fraction of actually emmited radiation relative to a black body. (Black bodies have maximum emissivity.)
    # Water and soil have high emissivity, asphalt has low (0.88). See https://en.wikipedia.org/wiki/Emissivity
    # @TODO: also account for asphalt, then?
    # For that you might want to use NDBI https://pro.arcgis.com/en/pro-app/latest/arcpy/spatial-analyst/ndbi.htm
    # NDBI = (SWIR - NIR) / (SWIR + NIR)
    #
    # Note that this is only thermal radiation - but things are also cooled by convection and conduction.
    # However, we only care about current temperature - and that is not influenced by any of the other heat-flows.
    # But a problem that *does* occur here is this:
    # Real objects are not black bodies - they dont absorb all incident radiation. They also reflect some of it.
    # Soil and vegetation are not very reflective - so that's good. Water is, but we can mask it out.
    # But buildings are, and we're mostly interested in those. So some very reflective buildings will send out a lot of radiation,
    # leading us to overestimate their temperature.
    # We can mitigate this, though: just look for pixels with a high whight-light value and filter those out.
    # Wait! No, we can't! Materials that reflect visible light don't neccessarily reflect thermal.

    soilEmissivity       = 0.996
    waterEmissivity      = 0.991
    vegetationEmissivity = 0.973
    surfaceRoughness     = 0.005
    landSurfaceEmissivity = np.zeros(ndvi.shape)
    # Probably water
    landSurfaceEmissivity += np.where((ndvi <= 0.0), waterEmissivity, 0)
    # Probably soil
    landSurfaceEmissivity += np.where((0.0 < ndvi) & (ndvi <= ndviSoil), soilEmissivity, 0)
    # Soil/vegetation mixture
    weightedEmissivity = vegetationEmissivity * vegetationProportion + soilEmissivity * (1.0 - vegetationProportion) + surfaceRoughness
    landSurfaceEmissivity += np.where((ndviSoil < ndvi) & (ndvi <= ndviVegetation), weightedEmissivity, 0)
    # Vegetation only
    landSurfaceEmissivity += np.where((ndviVegetation < ndvi), vegetationEmissivity, 0)

    return landSurfaceEmissivity


def emissivityFromOSM(band, bbox, shape, osmBuildings, osmVegetation):
    """
        emissivity values as per table 3 of paper
    """
    if band == 10:
        soilEmissivity       = 0.970
        waterEmissivity      = 0.992
        vegetationEmissivity = 0.973
        buildingEmissivity   = 0.973
    elif band == 11:
        soilEmissivity       = 0.971
        waterEmissivity      = 0.998
        vegetationEmissivity = 0.973
        buildingEmissivity   = 0.981
    else:
        raise Exception(f"Invalid band for emissivity: {band}")

    buildingsRaster = rasterizeGeojson(osmBuildings, bbox, shape)
    vegetationRaster = rasterizeGeojson(osmVegetation, bbox, shape)

    emissivity = np.zeros(shape)
    emissivity += soilEmissivity
    emissivity = np.where(vegetationRaster, vegetationEmissivity, emissivity)
    emissivity = np.where(buildingsRaster, buildingEmissivity, emissivity)

    return emissivity


def estimateLSTfromNDVI(valuesRed, valuesNIR, toaSpectralRadiance, metaData, noDataValue = -9999):

    """
    Convert raw data to land-surface-temperature (LST) in celsius

    Based on [Avdan & Jovanovska](https://www.researchgate.net/journal/Journal-of-Sensors-1687-7268/publication/296414003_Algorithm_for_Automated_Mapping_of_Land_Surface_Temperature_Using_LANDSAT_8_Satellite_Data/links/618456aca767a03c14f69ab7/Algorithm-for-Automated-Mapping-of-Land-Surface-Temperature-Using-LANDSAT-8-Satellite-Data.pdf?__cf_chl_rt_tk=e64hIdi4FTDBdxR5Fz0aaWift_OPNow89iJrKJxXOpo-1686654949-0-gaNycGzNEZA)
    https://www.youtube.com/watch?v=FDmYCI_xYlA
    https://cimss.ssec.wisc.edu/rss/geoss/source/RS_Fundamentals_Day1.ppt

    Raw data:
    - Band 4: Red
    - Band 5: NIR
    - Band 6: SWIR-1
    - Band 7: SWIR-2
    - Band 10: Thermal radiance
    """

    noDataMask = (toaSpectralRadiance == noDataValue) | (valuesNIR == noDataValue) | (valuesRed == noDataValue)

    # Step 1: radiance to at-sensor temperature (brightness temperature BT)
    toaBrightnessTemperatureCelsius = radiance2BrightnessTemperature(toaSpectralRadiance, metaData)
    toaBrightnessTemperatureCelsius = np.where(noDataMask, noDataValue, toaBrightnessTemperatureCelsius)

    # Step 2:
    landSurfaceEmissivity = emissivityFromNDVI(valuesNIR, valuesRed)
    landSurfaceEmissivity = np.where(noDataMask, noDataValue, landSurfaceEmissivity)

    # Step 3: land-surface-temperature
    landSurfaceTemperature = bt2lstSingleWindow(toaBrightnessTemperatureCelsius, landSurfaceEmissivity)
    landSurfaceTemperature = np.where(noDataMask, noDataValue, landSurfaceTemperature)

    return landSurfaceTemperature


def estimateLSTfromOSM(toaSpectralRadiance, metaData, osmBuildings, osmVegetation, noDataValue = -9999):
    """
        - toaSpectralRadiance: [W/m² angle]
        - emissivity:        (https://en.wikipedia.org/wiki/Emissivity)
             - soil:        0.996
             - water:       0.991
             - vegetation:  0.973
             - concrete:    0.91
             - brick:       0.90
             - asphalt:     0.88

        Steps:
            1. toaSpectralRadiance to toaBlackbodyTemperature (aka BrightnessTemperature) with Planck's law
            2. estimate emissivity from OSM data
            3. blackBodyTemperature to landSurfaceTemperature

    """

    noDataMask = (toaSpectralRadiance == noDataValue)

    # Step 1: radiance to at-sensor temperature (brightness temperature BT)
    toaBrightnessTemperatureCelsius = radiance2BrightnessTemperature(toaSpectralRadiance, metaData)
    toaBrightnessTemperatureCelsius = np.where(noDataMask, noDataValue, toaBrightnessTemperatureCelsius)

    # Step 2: estimate emissivity from OSM data
    emissivity = emissivityFromOSM(toaSpectralRadiance.shape, osmBuildings, osmVegetation)

    # Step 3: black-body-temperature to land-surface-temperature
    landSurfaceTemperature = bt2lstSingleWindow(toaBrightnessTemperatureCelsius, emissivity)
    landSurfaceTemperature = np.where(noDataMask, noDataValue, landSurfaceTemperature)

    return landSurfaceTemperature



#%%

def lstFromFile_Avdan(pathToFile, fileNameBase, aoi):

    base = f"{pathToFile}/{fileNameBase}"
    # `noDataValue` must not be np.nan, because then `==` doesn't work as expected
    noDataValue = -9999

    metaData                = readMetaData(base + "MTL.json")

    qaPixelFh               = readTif(base + "QA_PIXEL.TIF")
    valuesRedFh             = readTif(base + "B4.TIF")
    valuesNIRFh             = readTif(base + "B5.TIF")
    toaSpectralRadianceFh   = readTif(base + "B10.TIF")

    assert(qaPixelFh.res == valuesRedFh.res)
    assert(valuesRedFh.res == valuesNIRFh.res)
    assert(valuesNIRFh.res == toaSpectralRadianceFh.res)

    qaPixelAOI              = tifGetBbox(qaPixelFh, aoi)[0]
    valuesRedAOI            = tifGetBbox(valuesRedFh, aoi)[0]
    valuesNIRAOI            = tifGetBbox(valuesNIRFh, aoi)[0]
    toaSpectralRadianceAOI  = tifGetBbox(toaSpectralRadianceFh, aoi)[0]

    valuesRedNoClouds           = extractClouds(valuesRedAOI, qaPixelAOI, noDataValue)
    valuesNIRNoClouds           = extractClouds(valuesNIRAOI, qaPixelAOI, noDataValue)
    toaSpectralRadianceNoClouds = extractClouds(toaSpectralRadianceAOI, qaPixelAOI, noDataValue)

    valuesRed = valuesRedNoClouds  # no need to scale these - only used for ndvi
    valuesNIR = valuesNIRNoClouds  # no need to scale these - only used for ndvi
    toaSpectralRadiance = scaleBandData(toaSpectralRadianceNoClouds, 10, metaData)

    lst = estimateLSTfromNDVI(valuesRed, valuesNIR, toaSpectralRadiance, metaData, noDataValue)
    lstWithNan = np.where(lst == noDataValue, np.nan, lst)

    # adding projection metadata
    imgH, imgW = lst.shape
    transform = makeTransform(imgH, imgW, aoi)
    saveToTif(f"{pathToFile}/lst.tif", lst, CRS.from_epsg(4326), transform, noDataValue)
    lstTif = readTif(f"{pathToFile}/lst.tif")

    return lstWithNan, lstTif


def lstFromFile_OSM(pathToFile, fileNameBase, aoi, osmBuildings, osmVegetation):

    base = f"{pathToFile}/{fileNameBase}"
    # `noDataValue` must not be np.nan, because then `==` doesn't work as expected
    noDataValue = -9999

    metaData = readMetaData(base + "MTL.json")

    qaPixelFh               = readTif(base + "QA_PIXEL.TIF")
    toaRadiance10Fh         = readTif(base + "B10.TIF")
    toaRadiance11Fh         = readTif(base + "B11.TIF")
    assert(qaPixelFh.res == toaRadiance10Fh.res)
    assert(toaRadiance10Fh.res == toaRadiance11Fh.res)

    qaPixelAOI        = tifGetBbox(qaPixelFh, aoi)[0]
    toaRadiance10AOI  = tifGetBbox(toaRadiance10Fh, aoi)[0]
    toaRadiance11AOI  = tifGetBbox(toaRadiance11Fh, aoi)[0]

    toaRadiance10NoClouds = extractClouds(toaRadiance10AOI, qaPixelAOI, noDataValue)
    toaRadiance11NoClouds = extractClouds(toaRadiance11AOI, qaPixelAOI, noDataValue)

    # Converting raw scaled sensor-data to spectral radiance [W/m²]
    toaRadiance10 = scaleBandData(toaRadiance10NoClouds, 10, metaData)
    toaRadiance11 = scaleBandData(toaRadiance11NoClouds, 11, metaData)

    noDataMask = (toaRadiance10 == noDataValue) | (toaRadiance11 == noDataValue)

    # Step 1: radiance to at-sensor temperature (brightness temperature BT)
    toaBT10 = radiance2BrightnessTemperature(toaRadiance10, metaData)
    toaBT11 = radiance2BrightnessTemperature(toaRadiance11, metaData)
    toaBT10 = np.where(noDataMask, noDataValue, toaBT10)
    toaBT11 = np.where(noDataMask, noDataValue, toaBT11)

    # Step 2: estimate emissivity from OSM data
    emissivity10 = emissivityFromOSM(10, aoi, toaRadiance10.shape, osmBuildings, osmVegetation)
    emissivity11 = emissivityFromOSM(11, aoi, toaRadiance10.shape, osmBuildings, osmVegetation)

    # Step 3: black-body-temperature to land-surface-temperature
    landSurfaceTemperature = bt2lstSplitWindow(toaBT10, toaBT11, emissivity10, emissivity11)
    landSurfaceTemperature = np.where(noDataMask, np.nan, landSurfaceTemperature)

    # adding projection metadata
    imgH, imgW = landSurfaceTemperature.shape
    transform = makeTransform(imgH, imgW, aoi)
    saveToTif(f"{pathToFile}/lst.tif", landSurfaceTemperature, CRS.from_epsg(4326), transform, noDataValue)
    lstTif = readTif(f"{pathToFile}/lst.tif")

    return landSurfaceTemperature, lstTif



# execute

if __name__ == "__main__":
    thisFilePath = dirname(abspath(getsourcefile(lambda:0)))
    pathToFile = f"{thisFilePath}/ls8/LC08_L1TP_193026_20220803_20220806_02_T1"
    fileNameBase = "LC08_L1TP_193026_20220803_20220806_02_T1_"

    aoi = { "lonMin": 11.214, "latMin": 48.064, "lonMax": 11.338, "latMax": 48.117 }

    fh = open("./osm/buildings.geo.json")
    osmBuildings = json.load(fh)
    osmVegetation = { "type": "FeatureCollection", "features": [] }

    lst, lstFile = lstFromFile_OSM(pathToFile, fileNameBase, aoi, osmBuildings, osmVegetation)

    fig, axes = plt.subplots(1, 2)
    axes[0].imshow(lst)
    axes[1].hist(lst.flatten() - 273)


# %%
```

## Remote sensing for ecology

## SNAP

Realistically, a lot of the geo-processing is better done in a dedicated tool.
This holds especially true for L1-products: you don't want to code all the pre-processing by hand.
SAR-satellites commonly only have a L1 product, so there is always some pre-processing required.
Sentinel-1, for example, only offers L2 data over open ocean.

### Optical

- OWT: optical water type. Nice with sentinel 2 and 3.
  - GLASS-6C-Normalized: 6 spectral signatures of lake-waters: clear/low-chloro, peat/high-humic, chloro-med, chloro-high, bright/sediment-med, bright/sediment-high

### SAR

SAR-preprocessing:

- TOPSAR-Split:
- Orbit-files: updated orbit-info is available a couple of weeks after acquisition.
- Co-registration
- Coherence: removes base-noise (some objects on the ground do send off a tiny bit of radar on their own.)
- TOPSAR-deburst: moving-window averaging
- Multilook: Smoothing out speckle by looking at a location through multiple images.
- Terrain-Correction: radar is side-looking; has foreshortening etc.

SAR-analysis

- Radar vegetation index
- SAR/Urban areas/Speckle divergence

### General

Classification:

- raster/classification/supervised/Random-forrest

### Automation

For the automation of tasks, SNAP provides a [CLI](http://step.esa.int/docs/tutorials/SNAP_CommandLine_Tutorial.pdf)

## Example: Ocean categorization

### Phase 0: research

Inspiration came from finding the OWC Classifier in SNAP. The classifier knows of a few types of water and their spectral signatures.
It's designed to work with Sentinel-3 data.
Specifically I red on [STEP](https://forum.step.esa.int/t/owt-classification/11360) that it's working with OLCI-L2 atmospherically corrected water spectra.

OLCI is simply the Ocean and Land Colour Instrument - one of the sensors next to the temperature-, SAR- and humidity-sensors on Sentinel 3.

It has two operation modes: above land and above water.

In the L2-product, cloud-pixels are discarded.
The above-land-L2 product, `OL_2_LFR` (full-res) and `OL_2_LRR` (reduced-res) are already analyzed: they contain Global Vegetation Index and Terrestrial Chlorophyll Index.
The above-water-L2 product, `OL_2_WRR` and `OL_2_WFR` are also analysed: Chlorophyll-a concentration, Total suspended matter concentration, Aerosol load.
Unfortunately, however, L2-water-products are not disseminated via scihub. Instead, that data is found on eumetsat. After further research, I also found an AWS bucket [here](https://meeo-s3.s3.amazonaws.com/index.html/Ag11hncyrvjCMREETSJjwK/26HzHFuYgMiBqXBNNxcRQdYMEE2y/6GmKi5Q7qbosp2mrF6U1GoGLApWdrRAVnsTdVYL27Dzu/3dGB8bvDxnJ26DPd93LRs1dSHxcEA1MrTtEkbucmy7UEbcyWdsb).

### Phase 1: data

### Phase 2: processing

Created a graph in SNAP.

```xml
    <graph id="Graph">
    <version>1.0</version>
    <node id="Read">
      <operator>Read</operator>
      <sources/>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <file>${input}</file>
      </parameters>
    </node>
    <node id="Subset">
      <operator>Subset</operator>
      <sources>
        <sourceProduct refid="Read"/>
      </sources>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <sourceBands/>
        <region>0,0,0,0</region>
        <referenceBand/>
        <geoRegion>POLYGON ((6.779224872589111 57.80636978149414, 17.677661895751953 57.80636978149414, 17.677661895751953 51.95401382446289, 6.779224872589111 51.95401382446289, 6.779224872589111 57.80636978149414, 6.779224872589111 57.80636978149414))</geoRegion>
        <subSamplingX>1</subSamplingX>
        <subSamplingY>1</subSamplingY>
        <fullSwath>false</fullSwath>
        <tiePointGridNames/>
        <copyMetadata>true</copyMetadata>
      </parameters>
    </node>
    <node id="OWTClassification">
      <operator>OWTClassification</operator>
      <sources>
        <sourceProduct refid="Subset"/>
      </sources>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <owtType>COASTAL</owtType>
        <reflectancesPrefix>Oa</reflectancesPrefix>
        <inputReflectanceIs>RADIANCE_REFLECTANCES</inputReflectanceIs>
        <writeInputReflectances>false</writeInputReflectances>
      </parameters>
    </node>
    <node id="Write">
      <operator>Write</operator>
      <sources>
        <sourceProduct refid="OWTClassification"/>
      </sources>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <file>${output}</file>
        <formatName>GeoTIFF</formatName>
      </parameters>
    </node>
    <applicationData id="Presentation">
      <Description/>
      <node id="Read">
              <displayPosition x="27.0" y="34.0"/>
      </node>
      <node id="Subset">
        <displayPosition x="96.0" y="76.0"/>
      </node>
      <node id="OWTClassification">
        <displayPosition x="113.0" y="132.0"/>
      </node>
      <node id="Write">
              <displayPosition x="190.0" y="199.0"/>
      </node>
    </applicationData>
  </graph>
```

Can be run from command line in a [https://hub.docker.com/r/mundialis/esa-snap}{SNAP-docker-container} with

```bash
    path/to/snap/bin/gpt path/to/s3_l2_olci_wrr_graph.xml -t target.tiff -f GeoTIFF path/to/sourcefile.xml
```

Note that the `sourcefile.xml` will overwrite the `read/parameter/file` value in the graph-file.
There is a nice tutorial on [headless-SNAP](http://step.esa.int/docs/tutorials/SNAP_CommandLine_Tutorial.pdf).

Especially convenient is the fact that one can insert variables in the form `${variableName}` in place
of a parameter value. You can then replace the variableName with a value at the command line.
For example, if a parameter for a file included the variable for `\$\{myFilename\}

```xml
    <parameters>
     <file>${myFilename}</file>
    </parameters>
```

and then call gpt using

```bash
basePath=/home/michael/Desktop/code/snap
fileName=S3A_OL_2_WRR____20211103T094250_20211103T102707_20211103T121733_2657_078_136______MAR_O_NR_003.SEN3
$basePath/snap/bin/gpt $basePath/workspace/mygraph.xml \
    -t target.tiff -f GeoTIFF \
    -Pinput=$basePath/workspace/$fileName/xfdumanifest.xml \
    -Poutput=$basePath/workspace/output.tif
```
