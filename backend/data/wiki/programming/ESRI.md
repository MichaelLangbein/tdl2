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

Types of servers:

- ArcGIS Pro (=QGIS)
- GDB (=PostGIS)
- ArcGIS Server (=Geoserver)
- Portal (=Geonode,Openlayers with a lot of extras)

It should be noted that just like in OSS, Pro, Server and Portal have completely different api's.

- Pro: `arcpy`
  - can publish services to server
- Server: REST
  - knows the PRO-projects used for services
- Portal: `arcgis.GIS`
  - can migrate portal-items between portals
  - knows what services are referenced in a web-map
  - cannot migrate services
  - doesn't know what PRO-project has created a service

A common setup:

- 1 portal
  - 4 servers:
    - 1 hosting server
      - if feature service: into an optimized, local postgres-database
        - faster than map server, but data isn't "live", because not drawn from the live enterprise-db
      - if map-image service: as file-gdb into AFS
        - tends to be very slow
    - 2 map servers
      - accessing federated data from an enterprise-gdb
    - 1 image server
      - optimized for raster data

# Experience builder

- <https://learn.arcgis.com/de/projects/get-started-with-arcgis-experience-builder/>
- Easily extended: based on react/typescript:
  - <https://developers.arcgis.com/experience-builder/guide/getting-started-widget/>

# Database

- **Feature class** = Table with geometry (plus second table in `sde.SDE_layers` and `sde.gdb_items` for metadata, like extent, crs etc)
- **Feature set** = Dataframe in pandas
- **Feature dataset** = collection of feature classes sharing a CRS
  - e.g. for topology, networks etc.
- **Domains**: allowed values per field
  - per subtype a domain can have different domains and defaults
- **Subtypes**:
  - based on a single `long integer` field
  - If a row belongs to a subtype, ...
    - ... then some of its fields have reduced domains
    - ... then they're automatically styled differently
- **Group values** aka **contingent values**:
  - given field A has some value, reduce the allowed values for field B

## Metadata

Feature-classes have some associated metadata that does not neatly fit into ms sql server tables: extent, crs, description etc.
These are stored in the `sde` database:

```sql
--select * from sde.gdb_items as i;
select * from sde.SDE_layers as i;
```

# Services

Web-layer:
    - provides data
    - defines symbology, popups, permissions
    - "hosted" or "referenced"
      - hosted: data saved on a hosting-server
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
  - Querying is a bit more comfortable than in a WFS, because the query language doesn't use XML.
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

## Updating projects per script

```python
project = arcpy.mu.ArcGISProject("CURRENT")
map = project.listMaps("_PREPROD")[0]

for layer in map.listLayers():
    if layer.supports("DATASOURCE") and layer.connectionProperties is not None and "connection_info" in layer.connectionProperties:
        print(f"updating layer {layer.name}...")
        oldProps = layer.connectionProperties
        newProps = oldProps.copy()
        newProps["connection_info"]["db_connection_properties"] = newProps["connection_info"]["db_connection_properties"].replace("prod.xxxxx", "test.xxxxx")
        newProps["connection_info"]["instance"] = newProps["connection_info"]["instance"].replace("prod.xxxxx", "test.xxxxx")
        newProps["connection_info"]["server"] = newProps["connection_info"]["server"].replace("prod.xxxxx", "test.xxxxx")
        layer.updateConnectionProperties(oldProps, newProps)
    else:
        print(f"No source data for layer {layer.name}")
```

Using the CIM: <https://pro.arcgis.com/en/pro-app/latest/arcpy/mapping/python-cim-access.htm>

```python
# Reference a project, map, and layer using arcpy.mp
p = arcpy.mp.ArcGISProject('current')
m = p.listMaps('Map')[0]
l = m.listLayers('GreatLakes')[0]

# Return the layer's CIM definition
l_cim = l.getDefinition('V3')

# Modify a few boolean properties
l_cim.showMapTips = True  #Turn on map tips for bubble tips to appear
l_cim.selectable = False  #Set the layer to not be selectable
l_cim.expanded = True     #Expand the Layer in the Contents pane

# Push the changes back to the layer object
l.setDefinition(l_cim)

# Save changes
p.save()
```

```python
import arcpy
import os


def createProdMap(projectPath, sourceDb, targetDb):

    # Get a hold of the ArcGIS Pro project
    print("loading project ...")
    arcpy.env.overwriteOutput = True
    project = arcpy.mp.ArcGISProject(projectPath)

    # add gdb to project database
    print("Checking project databases ...")
    databases = project.databases
    if not any([sourceDb in d["databasePath"] for d in databases]):
        raise Exception(f"Database {sourceDb} not found in project.")
    if not any([targetDb in d["databasePath"] for d in databases]):
        raise Exception(f"Database {targetDb} not found in project.")

    # copy map
    print("copying map ...")
    map = project.listMaps()[0]
    newMapName = map.name + "_PROD"
    if any([m.name == newMapName for m in project.listMaps()]):
        raise Exception(f"Map {newMapName} already exists in project.")
    
    copiedMap = project.copyItem(map, newMapName)
    copiedMap.updateConnectionProperties(sourceDb, targetDb)

    # Note: 
    # target gdb must already be registered in project
    # and must contain FC
    # *won't* throw an error if either of the above isn't true
    # On layer by layer basis: known bug https://community.esri.com/t5/arcgis-pro-questions/using-updateconnectionproperties-to-update-a/td-p/1371637

    print("saving project ...")
    project.save()


if __name__ == "__main__":
    sourceDb = input("Enter the name of the source database: ")
    targetDb = input("Enter the name of the target database: ")
    startDir = input("Enter the path to the directory containing the projects: ")
    if not os.path.isdir(startDir):
        raise FileNotFoundError("The directory does not exist.")
    
    for projectDir in os.listdir(startDir):
        projectPath = os.path.join(startDir, projectDir)
        if not os.path.isdir(projectPath):
            continue
        aprxFiles = [f for f in os.listdir(projectPath) if f.endswith(".aprx")]
        if len(aprxFiles) <= 0:
            continue
        projectPath = os.path.join(projectPath, aprxFiles[0])
        if not os.path.isfile(projectPath):
            continue

        createProdMap(projectPath, sourceDb, targetDb)

print("Done.")
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

# Exporting

## Portal-Group: EPX

## ArcGIS Pro Project: PPKX

# Deployment through python

1. authenticate
2. publish my custom views from the test-db to the prod-db
3. update my services to use the prod-db instead of the test-db, and make them available in the prod-portal instead of the test-portal
4. update my map to use the prod-services instead of the test-services, and make it available in the prod-portal instead of the test-portal

```python
import json
import time
from datetime import datetime
from pprint import pprint
from arcgis.gis import GIS




"""
https://www.youtube.com/watch?v=c2jFQbjNmkc

Q&A:

why some items dont clone over:
    developers / "Cloning and Troubleshooting Complex Items"
    dashboards, storymaps dont allow easy cloning
    how about non-hosted services?

backup-method vs clone-items-method:
    backup-method persists data on executing machine.

image-services:
    don't clone.
    need to be re-published.
    maybe through agio assistant?

referenced feature-layers:
    
"""


def portalLogin(
        portal_url,
        client_id   # <-- this is the "App ID" of your new empty app
    ):
    """
    First create an empty app in your portal like described in the documentation:
    https://developers.arcgis.com/python/latest/guide/working-with-different-authentication-schemes/#user-authentication-with-oauth-20
    In the app's details-page, look for and copy the "App ID". 
    """ 

    portalEndpoint = GIS(portal_url, client_id=client_id , use_gen_token=True, verify_cert=False)

    return portalEndpoint




def simpleCloneItems(sourcePortal, targetPortal, queryString, itemType):
    """
        queryString: f"title: * Power Plants AND owner:{sourcePortal.users.me.username}"
        itemType:
        search_existing_items:
            Most items have a `typeKeyword` property.
            Cloned items have one formatted like `source-<itemId>`
        copy_data:
            If False, then FeatureService-Def will be moved to target, but actual Feature-Data will remain on Source.
        search_existing_items:
            If this doesn't work, try the item_mapping parameter.
    """
    
    items = sourcePortal.content.search(query=queryString, item_type=itemType)
    clonedItems = targetPortal.content.clone_items(items,
                                                   copy_data=True, copy_global_ids=True, search_existing_items=True)
    return items, clonedItems




def groupMigrate(source, target, sourceGroupName, targetGroupName):
    """
        preserves item-ids
    """
    
    group = source.groups.search(sourceGroupName)[0]
    groupMig = group.migration
    epkItem = groupMig.create(future=False)
    # groupMig.inspect(epk)["results"]
    
    dateString = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    fileName = f"{groupName}_{dateString}.epk"
    epkFile = epkItem.download(save_path=r".\tmp", file_name=fileName)

    targetEpkItem = target.content.add(
        item_properties={
            "title": fileName,
            "tags": "CI/CD, auto-deploy",
            "type": "Export Package"
        },
        data=epkFile
    )

    targetGroupSearchResults = target.groups.search(targetGroupName)
    if len(targetGroupSearchResults) == 0:
        targetGroup = target.groups.create(title=groupName, tags="Deployment", access="org")
    else:
        targetGroup = targetGroupSearchResults[0]
    targetGroupMig = targetGroup.migration
    migrationResult = targetGroupMig.load(epk_item=targetEpkItem, future=False)



sourcePortalUrl = "..."
sourcePortalCID = "..."
targetPortalUrl = "..."
targetPortalCID = "..."

sp = portalLogin(sourcePortalUrl, sourcePortalCID)
tp = portalLogin(targetPortalUrl, targetPortalCID)

groupMigrate(sp, tp, "MigrateMe", "MigrateMe")


# TODO: prove that you can copy a feature layer
#    create a demo feature layer
# TODO: prove that you can copy a map
#    create a demo map
# TODO: verify that ids, groups, and map-feature-layer relations are preserved
```

### Using LDAP or ActiveDirectory

```python
from arcgis.gis import GIS

# using ActiveDirectory
usernameAD = "SOMEDOMAIN\username"  # Windows NT LAN Manager (NTLM) format
portalAd = GIS("https://yourportal.com/portal", username=usernameAD, password="MyPassword")

# using LDAP
usernameLdap = "username@domain.com"  # Distinguished Name (DN) format
portalLdap = GIS("https://yourportal.com/portal", username=usernameLdap, password="MyPassword")
```

# Vertigis Studio

- Seems to be a bunch of custom widgets on top of experience builder

# Contera

- Offers FME
- offers [map.apps](https://www.conterra.de/mapapps-etl), which is FME integrated into a web-gis app
