# Vector tiles

## Libraries and services

- Open Map Tiles: 
    - offers a lot of different tools, many heavily dockerized
    - not always working as advertised, though
    - advanced functionality behind paywall
    - Also offers 
        - mbtiles
        - styles
- OSM data: 
    - free: http://download.geofabrik.de/ 
- MapBox: pay per use for hosted MBTiles

## Concepts

- Schema:
    - Describes from which sources to draw input-data (OSM, OpenSeaMap, Landsat, ...)
    - ... which subset of the given sources to select, ...
    - ... and into which logical layers to put that data.
- Mbtiles:
    - A sqlite-database with metadata, together with a directory-tree of pbf files
    - Contains the results of the data-selection by a schema
- Style:
    - Tied to a given schema: you can only style what has previously been selected.
    - Instructions for frontend to render data

Because schemas, mbtiles and styles are so intimately tied together, you should get your styles from the same source where you get your mbtiles.



## Tools
- Maputnik: 
    - edit styles
- Mb-util
    - A tool to unzip an mbtile into a tree of pbf's and a metadata.json
