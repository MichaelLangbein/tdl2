# ESRI

# Running

Requires windows

-   on linux: virutalbox
    -   windows doesn't actually require a license!
-   on mac:
    -   using parallels: free for 2 weeks

ArcGIS itself is free for 3 weeks

# Concepts

-   feature class: data
-   feature layer: display styling of a feature class

# Experience builder

-   https://learn.arcgis.com/de/projects/get-started-with-arcgis-experience-builder/
-   Easily extended: based on react/typescript:
    -   https://developers.arcgis.com/experience-builder/guide/getting-started-widget/

# Databases

-   Domains: allowed values per field
    -   per subtype a domain can have different domains and defaults
-   Subtypes:
    -   based on a single `long integer` field
    -   If a row belongs to a subtype,
    -   then some of its fields have reduced domains
    -   then they're automatically styled differently
-   Group values aka contingent values:
    -   given field A has some value, reduce the allowed values for field B

# Scripting

## Get current tool's python command:

-   https://www.youtube.com/watch?v=sCkVI4VHdXo
-   (after running tool) history (might have to enable first) > tool > right click > copy python

## Create custom tool

-   Videos:
    -   3 Minutes: https://www.youtube.com/watch?v=nPUkTyDaIhg
    -   Intro: https://www.youtube.com/watch?v=iTZytnBcagQ
    -   Testing, debugging, etc: https://www.youtube.com/watch?v=y84onLbW-_M
-   catalog > tools > right click > new python toolbox
-   select tool > edit
-   (code)
    -   `getParameterInfo`
        -   `return [arcpy.Parameter(displayName="Input layer", datatype="GPFeatureLayer", direction="Input")]`
            -   datatype: DEFeatureClass, GPFeatureLayer, Field, Double, ...
                -   DE: DataElement
                -   GP: GeoProcessing
    -   `execute`
-   refresh toobox

## R binding

-   https://www.esri.com/en-us/arcgis/products/r-arcgis-bridge/get-started
-   https://github.com/R-ArcGIS/r-bridge

# Vertigis Studio

-   Seems to be a bunch of custom widgets on top of experience builder
