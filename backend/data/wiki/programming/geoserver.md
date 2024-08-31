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

## Configuring IntelliJ
- Before trying to build in intelliJ, create one build manually: `mvn clean install -DskipTests`
- https://docs.geoserver.org/latest/en/developer/quickstart/intellij.html

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

- OWS are the most abstract kind of OGC service
- WMS, WFS, WPS etc are all instances of an OWS
- https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#ows-services-implementing

### development build

Basic idea:
- to include your custom code:
    - create a new module in `src/community`
    - add your module to `src/community/pom.xml -> profiles`
    - add your module to `web/app/pom.xml -> dependencies`
- **debugging**: run `src/web/app/src/test/java/org/geoserver/web/Start.java`
    - here you can set any breakpoints you want
- **running**: execute `cd src/web/app` and `mvn -P <your-profile-name> jetty:run`

In IntelliJ, open the `maven` pannel, and add your new custom code to the list of maven projects. 

Detailed documentation:
- https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#running-from-source
- https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#trying-it-out

### deployment

Basic idea:
- package your module to a jar: `mvn install`
- copy that jar into a running geoserver-instance: copy `target/hello-1.0.jar` into `webapps/geoserver/WEB-INF/lib`
- restart geoserver to pick up changes

Detailed documentation:
- 


## building a WPS service
https://docs.geoserver.org/latest/en/developer/programming-guide/wps-services/implementing.html#test