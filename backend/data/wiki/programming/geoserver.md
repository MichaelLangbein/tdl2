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



# Coding

## Configuring VsCode for Java
- install java language pack
- ensure $JAVA_HOME is set
- ensure $JAVA_HOME matches your pom's `<properties><maven.compiler.source>`
- ensure $JAVA_HOME matches VsCode's `Java: Configure Java Runtime`

## building and running geoserver

```bash
git clone https://github.com/geoserver/geoserver
cd geoserver/src
# -Profile:wps to also build wps module
mvn install -DskipTests -Pwps -T 2C
cd web/app
nvm jetty:run
# >> http://localhost:8080/geoserver/
```

## building a simple OWS service

https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#ows-services-implementing

### development build
https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#running-from-source
https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#trying-it-out

### deployment