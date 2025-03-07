# ESRI

# Running

Requires windows

- on linux: virutalbox
  - windows doesn't actually require a license!
- on mac:
  - using parallels: free for 2 weeks

ArcGIS itself is free for 3 weeks.

# Licensing

ArcGIS is really undignified. Every time you start ArcGIS Pro or run ArcPy (!), it will telemetry to its license server to make sure that you are allowed to use it.

# Infrastructure

- 1 portal
  - 4 servers:
    - 1 hosting server
      - all data copied locally into an optimized, local postgres-database
      - faster than map server, but data isn't "live", because not drawn from the live enterprise-db
    - 2 map servers
      - accessing federated data from an enterprise-gdb
    - 1 image server
      - optimized for raster data

# Experience builder

- <https://learn.arcgis.com/de/projects/get-started-with-arcgis-experience-builder/>
- Easily extended: based on react/typescript:
  - <https://developers.arcgis.com/experience-builder/guide/getting-started-widget/>

# Database

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

## Types

- **WMS** = Map service (aka. "Map image" in portal)
  - Images drawn on demand, though cached. Multiple layers on same image.
  - WMS-T = Map service with time-config
  - Identify supported. In fact, allows a `query` request, which allows even WFS-like querying and filtering (`https://<your-image-service-url>/ImageServer/query?where=POP2000 > 350000
  &outFields=POP2000,NAME&f=json
`)
  - Renders multiple layers into a single image. Toggling one layer leads to another request.
- **WMTS** = Tiled map service
  - Images drawn in advance.
  - No identify.
  - Renders multiple layers into a single image. No toggling allowed.
- **WCS** = Raster service (aka "Imagery layer" in portal)
- **WFS** = Feature service
  - rendered client-side. Data transferred as protobuffer.
  - Identify naturally supported.
  - Querying is a bit more comfortable than in a WFS, because the query language doesnt use XML.
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

Example of a query on a map-image-service:

```
https://gis.suedlink.com/map/rest/services/TNB_WebGIS/TNB_Immissionsschutz/MapServer/1/query
?f=json
&spatialRel=esriSpatialRelIntersects
&where=1%3D1               // <-- attributes must be configured such that they are allowed to be queried, otherwise queries only work on those attributes required for rendering.
&token=wlYobgXhNDowB92JxsYiC0tOX4iErf-UV408hS477dOS9H_9gex8VHhTFUnvbKVBrvm1QDw2fNfTDxXgfRUuE08_VOPj1BoOeMAAhdd_m9W9y_odMTbe1rZhrLUUU8SqCWzB8Zb7cL5bbVQKDLmbvKXKmFA18rkcK-d2FOF6V4C5g8jbu49TH0vyzM-Kwwa3j5j0PsFWLjTqUmfnGALnQsAWflYwM6oTrJBtyFUuTxQ906oPUSoQDDPw2goLtkZX8Bl8Awa_yn2ymzrda7-7JYNv99ujO2TjkqeQhkOwUjrGJ0IGXUuWnn79eSIpeC4-vClHifCT_n5QdAK6ssfkmA..
```

## Hosted services and how their data is stored

<https://pro.arcgis.com/en/pro-app/latest/help/sharing/overview/understanding-reference-registered-data-and-copy-all-data.htm>

When using the "Copy all data" when publishing a service, the copy destination is dependant on the service type:

- If the service type is Feature, the service data is uploaded to the relational data store on the hosting server (a PostgreSQL database highly optimised for serving web GIS features)
  - This should be the highest performing service type.
- If the service type is Map Image, the service data is copied to the data store as a file geodatabase.
  - File data store is often S3 or AFS (azure file storage). There are often issues with accessing file gdbs on AFS, which might be bad for performance.
- Tile & Vector Tile copy the data, and then create tile caches in the tile cache data store

## URL structure

- Map image service:
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/MapServer/query?layer=<LayerName>
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/MapServer/<LayerID>/query?
- Feature service
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/FeatureServer/query?layer=<LayerName>
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/FeatureServer/<LayerID>/query?
- OGC Service
  - domain/map/services/<FolderName>/<ServiceName>/WMS?service=WMS&request=GetMap

# Scripting

## Model builder

## Example script

```python
#%%
import os
import arcpy as ap



# %% getting access to the project db

currentPath = os.path.dirname(__file__)
gdbPath = os.path.abspath(
    os.path.join(currentPath, "..", "Data", "SanJuan.gdb"))
ap.env.workspace = gdbPath
ap.env.overwriteOutput = True
projPath = os.path.abspath(
    os.path.join(currentPath, "..", "Data", "PythonGP.aprx"))


#%% exploring the project

# list FCs and tables
fcs = ap.ListFeatureClasses()
for fc in fcs:
    desc = ap.Describe(fc)
    print(f"FeatureClass: {fc}, Type: {desc.shapeType}")

tables = ap.ListTables()
for table in tables:
    print(f"Table: {table}")

# Get the attribute table of the layer "Roads"
roads_fields = ap.ListFields("Roads")
for field in roads_fields:
    print(f"Field: {field.name}, Type: {field.type}")

# SearchCursor: read only. Alternatively: UpdateCursor, InsertCursor
# Always use `with` for cursors ... otherwise you might not delete locks on the table
with ap.da.SearchCursor("Roads", [field.name for field in roads_fields]) as cursor:
    for row in cursor:
        print(row)


aprx = ap.mp.ArcGISProject(projPath)
maps = aprx.listMaps()
for map in maps:
    print(f"Map: {map.name}")

    for layer in map.listLayers():
        print(f"Layer: {layer.name}")


# %% Joining table to feature class

"""
help(ap.JoinField_management)
-->
JoinField_management(
    in_data, in_field, join_table, join_field, 
    {fields;fields...}, 
    {Select transfer fields | Use field mapping}, 
    {field_mapping}, 
    {Do not add indexes | Add an attribute index for fields that do not have an existing index | Replace indexes for all fields}
)'
"""

roads_layer = "Roads"
in_field = "ROUTE_TYPE"
join_table = "BufferDistance"
join_field = "ROUTE_TYPE"

ap.management.JoinField(roads_layer, in_field, join_table, join_field)   

# %% Buffer the roads

in_features = roads_layer
out_feature_class = "Roads_Buffered"
buffer_distance_or_field = "DISTANCE"
results = ap.analysis.Buffer(
    in_features = in_features,
    out_feature_class = out_feature_class,
    buffer_distance_or_field = buffer_distance_or_field
)
print(results.getAllMessages())

# %%

```

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

# Deployment through python

1. authenticate
2. publish my custom views from the test-db to the prod-db
3. update my services to use the prod-db instead of the test-db, and make them available in the prod-portal instead of the test-portal
4. update my map to use the prod-services instead of the test-services, and make it available in the prod-portal instead of the test-portal

## 1. Authentication

### Using OAuth2

```python
#%% 
from arcgis.gis import GIS

"""
First create an empty app in your portal like described in the documentation:
https://developers.arcgis.com/python/latest/guide/working-with-different-authentication-schemes/#user-authentication-with-oauth-20
In the app's details-page, look for and copy the "App ID". 
""" 

portal_url = "https://gistest.suedlink.com/portal"
client_id = "ZIbfACnBPCbEHLkK"  # <-- this is the "App ID" of your new empty app

try:
    portalEndpoint = GIS(portal_url, client_id=client_id , use_gen_token=True, verify_cert=False)
    print(f"Successfully logged in as: {portalEndpoint.properties.user.username} on {portalEndpoint.properties.name} with token: {portalEndpoint.session.auth.token}")
 
except Exception as e:
        print(f"Failed to log in: {e}")

```

### Using LDAP or ActiveDirectory

```python
from arcgis.gis import GIS

# using ActiveDirectory
usernameAD = "SOMEDOMAIN\username"  # Windows NT LAN Manager (NTLM) format
portalAd = GIS("https://gistest.suedlink.com/portal", username=usernameAD, password="MyPassword")

# using LDAP
usernameLdap = "username@domain.com"  # Distinguished Name (DN) format
portalLdap = GIS("https://gistest.suedlink.com/portal", username=usernameLdap, password="MyPassword")
```

# Vertigis Studio

- Seems to be a bunch of custom widgets on top of experience builder
