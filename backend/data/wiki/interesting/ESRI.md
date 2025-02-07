# ESRI

# Running

Requires windows

- on linux: virutalbox
  - windows doesn't actually require a license!
- on mac:
  - using parallels: free for 2 weeks

ArcGIS itself is free for 3 weeks

# Experience builder

- <https://learn.arcgis.com/de/projects/get-started-with-arcgis-experience-builder/>
- Easily extended: based on react/typescript:
  - <https://developers.arcgis.com/experience-builder/guide/getting-started-widget/>

# Databases

- Feature class = Table with geometry
- Feature set = Dataframe in pandas
- Feature dataset = collection of feature classes sharing a CRS
  - e.g. for topology, networks etc.
- Domains: allowed values per field
  - per subtype a domain can have different domains and defaults
- Subtypes:
  - based on a single `long integer` field
  - If a row belongs to a subtype, ...
    - ... then some of its fields have reduced domains
    - ... then they're automatically styled differently
- Group values aka contingent values:
  - given field A has some value, reduce the allowed values for field B

# Services

Web-layer:
    - provides data
    - defines symbology, popups, permissions
    - "hosted" or "referenced"
      - hosted: data saved on arcgis-portal
      - referenced aka federated: data in a file-gdb, a database, or another server

Types:

- **WMS** = Map service (aka. "Map image" in portal)
  - Images drawn on demand, though cached. Multiple layers on same image.
  - WMS-T = Map service with time-config
  - Identify supported.
  - Renders multiple layers into a single image. Toggling one layer leads to another request.
- **WMTS** = Tiled map service
  - Images drawn in advance.
  - No identify.
  - Renders multiple layers into a single image. No toggling allowed.
- **WCS** = Raster service (aka "Imagery layer" in portal)
- **WFS** = Feature service
  - rendered client-side. Data transferred as protobuffer.
  - Identify naturally supported.
- **WPS** = Web-geoprocessing-tool
- Also:
  - vector-tiles
    - renders multiple layers into the same tile.
    - No identify, no legend, no querying.
  - 3D-tiles

Web-map:
    - a json-file referencing one or many web-layers

|                           | legend | identify | popups | queries | editing | live-db | drawing |
|---------------------------|--------|----------|--------|---------|---------|---------|---------|
| hosted vector-tiles       | x      | x        | x      | x       | x       | x       | client  |
| hosted image-tiles        | ✓      | ✓        | x      | x       | x       | x       | server  |
| hosted feature-service    | ✓      | ✓        | ✓      | ✓       | ✓       | x       | client  |
| federated map-service     | ✓      | ✓        | ✓      | ✓       | x       | ✓       | server  |
| federated feature-service | ✓      | ✓        | ✓      | ✓       | ✓       | ✓       | client  |

# Scripting

## Get current tool's python command

- <https://www.youtube.com/watch?v=sCkVI4VHdXo>
- (after running tool) history (might have to enable first) > tool > right click > copy python

## Create custom tool

- Videos:
  - 3 Minutes: <https://www.youtube.com/watch?v=nPUkTyDaIhg>
  - Intro: <https://www.youtube.com/watch?v=iTZytnBcagQ>
  - Testing, debugging, etc: <https://www.youtube.com/watch?v=y84onLbW-_M>
- catalog > tools > right click > new python toolbox
- select tool > edit
- (code)
  - `getParameterInfo`
    - `return [arcpy.Parameter(displayName="Input layer", datatype="GPFeatureLayer", direction="Input")]`
      - datatype: DEFeatureClass, GPFeatureLayer, Field, Double, ...
        - DE: DataElement
        - GP: GeoProcessing
  - `execute`
- refresh toobox

## R binding

- <https://www.esri.com/en-us/arcgis/products/r-arcgis-bridge/get-started>
- <https://github.com/R-ArcGIS/r-bridge>

# Vertigis Studio

- Seems to be a bunch of custom widgets on top of experience builder
