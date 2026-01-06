# ESRI

## Running

Requires windows

- on linux: virutalbox
  - windows doesn't actually require a license!
- on mac:
  - using parallels: free for 2 weeks

ArcGIS itself is free for 3 weeks.

## Performance

- Slow on loading: <https://community.esri.com/t5/python-questions/arcpy-import-is-really-slow-2-minutes/td-p/124969>
- Slow on network drive: <https://community.esri.com/t5/python-questions/arcpy-very-slow-when-using-our-new-san/td-p/1314498>

## Licensing

ArcGIS is really undignified. Every time you start ArcGIS Pro or run ArcPy (!), it will telemetry to its license server to make sure that you are allowed to use it.

## Versioning

ArcGIS Enterprise V11 (=ArcGIS Pro 3) and ArcGIS Enterprise 10 (=ArcGIS Pro 2) are a _really hard_ cut.
I once tried to rebuild a spatial index on an Enterprise 10 DB using Pro3. It _claimed_ that it had worked, but instead had failed silently.

## Infrastructure

Types of servers:

- ArcGIS Pro (=QGIS)
- GDB (=PostGIS)
- ArcGIS Server (=Geoserver)
- Portal (=Geonode, Openlayers with a lot of extras)

It should be noted that just like in OSS, Pro, Server and Portal have completely different api's. In fact, historically there was only ArcGIS Server with different data-sources. Portal came later, so its no wonder arcgis server doesn't know about portal.

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

## Experience builder

- <https://learn.arcgis.com/de/projects/get-started-with-arcgis-experience-builder/>
- Easily extended: based on react/typescript:
  - <https://developers.arcgis.com/experience-builder/guide/getting-started-widget/>

## Database

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
- **Attribute rules**:
  - like a trigger in ms-sql-server (and probably implemented as such), but defined in arcade
  - define an arcade expression that is triggered on every insert or update and validates that some input-combination is allowed.

## Metadata

Feature-classes have some associated metadata that does not neatly fit into ms sql server tables: extent, crs, description etc.
These are stored in the `sde` database:

```sql
--select * from sde.gdb_items as i;
select * from sde.SDE_layers as i;
```

### Looking up domains in db

A common example of data that ESRI stores in another table is domains. Here's how you can query that second domain table using sql:

```sql
WITH DomainLookup AS (
    SELECT
        items.Name AS DomainName,
        Codes.code.value('(Code)[1]', 'VARCHAR(50)') AS Code,
        Codes.code.value('(Name)[1]', 'VARCHAR(255)') AS Description
    FROM
        sde.GDB_ITEMS items
    INNER JOIN
        sde.GDB_ITEMTYPES itemtypes ON items.Type = itemtypes.UUID
    CROSS APPLY
        items.Definition.nodes('/GPCodedValueDomain2/CodedValues/CodedValue') AS Codes(code)
    WHERE
        itemtypes.Name = 'Coded Value Domain'
)
SELECT
    fc.*, -- Select all columns from your feature class
    DomainLookup1.Description AS YourDomainField1_Description, -- Description for the first domain-enabled field
    DomainLookup2.Description AS YourDomainField2_Description -- Description for the second domain-enabled field
    -- Add more lines here for additional domain-enabled fields
FROM
    YourFeatureClassTable fc
LEFT JOIN
    DomainLookup AS DomainLookup1 ON fc.YourDomainField1 = DomainLookup1.Code AND DomainLookup1.DomainName = 'YourDomainName1' -- Join for the first domain-enabled field
LEFT JOIN
    DomainLookup AS DomainLookup2 ON fc.YourDomainField2 = DomainLookup2.Code AND DomainLookup2.DomainName = 'YourDomainName2'; -- Join for the second domain-enabled field
    -- Add more LEFT JOIN clauses here for additional domain-enabled fields
```

## Spatial data

- MS SQL Server has a less sophisticated spatial index than PostGIS' GiST index.
- SQL Servers spatial index can fragment, but won't be re-created automatically, since this is a resource-intensive operation.
- Users are required to rebuild indices manually after large updates.
- The newer `Geography` type, as opposed to the older `Geometry`, does have a better behavior, though.

## Views

- MS SQL Server has materialized views, which are only changed when the source-table is updated. They're called "indexed views".
- But: ArcGIS support for them is poor:
  - they don't support domains
  - they are slow: ArcGIS doesn't know that the data source is a view and doesn't do any optimization for querying.
  - they require maintenance: when the source table is changed, the view breaks.
  - no indexing on views (not even on indexed views, except if they contain no subqueries and no outer joins), and indices of source tables are not effective, because ArcGIS doesn't try to query along the source-tables' indices.

## Server

- 2 Versions: one built with Java, one with .NET, both with C++ for some components
- Users GDAL and OGR for processing
- Rendering engine unknown
- Proprietary application-server, but similar to eg Tomcat
- Core framework: ESRI's proprietary ArcObjects
  - built according to Microsoft's Component Object Model (COM) model ... kind of like Spring-Beans, but defines interaction across different language binaries (mostly .NET and C++)
  - SOE: server-object-extension, adds functionality. Added as a COM to the runtime.
  - SOI: server-object-interceptor, extends existing functionality.

## Services

Web-layer:
    - provides data
    - defines symbology, popups, permissions
    - "hosted" or "referenced"
      - hosted: data saved on a hosting-server
      - referenced aka federated: data in a file-gdb, a database, or another server

### Types

- _Map service_ (aka. "Map image" in portal) (analog WMS)
  - Images drawn on demand, though cached. Multiple layers on same image.
  - WMS-T = Map service with time-config
  - Identify supported. In fact, allows a `query` request, which allows even WFS-like querying and filtering (`https://<your-image-service-url>/ImageServer/query?where=POP2000 > 350000
  &outFields=POP2000,NAME&f=json
`)
  - Renders multiple layers into a single image. Toggling one layer leads to another request.
- _Tiled map service_ (analog WMTS)
  - Images drawn in advance.
  - No identify.
  - Renders multiple layers into a single image. No toggling allowed.
- _Raster service_ (aka "Imagery layer" in portal) (analog WCS)
- _Feature service_ (analog WFS)
  - rendered client-side. Data transferred as protobuffer.
  - Identify naturally supported.
  - Querying is a bit more comfortable than in a WFS, because the query language doesn't use XML.
- _Web-geoprocessing-tool_ (analog WPS)
- vector-tiles
  - renders multiple layers into the same tile.
  - No identify, no legend, no querying.
- 3D-tiles

- hosted table
  -

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

### Hosted services and how their data is stored

<https://pro.arcgis.com/en/pro-app/latest/help/sharing/overview/understanding-reference-registered-data-and-copy-all-data.htm>

When using the "Copy all data" when publishing a service, the copy destination is dependant on the service type:

- If the service type is Feature, the service data is uploaded to the relational data store on the hosting server (a PostgreSQL database highly optimised for serving web GIS features)
  - This should be the highest performing service type.
- If the service type is Map Image, the service data is copied to the data store as a file geodatabase.
  - File data store is often S3 or AFS (azure file storage). There are often issues with accessing file gdbs on AFS, which might be bad for performance.
- Tile & Vector Tile copy the data, and then create tile caches in the tile cache data store

### URL structure

- Map image service:
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/MapServer/query?layer=<LayerName>
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/MapServer/<LayerID>/query?
- Feature service
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/FeatureServer/query?layer=<LayerName>
  - domain/<hosting|map>/rest/services/<FolderName>/<ServiceName>/FeatureServer/<LayerID>/query?
- OGC Service
  - domain/map/services/<FolderName>/<ServiceName>/WMS?service=WMS&request=GetMap

## Scripting

### Create custom tool

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

### R binding

- <https://www.esri.com/en-us/arcgis/products/r-arcgis-bridge/get-started>
- <https://github.com/R-ArcGIS/r-bridge>

## Exporting

### Portal-Group: EPX

### ArcGIS Pro Project: PPKX

## Deployment through python

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

## Vertigis Studio

- Seems to be a bunch of custom widgets on top of experience builder

### Layer ID hierarchy

- Service: looks like `https://yourportal/map/SvcName/layerId`
  - Service URL
  - LayerID
- Portal: looks like `54hjk5432gk31564326kg`
  - Each service has a PortalItemID
  - Each WebMap has a PortalItemID
- WebMap: looks like `j54k32l-layer-31`
  - Each layer (which is likely a service's layer) has a MapLayerId
  - The layer-object references back to the service: `layer.url` = ServiceUrl, `layer.itemId` = ServicePortalId, `layer.layers[nr].id` = ServiceLayerId
- VertiGIS Studio app.json: looks like `4h32j1k4l-4h3j2k-h432j1k4h31j-43h2j1k43`
  - References back to the WebMapId: `layer.$ref.id`

### App Concepts

- Custom component: `npx @vertigis/web-sdk@latest create ZoomBox`
- Custom form component: `npx @vertigis/workflow-sdk@latest create CurrentDataTable`
- **Event**
- **Command**: called from ui, returns no results. Can be async.
- **Operation**: called from ui, returns result. Can be async.

## Conterra

- Offers FME
- offers [map.apps](https://www.conterra.de/mapapps-etl), which is FME integrated into a web-gis app
