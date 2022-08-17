# Cesium

## Cesium vs Threejs

| Pro | Con      |
|-----|----------|
| Terrain, Textures, OSM built in | Not downloadable to local |
| GeoJSON support                 |



## Tile- & Terrain-Server
sudo docker image build --tag=soxueren/cesium-server .
sudo docker container run 
-p 8000:8000  
-v /home/michael/Desktop/code/js/cesium2/terrainGeneration/data/output:/data/terrain  
-v /home/michael/Desktop/code/js/cesium2/tileGeneration/output/:/data/tilesets  
-d  
--name=cesium-server  
soxueren/cesium-server


## Terrain generation
All documentation from [github](https://github.com/tum-gis/cesium-terrain-builder-docker)


### Step 0: Download data
From https://dwtkns.com/srtm30m/ copied into data/input


### Step 1: move into docker container

        docker run -it --name ctb -v "/home/michael/Desktop/code/js/cesium2/terrainGeneration/data":"/data" tumgis/ctb-quantized-mesh

### Step 2: Create virtual dataset 
(only if more than one file)
Create a GDAL virtual dataset

        cd /data/input
        gdalbuildvrt data.vrt *.hgt

### Step 3: Create cesium terrain files

        cd /data
        ctb-tile -f Mesh -C -N -o output input/data.vrt

### Step 4: Create cesium layer description file

        ctb-tile -f Mesh -C -N -l -o output input/data.vrt


## Tile generation
gltf-pipeline -i scene.gltf -b