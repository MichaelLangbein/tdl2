# Overpass

## OSM data
- Nodes
- Ways 
- Relations

## Finding tags
In the wiki: https://wiki.openstreetmap.org/wiki/Relation:route#Bus_routes_.28also_trolley_bus.29 

## Syntax

default input set `_`

### Examples

```
[out:json][timeout:25];

(
    node["amenity"="post_box"]({{bbox}});
    way["amenity"="post_box"]({{bbox}});
    relation["amenity"="post_box"]({{bbox}});
)

out body;
>;
out skel qt;

```


Get all nodes with multiple property filters (*logical-and* connected)
```
node["public_transport"="platform"]["bus"="yes"]
```


```
[out:json][timeout:25][bbox:{{bbox}}];
(
    relation["type"="route"]["route"="bus"];
);
out body;
>;
out skel qt;
```


## Python downloader

```python
    #%%
    import numpy as np
    import matplotlib.pyplot as plt
    from pystac_client import Client
    import os
    import requests as req
    from urllib.parse import urlparse
    import json
    
    #%% Part 0: directories
    thisDir = os.getcwd()
    assetDir = os.path.join(thisDir, 'assets')
    osmDir = os.path.join(assetDir, 'osm')
    os.makedirs(osmDir, exist_ok=True)
    
    
    #%% Part 1: download S2 data
    
    catalog = Client.open("https://earth-search.aws.element84.com/v0")
    bbox = [
        11.213092803955078,
        48.06580565720895,
        11.300640106201172,
        48.09161057547795
    ]
    searchResults = catalog.search(
        collections=['sentinel-s2-l2a-cogs'],
        bbox=bbox,
        max_items=4,
        query={
            "eo:cloud_cover":{"lt":10},
            "sentinel:valid_cloud_cover": {"eq": True}
        },
    )
    
    
    # Option 1: Downloading full datasets
    for item in searchResults.get_items():
        itemDir = os.path.join(assetDir, item.id)
        os.makedirs(itemDir, exist_ok=True)
        for key, val in item.assets.items():
            url = urlparse(val.href)
            fileName = os.path.basename(url.path)
            targetPath = os.path.join(itemDir, fileName)
            response = req.get(val.href)
            with open(targetPath, 'wb') as fh:
                fh.write(response.content)
    

    # Option 2: downloading only bbox-subset
    for item in searchResults.get_items():
        itemData = {}
        for key, val in item.assets.items():
            if val.href.endswith('tif'):
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
                    subset = fh.read(1, window=window)
                    item[key] = subset
    
    
    # %% Part 2: download OSM data
    # Tested with http://overpass-turbo.eu/#
    
    
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
    
    queries = {
        'buildings': buildingQuery,
        'trees': treesQuery,
        'water': waterQuery
    }
    
    
    overpass_url = "http://overpass-api.de/api/interpreter"
    for name, query in queries.items():
        response = req.get(overpass_url, params={'data': query})
        data = response.json()
        filePath = os.path.join(osmDir, name + '.json')
        with open(filePath, 'w') as fh:
            json.dump(data, fh, indent=4)
    
    
    
    # %%
```