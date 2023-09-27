# geoserver

- Rest-API: https://docs.geoserver.org/latest/en/api/#1.0.0/layers.yaml
- Python client: https://github.com/gicait/geoserver-rest 


## wms-t

Pretty flaky. *Might* work with this tutorial: 
https://www.earder.com/tutorials/timeseries-with-geoserver-and-openlayers/


## adding a workspace
- saved to data-dir
    - changes `global.xml`.updateSequence
    - adds `workspaces/<workspacename>/namespace.xml`
    - adds `workspaces/<workspacename>/workspace.xml`

## uploading a geotiff

## uploading a shapefile

## uploading a style

## registering a style to a layer
- adds to `workspaces/<workspacename>/layer.xml` 
    - changes `<defaultStyle><id>someId`
    - adds to `<styles><style><id>someId`
- changes `gwc-layers/LayerInfoImpl-fdsafdsafdsafdsafdsaf.xml`
    - adds to `<availableStyles>`
    - sets `<defaultStyle>`

