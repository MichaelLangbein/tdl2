# geoserver

-   Rest-API: https://docs.geoserver.org/latest/en/api/#1.0.0/layers.yaml
-   Python client: https://github.com/gicait/geoserver-rest

## wms-t

Pretty flaky. _Might_ work with this tutorial:
https://www.earder.com/tutorials/timeseries-with-geoserver-and-openlayers/

## adding a workspace

-   saved to data-dir
    -   changes `global.xml`.updateSequence
    -   adds `workspaces/<workspacename>/namespace.xml`
    -   adds `workspaces/<workspacename>/workspace.xml`

## uploading a geotiff

## uploading a shapefile

## uploading a style

## registering a style to a layer

-   adds to `workspaces/<workspacename>/layer.xml`
    -   changes `<defaultStyle><id>someId`
    -   adds to `<styles><style><id>someId`
-   changes `gwc-layers/LayerInfoImpl-fdsafdsafdsafdsafdsaf.xml`
    -   adds to `<availableStyles>`
    -   sets `<defaultStyle>`

## API via Python: example code

```python
#%%
from geo.Geoserver import Geoserver, GeoserverException
import os
import json
import geopandas as gpd
import rasterio as rio
import zipfile as zp
import shutil as sh
from utils.raster import saveToTif

#%%
class MyGeoserver(Geoserver):
    def registerStylesWithLayer(self, layerName, styleNames, workspace, firstStyleDefault=False):

        for styleName in styleNames:
            style = self.get_style(styleName, workspace)
            if style is None:
                raise GeoserverException(f"No such style `{styleName}` in workspace `{workspace}`")

        layer = self.get_layer(layerName, workspace)
        if firstStyleDefault:
            layer["layer"]["defaultStyle"] = {
                "name": styleNames[0],
                "href": f"{self.service_url}/rest/workspaces/{workspace}/styles/{styleNames[0]}"
            }
        if not "styles" in layer["layer"]:
            layer["layer"]["styles"] = {
                "@class": "linked-hash-set",
                "style": []
            }
        for styleName in styleNames:
            if type(layer["layer"]["styles"]["style"]) == dict:
                layer["layer"]["styles"]["style"] = [layer["layer"]["styles"]["style"]]
            layer["layer"]["styles"]["style"].append({
                "name": styleName,
                "workspace": workspace,
                "href": f"{self.service_url}/rest/workspaces/{workspace}/styles/{styleName}"
            })

        headers = {"content-type": "text/json"}
        url = "{}/rest/layers/{}:{}".format(self.service_url, workspace, layerName)

        r = self._requests(
            "put",
            url,
            data=json.dumps(layer),
            headers=headers,
        )
        if r.status_code == 200:
            return r.status_code
        else:
            raise GeoserverException(r.status_code, r.content)



def uploadAwiShapeFile(sourcePath, name, workSpaceName):
    """ Accounting for AWI's naming conventions insize shapefile """

    lastDirName = sourcePath.split("/")[-2]
    dictToSubfiles = {
        "dbf": f"{sourcePath}/{lastDirName}.dbf",
        "prj": f"{sourcePath}/{lastDirName}.prj",
        "shp": f"{sourcePath}/{lastDirName}.shp",
        "shx": f"{sourcePath}/{lastDirName}.shx"
    }
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadGfzShapeFile(sourcePath, name, workSpaceName):
    """ Takes zipped shapefile from GFZ, renames contents so that geoserver doesn't get confused, uploads that. """

    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    targetPath = f"{sourcePathRoot}/{name}_extracted"
    z = zp.ZipFile(sourcePath)
    z.extractall(targetPath)
    extractedFileNames = os.listdir(targetPath)
    for extractedName in extractedFileNames:
        fullPath = f"{targetPath}/{extractedName}"
        extension = fullPath.split(".")[-1]
        renamedFullPath = f"{targetPath}/{name}.{extension}"
        sh.move(fullPath, renamedFullPath)
    dictToSubfiles = {
        "dbf": f"{targetPath}/{name}.dbf",
        "prj": f"{targetPath}/{name}.prj",
        "shp": f"{targetPath}/{name}.shp",
        "shx": f"{targetPath}/{name}.shx"
    }
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadEqSimFile(sourcePath, name, workSpaceName):
    """ Seems that only band 1 may be contained in file for styles to work correctly """

    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    eqSimBand1Path = f"{sourcePathRoot}/eqSimGeotiffBand1.geotiff"
    fh = rio.open(sourcePath)
    band1 = fh.read(1)
    saveToTif(eqSimBand1Path, band1, fh.crs, fh.transform, None)
    geo.create_coveragestore(layer_name=name, path=eqSimBand1Path, workspace=workSpaceName)


def uploadSysrelData(sourcePath, name, workSpaceName):
    """ geoserver can't handle geojson, turn to shapefile instead """

    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    targetPath = f"{sourcePathRoot}/{name}.shp.zip"
    targetTargetPath = f"{sourcePathRoot}/{name}_extracted"
    df = gpd.read_file(sourcePath)
    df.to_file(targetPath, driver="ESRI Shapefile")
    z = zp.ZipFile(targetPath)
    z.extractall(targetTargetPath)
    extractedFileNames = os.listdir(targetTargetPath)
    for extractedName in extractedFileNames:
        fullPath = f"{targetTargetPath}/{extractedName}"
        extension = fullPath.split(".")[-1]
        renamedFullPath = f"{targetTargetPath}/{name}.{extension}"
        sh.move(fullPath, renamedFullPath)
    dictToSubfiles = {
        "dbf": f"{targetTargetPath}/{name}.dbf",
        "prj": f"{targetTargetPath}/{name}.prj",
        "shp": f"{targetTargetPath}/{name}.shp",
        "shx": f"{targetTargetPath}/{name}.shx"
    }
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadExposureData(sourcePath, name, workSpaceName):
    """ geoserver can't handle geojson, turn to shapefile instead """
    sourcePathRoot = "/".join(sourcePath.split("/")[:-1])
    targetPath = f"{sourcePathRoot}/{name}.shp.zip"
    targetTargetPath = f"{sourcePathRoot}/{name}_extracted"
    df = gpd.read_file(sourcePath)
    df["buildings"] = df["expo"].map(lambda o: sum(o["Buildings"]))
    df.to_file(targetPath, driver="ESRI Shapefile")
    z = zp.ZipFile(targetPath)
    z.extractall(targetTargetPath)
    extractedFileNames = os.listdir(targetTargetPath)
    for extractedName in extractedFileNames:
        fullPath = f"{targetTargetPath}/{extractedName}"
        extension = fullPath.split(".")[-1]
        renamedFullPath = f"{targetTargetPath}/{name}.{extension}"
        sh.move(fullPath, renamedFullPath)
    dictToSubfiles = {
        "dbf": f"{targetTargetPath}/{name}.dbf",
        "prj": f"{targetTargetPath}/{name}.prj",
        "shp": f"{targetTargetPath}/{name}.shp",
        "shx": f"{targetTargetPath}/{name}.shx"
    }
    geo.create_shp_datastore(store_name=name, path=dictToSubfiles, workspace=workSpaceName)


def uploadAwiTiff(sourcePath, name, workSpaceName):
    geo.create_coveragestore(layer_name=name, path=sourcePath, workspace=workSpaceName)


def uploadAll():


    #-------------------------------------------------------------------
    #   WORKSPACE
    #-------------------------------------------------------------------

    print("-----------------------Creating workspace-----------------------------")
    workSpaceName="riesgos"
    try:
        geo.create_workspace(workspace=workSpaceName)
    except Exception as e:
        print(e)


    #-------------------------------------------------------------------
    #   RAW DATA
    #-------------------------------------------------------------------

    gfzDataPath = "./quakeml:quakeledger/"
    awiDataPath = "./awiData"

    files = os.listdir(gfzDataPath)
    files = [f for f in files if "DS_Store" not in f]
    files = sorted(files)
    # files = [f for f in files if "90000116" in f or "90000117" in f or "90000118" in f or "90000119" in f]
    # filesRawData = [f for f in files if int(f) >= 90000120]
    # filesRawData = files
    # files = files[:5]

    for dirName in files:

        eqNr = int(dirName.replace("peru_", ""))
        if eqNr == 80000011: continue
        print(f"---------Uploading data for eq {eqNr}---------------")
        country = "peru" if "peru" in dirName else "chile"
        fileEnding = "Chile" if country == "chile" else ""

        uploadEqSimFile    ( f"{gfzDataPath}/{dirName}/eqSimGeotiffRef{fileEnding}.geotiff",   f"pga_{eqNr}",          workSpaceName )
        uploadGfzShapeFile ( f"{gfzDataPath}/{dirName}/eqDamageShapefile{fileEnding}.shp.zip", f"eqDamage_{eqNr}",     workSpaceName )
        uploadGfzShapeFile ( f"{gfzDataPath}/{dirName}/tsDamageShapefile{fileEnding}.shp.zip", f"tsDamage_{eqNr}",     workSpaceName )
        uploadSysrelData   ( f"{gfzDataPath}/{dirName}/sysRel{fileEnding}.json",               f"sysrel_{eqNr}",       workSpaceName )

        uploadAwiShapeFile ( f"{awiDataPath}/{eqNr}/{eqNr}_arrivalTimes/",         f"arrivalTimes_{eqNr}", workSpaceName )
        uploadAwiShapeFile ( f"{awiDataPath}/{eqNr}/{eqNr}_epiCenter/",            f"epiCenter_{eqNr}",    workSpaceName )

        uploadAwiTiff ( f"{awiDataPath}/{eqNr}/{eqNr}_mwh/{eqNr}_mwh.geotiff",                       f"mwh_{eqNr}",            workSpaceName )
        uploadAwiTiff ( f"{awiDataPath}/{eqNr}/{eqNr}_mwhLand_global/{eqNr}_mwhLand_global.geotiff", f"mwhLand_global_{eqNr}", workSpaceName )
        uploadAwiTiff ( f"{awiDataPath}/{eqNr}/{eqNr}_mwhLand_local/{eqNr}_mwhLand_local.geotiff",   f"mwhLand_local_{eqNr}",  workSpaceName )


    #-------------------------------------------------------------------
    #   STYLES
    #-------------------------------------------------------------------
    print("-----------------------Uploading styles----------------------------")

    geo.upload_style( path=f"./styles/gfz-prod/shakemap-pga.sld",                      name="shakemap-pga",                       workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/gfz-prod/style-damagestate-sara-plasma.sld",     name="style-damagestate-sara-plasma",      workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/gfz-prod/style-damagestate-medina-plasma.sld",   name="style-damagestate-medina-plasma",    workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/gfz-prod/style-damagestate-suppasri-plasma.sld", name="style-damagestate-suppasri-plasma",  workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/awi/Arrivaltime.sld",                            name="arrivalTimes",                       workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/awi/epiCenter.sld",                              name="epiCenter",                          workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/awi/waveHeight_old.sld",                         name="mwh",                                workspace=workSpaceName,  sld_version="1.0.0" )
    geo.upload_style( path=f"./styles/other/sysrel.sld",                               name="sysrel",                             workspace=workSpaceName,  sld_version="1.0.0" )
    for country in ["chile", "peru"]:
        geo.upload_style( path=f"./styles/gfz-prod/style-cum-loss-{country}-plasma.sld",   name=f"style-cum-loss-{country}-plasma",   workspace=workSpaceName,  sld_version="1.0.0" )


    for dirName in files:
        eqNr = int(dirName.replace("peru_", ""))
        if eqNr == 80000011: continue
        print(f"-------------Registering styles with layer {eqNr}----------------")

        geo.registerStylesWithLayer( f"pga_{eqNr}",               ["shakemap-pga"],                                                                                          workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"eqDamage_{eqNr}",          ["style-damagestate-sara-plasma", f"style-cum-loss-{country}-plasma"],                                           workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"tsDamage_{eqNr}",          [ "style-damagestate-medina-plasma", "style-damagestate-suppasri-plasma", f"style-cum-loss-{country}-plasma"],   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"arrivalTimes_{eqNr}",      ["arrivalTimes"],                                                                                          workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"epiCenter_{eqNr}",         ["epiCenter"],                                                                                             workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"mwh_{eqNr}",               ["mwh"],                                                                                                   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"mwhLand_global_{eqNr}",    ["mwh"],                                                                                                   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"mwhLand_local_{eqNr}",     ["mwh"],                                                                                                   workSpaceName, firstStyleDefault=True )
        geo.registerStylesWithLayer( f"sysrel_{eqNr}",            ["sysrel"],                                                                                                workSpaceName, firstStyleDefault=True )


    #-------------------------------------------------------------------
    #   EXPOSURE (special case, only needs to be uploaded once)
    #-------------------------------------------------------------------

    # for dirName in files:

    #     country = "peru" if "peru" in dirName else "chile"
    #     fileEnding = "Chile" if country == "chile" else ""

    #     if "80674883" in dirName or "70000011" in dirName:
    #         print("-----------------------Uploading exposure data-----------------------------")
    #         uploadExposureData(f"{gfzDataPath}/{dirName}/exposure{fileEnding}.json", f"exposure_{country}", workSpaceName)
    #         if "80674883" in dirName:
    #             geo.upload_style(path=f"./styles/other/exposure.sld", name="exposure", workspace=workSpaceName, sld_version="1.0.0")
    #         geo.registerStylesWithLayer( f"exposure_{country}", ["exposure"], workSpaceName, firstStyleDefault=True)




    #-------------------------------------------------------------------
    #   DAMAGE SUMMARIES (moving to backend/data)
    #-------------------------------------------------------------------
    # print("-----------------------Metadata to backend locally saved data---------------------")
    # for i, dirName in enumerate(files):

    #     country = "peru" if "peru" in dirName else "chile"
    #     fileEnding = "Chile" if country == "chile" else ""

    #     eqNr = int(dirName.replace("peru_", ""))

    #     sourcePath = f"{gfzDataPath}/{dirName}/eqDamageSummary{fileEnding}.json"
    #     targetPath = f"../backend/data/data/cached_data/eqDamageSummary_{eqNr}.json"
    #     sh.copy(sourcePath, targetPath)

    #     sourcePath = f"{gfzDataPath}/{dirName}/tsDamageSummary{fileEnding}.json"
    #     targetPath = f"../backend/data/data/cached_data/tsDamageSummary_{eqNr}.json"
    #     sh.copy(sourcePath, targetPath)


#%%
geoserverUrl= "http://10.104.103.71/geoserver"
geo = MyGeoserver(geoserverUrl, username="admin", password="geoserver")
uploadAll()


```

# Coding

## Configuring VsCode for Java

-   install java language pack
-   ensure $JAVA_HOME is set
-   ensure $JAVA_HOME matches your pom's `<properties><maven.compiler.source>`
-   ensure $JAVA_HOME matches VsCode's `Java: Configure Java Runtime`

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
<<<<<<< HEAD

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

https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#running-from-source
https://docs.geoserver.org/latest/en/developer/programming-guide/ows-services/implementing.html#trying-it-out

### deployment
>>>>>>> db5e0b0fb58a396b53e7750e8e18851e520f1bb3
