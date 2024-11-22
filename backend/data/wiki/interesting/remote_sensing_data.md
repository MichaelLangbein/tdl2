# Landsat and Sentinel data on AWS

- Landsat: https://aws.amazon.com/marketplace/pp/prodview-ivr4jeq6flk7u#usage
- Sentinel 2: https://aws.amazon.com/marketplace/pp/prodview-ykj5gyumkzlme

## Landsat
- Amazon:
    - In a requester-pays S3 bucket
- But still freely available through earth explorer


- Finding data: best per STAC
    - https://landsatlook.usgs.gov/stac-server/collections
- Downloading data:
    - get application token from https://ers.cr.usgs.gov/password/appgenerate
    - use in M2M API 'login-token' endpoint https://m2m.cr.usgs.gov/ 
         - oh, no, they don't cover my use-case in their Usage Expectations and Limitations.
         - also, doesn't seem to provide GeoTiff


## Requester pays buckets
- All requests to such a bucket must be authenticated