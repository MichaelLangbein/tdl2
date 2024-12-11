# ESRI

# Running

Requires windows

-   on linux: virutalbox
    -   windows doesn't actually require a license!
-   on mac:
    -   using parallels: free for 2 weeks

ArcGIS itself is free for 3 weeks

# Geoprocessing

-   building geoprocessing tools in python:
    -   Intro: https://www.youtube.com/watch?v=iTZytnBcagQ
    -   Testing, debugging, etc: https://www.youtube.com/watch?v=y84onLbW-_M

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
    -   you _could_ create a separate domain for each subtype
        -   Example:
            -   subtype "main_character" (field "character"), field "camera_angles" has domain "ANGLES_MAIN" = (close, half, threequarter)
            -   subtype "side_character" (field "character"), field "camera_angles" has domain "ANGLES_SIDE" = (threequarter, background)
    -   but it's easier to:
        -   Just have one domain "ANGLES" = (close, half, threequarter, background)
        -   Create contingent values that restrict ANGLES as a function of subtype "character"

# Vertigis Studio

-   Seems to be a bunch of custom widgets on top of experience builder
