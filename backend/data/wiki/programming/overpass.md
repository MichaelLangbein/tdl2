# Overpass

## OSM data
- Nodes
- Ways 
- Relations
- Areas

## Finding tags
In the wiki: https://wiki.openstreetmap.org/wiki/Relation:route#Bus_routes_.28also_trolley_bus.29 

## Syntax

 - each statement works on the last set
 - sets can be assigned to with `->.setname`;
 - `_` is the default set
 - statements can be 
     - way
     - node
     - relation
     - area
  - `(node|way|rel)[]`: logically filter the statement
     - `node[key]`: get all nodes that have `key`
     - `node[key=val]`: get all nodes where `key=val`
     - `node[key1=val1][key2=val2]`: get all nodes where `key1=val1` and `key2=val2`
  - `(bbox)`: spatially filter the statement
  - You can get the union of two sets with 
    `(statement1; statement2;)->.unionSet;`
  - Recursing:
    - `n, w, r, bn, bw, br`: node, way, relation, base-node, base-way, base-relation
        - `node(w);`  select child nodes from ways in the input set
        - `node(r);`  select node members of relations in the input set
        - `way(bn);`  select parent ways for nodes in the input set
        - `way(r);`   select way members of relations in the input set
        - `rel(bn);`  select relations that have node members in the input set
        - `rel(bw);`  select relations that have way members in the input set
        - `rel(r);`   select relation members of relations in the input set
        - `rel(br);`  select parent relations from relations in the input set
    - `n, w, r, bn, bw, br` on named sets:
      - `node(w.foo);`         select child nodes from ways in the "foo" input set
      - `node(r.foo:"role");`  select node members with role "role" of relations in the "foo" input set
    - arrow-shorthand
      - If you have a set of `ways`, then `>` recurses **down to nodes and out to connected nodes** to get you the constituent nodes.
      - It takes an input set. It produces a result set. Its result set is composed of:
        - all nodes that are part of a way which appears in the input set `node(w)`; plus
        - all nodes and ways that are members of a relation which appears in the input set `(node(r); way(r);)`; plus
        - all nodes that are part of a way which appears in the result set

### Examples

```
/* preamble */
/* output in json format */
[out:json];

/*query body */

/* get all ways that are [buildings] and are (inside bbox) and assign -> them to the default set _ */
way[building]( 48.0658,11.21309,48.0916,11.30064 )->._;

/* get the union () of ... 
  - the default set (= ways)
  - and nodes that make up the ways by recursing down > to the way's constituent nodes
*/
(
  ._;
  >;
)->._;        


/* post */
out geom;

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