
# Remote sensing

It's not all that easy to find good media about the remote sensing field. I do however enjoy the snippy tone of [http://blog.imagico.de/](http://blog.imagico.de/).




## Lingo

Elevation
- DSM: Digital surface model - includes buildings and trees. Commonly from LIDAR.
- DEM: Digital elevation model - ground level; from DSM, with buildings and trees removed, or Radar or photogrammetry.
- DTM: Digital terrain models - either synonym to DEM or a vectorized DEM with additional features where buildings and trees are
- TIN: Triangular irregular network



## Electromagnetic radiation
Satellites all work the same way: they are flying machines that carry a camera. The camera has one or more sensors, each of which can observe some part of the electromagnetic spectrum.
Radar satellites have their own 'light' source: they actively send out radio-radiation and collect the reflection.

- Optical
- Radar: not hindered by clouds. Good for flood-detection
- Microwave: good for atmospheric observation



*Frequencies capable of penetrating the atmosphere*
<img src="../assets/science/rs_atmospheric_absorption.png" />


*Guide to the selection of frequencies in VIS \& NIR range*
<img src="../assets/science/rs_vis_nir_curves.png" />


*Example of important groups in VIS \& NIR*
<img width="30%" src="../assets/science/rs_vis_nir_groups.png" />


## Orbital periods and acquisition
Satellites usually have an orbital period of 1 - 2 hours. They revisit the same spot on earth every 2-3 weeks.
(This example data is taken from landsat: an orbit takes 99 minutes, and it visits the same spot every 16 days.
Note that landsat always stays on the sunny side of earth - most visible-light satellites do this.)
Commonly, satellite series have offset periods so one machine of the same series visits the same spot every nth of a full orbital period.
However, some satellites can narrow or broaden their sensors, so even if a satellite visits the same spot again, it might not make the same snapshot again.
To handle the high demand and low availability of satellite images, acquisition plans are being made.
Usually, these take into account seasonal effects, water vapor, and also a ranking of requests from different scientific institutions.


Note that not all satellites can change their focus. Sentinel-5P, for example, does *sweep broom staring*, i.e. always looks down at exactly the same angle and swath width.
Consequently, there are no acquisition plans for Sentinel-5P.


- Lower earth orbit: 160-1000 km above sea level. ISS is at 600 km, OCO2 at 700 km. ~15.000 km/h for OCO. 
    - A-track: a.k.a. the afternoon track. Passes equator from south at 14:00.
- Geo-stationary: 30.000 km above sea level. For communication- and relay-satellites. ~ 10.000 km/h.
- Moon: 300.000 km



## Radar
Radar is a little different from the optical VIS / NIR satellites.
The earth does not emit any radar-radiation (naturally, only a few pulsars do). So SAR-satellites need to actively send out signals.
On the bright side (haha) that means that SAR can be used at night. Also, with radio waves being longer than optical waves, they can penetrate clouds.
SAR-satellites often only carry a single antenna. This means that the band-centered strategies of PCA and max-llh-classification don't work there, since there is only one band.

- Earth does not emit any radar (in fact, only lightning and some pulsars do emit radar naturally). So, radar must be an active sensor. Advantage: works at night.
- The higher the wavelength, the better the penetration power: L\&P bands go through foliage and into the topsoil.
- The lower the wavelength, the better the resolution.
- Two data-products: amplitude and phase.
- Side-facing. This way water can specularly reflect radar and appear perfectly black in image.


Radar has some really weird properties.

Distance traveled by ray 1 = $d_1$
Distance traveled by ray 2 = $d_2 = d_1 + \delta $
$$d_2 = d_1 + \delta$$
$$t1 = 2 d_1 / c$$
$$t2 = 2 (d_1 + \delta) / c$$
Pulse duration $\tau$. Two points can only be differentiated if their beams return at least $\tau$ seconds apart.
$$t_2 - t_1 = \tau $$
$$ \tau = 2 \delta / c$$
Minimum slant distance between the two points:
$$\delta = \tau c / 2$$
Minimum ground distance between the two points:
$$r = \tau c / (2 \sin(\theta) )$$

Thus:

- The resolution is only a function of the incidence angle $\theta$ and the pulse duration $\tau$ - not of the platform altitude. A satellite gets an equally good resolution as an aircraft does.
- Resolution gets *better* the higher the incidence angle $\theta$. This is why radar is always side-facing. There is no spatial resolution directly under the platform. Opposite to optical sensors, resolution gets better the further out the observation.
- 


**Polarization**: EM waves have a plane. In fact, there is a plane for the electrical wave and a perpendicular one for the magnetic field.
If a horizontally polarized light beam hits my eye, I'd only see a horizontal line. Non-polarized light consists of many waves with all possible angles. If they hit my eye, I's see a circle, not a line.
A radar antenna emits electric waves either vertically (V) or horizontally (H). The scattered signal *might} have changed that polarization. Some antennas can pick up both V and H and differentiate between the two.
Antenna designs:

- receive H, Transmit H: HH. Strong signal from horizontal, non-voluminous surfaces. Streets.
- receive H, Transmit V: HV. Strong signal from horizontal, voluminous surfaces. Rough fields, low shrubbery
- VH. Strong signal from vertical, voluminous surfaces. High trees
- VV. Strong signal from vertical, non-voluminous surfaces. Walls.

Note that direct sunlight is unpolarized - the sun sends out waves in all possible orientations.
But light can fall on objects that align polarization. Pretty much any time light reflects from something, it gets (at least partially, that is, elliptically) polarized.
The more refraction, the more likely a change in polarization. Consequently, polarization change happens much when there is volume-scattering (branches, dry soil, ...)
The direction of polarization is often parallel to the surface.



## Important satellites

**Landsat** program is the longest-running enterprise for acquisition of satellite imagery of Earth.
On July 23, 1972 the Earth Resources Technology Satellite was launched. This was eventually renamed to Landsat. 
The most recent, Landsat 8, was launched on February 11, 2013. The instruments on the Landsat satellites have acquired millions of images.
The images, archived in the United States and at Landsat receiving stations around the world,
 can be viewed through the U.S. Geological Survey (USGS) 'EarthExplorer' website.
 Landsat 7 data has eight spectral bands with spatial resolutions ranging from 15 to 60 meters;
 the temporal resolution is 16 days.[2] Landsat images are usually divided into scenes for easy downloading.
 Each Landsat scene is about 115 miles long and 115 miles wide (or 100 nautical miles long and 100 nautical miles wide, or 185 kilometers long and 185 kilometers wide).


**Modis on Aqua and Terra** (NASA) is a spectro-radiometer. It measures 36 bands.

**ENVISAT** was ESA's environmental satellite. First satellite to measure CO2. Huge: large as a bus. 
Launched 2002, scheduled until 2007, eventually lost contact 2012. Didn't manage to go to graveyard orbit - still hangs around at 800km.
Passes two objects a year > 10kg within 200m. Danger of causing Kessler syndrome.
Since replaced by the Sentinel-series.

**Sentinel** ESA is currently developing seven missions under the Sentinel programme.
The Sentinel missions include radar and super-spectral imaging for land, ocean and atmospheric monitoring.
Each Sentinel mission is based on a constellation of two satellites to fulfill and revisit the coverage requirements
for each mission, providing robust datasets for all Copernicus services.


## Important service providers

**Copernicus** is a EU program that makes satellite data freely available for the public. It financed ENVISAT and then the Sentinel program.
It also now made a contract with Finnish mini-SAR-company Iceye, publishing their data to the public for free.
Also, the remote-sensing field is only going to be commercially viable if we provide higher level products than the satellites alone. 
Copernicus delivers *thematic* maps that do *not* show the underlying satellite data on their [Copernicus services](https://www.copernicus.eu/en) pages.
This may well be the most valuable source of data for remote-sensing based products.
Some good examples include: 

- [CO2 timeseries](https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-carbon-dioxide?tab=overview)
- ...



**Sentinelhub** [homepage](https://www.sentinel-hub.com/), [eo-browser](https://www.sentinel-hub.com/explore/eobrowser/) is intended as a more user-oriented tool.
It facilitates Google-Earth-esque processing in the backend, having you only download the end-product. Nice features include: 3d-view, creation of timeseries-gifs, pins that can be aggregated to a story.
The webpage has a somewhat redacted selection of products - for example, I couldn't find S3-water data.
But it also offers a set of python tools. Documentation can be found [here](https://sentinelhub-py.readthedocs.io/en/latest/examples/process_request.html#Example-5:-Other-Data-Collections).
All data is listed [here](https://www.sentinel-hub.com/explore/data/). 
Overall, before you work on some processing on your own, it is a very good idea to check if sentinel-hub already has the data, or at least parts of it.

**Scihub** ([here](https://scihub.copernicus.eu/)) is the open access hub for sentinel data.

**Eumetsat** contains Sentinel-3 L2 water products [here](https://coda.eumetsat.int/#/home).
For some reason, people have decided that S3-L2-W should be hosted on another page than all the other Sentinel products.


**CHIRPS** is ...

**EODC**: [Earth Observation Data Center for Water Resources Monitoring](https://www.eodc.eu/)

**Eurac**: [Eurac](http://www.eurac.edu) is a private research company ...

**Google Earth Engine** provides ...

**NASA's ECS** (Earth observation center Core System) is a vast catalogue of ...

**Kaggle** (see [here](https://www.kaggle.com/search?q=sentinel) ) is a useful source for ready-labeled datasets for training.

**Amazon S3** keeps a lot of satellite data as COGs. 
- Sentinel 1 from [here](https://registry.opendata.aws/sentinel-1/) 
    - The above page does not seem to conform to STAC 1.0. Maybe [the US-specific data](https://raw.githubusercontent.com/scottyhq/sentinel1-rtc-stac/main/13SBD/catalog.json) is a bit better.
        
- Sentinel 2 from [here](https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/2020/S2A_36QWD_20200701_0_L2A/TCI.tif)
- Sentinel3 data from [here](https://github.com/Sentinel-5P/data-on-s3/blob/master/DocsForAws/Sentinel3Description.md)                 
- Landsat from [here](https://landsat-pds.s3.amazonaws.com/c1/L8/139/045/LC08_L1TP_139045_20170304_20170316_01_T1/LC08_L1TP_139045_20170304_20170316_01_T1)

The coverage is still pretty inconsistent and spotty. It makes sense to fall back to updated, curated lists like [this one](https://github.com/Fernerkundung/awesome-sentinel).


## Obtaining data
In geo-science, actually obtaining data is an art... unfortunately. At least, OSM and AWS+STAC make things a little more standardized.

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
            "sentinel:valid_cloud_cover": {"eq": True
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
        itemData = {
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


Where STAC/COG data is not available, you'll have to fall back to proprietary solutions. One nice library is ESA's `sentinelsat`.
```bash
conda install sentinelsat -y

# sentinelsat is a python-tool exclusively for querying sentinel meta-data 
# and for downloading sentinel data from scihub.
sentinelsat \\
    --user <username> \\
    --password <password> \\
    --geometry ./aoi.json \\
    --sentinel 3 \\
    --instrument OLCI \\
    --cloud 10 \\  # max cloud cover in percent
    --download \\  # will download the actual files (not cut to AOI)
    --limit 2
```


## Image preprocessing

## Image segmentation

### PCA
Sentinel 2 has 12 optical bands - that's not counting the additional water-vapor and classification-layers.
But they contain a lot of duplicated information.
We get very good segmentation when we recombine the bands to their most diagonal combinations.

```python
def pcaBandReduction(data, nrOutputBands):
    r, c, b = data.shape
    D = np.reshape(data, (r*c, b))
    Dm = D - np.mean(D)
    Cdm = Dm.transpose() @ Dm
    eVals, eVecs = np.linalg.eig(Cdm)
    P = eVecs
    Dmt = Dm @ P[:, 0:nrOutputBands]
    transformedData = np.reshape(Dmt, (r, c, nrOutputBands))
    return transformedData


reducedData = pcaBandReduction(allData, 3)
```

This yields this very nice image below. It segments  objects into: 

    - Pink: water
    - Yellow: building
    - Green: forrest
    - White: fields
    - Turquoise: clouds


*Weßling after PCA on the 10 biggest S2 channels*
<img src="../assets/science/pca_wessling.png" />


We can add an interpretation to the different combination-weights:
*Interpretation of the most important primary components*
<img src="../assets/science/pca_wessling_pcs.png" />




### Maximum-likelihood classifier
Maximum likelihood is probably the simplest form of supervised learning you can do.
Let's assume that we can group pixels according to their band-values in the groups field, forrest, water, and building.
We want to know the probability of a pixel being in the class 'water', given it's band-values.

$$ P(W|b_1, b_2, b_3, ...) = P(b_1, b_2, b_3 | W) \frac{P(W)}{P(b_1, b_2, b_3)} $$

The term $P(b_1, b_2, b_3 | W)$ is our likelihood. When just comparing different probabilities we may ditch the fraction $\frac{P(W)}{P(b_1, b_2, b_3)}$. As such, the simplest classification algorithm could be implemented like this:

```python
import scipy.stats._multivariate as mult


def getLikelihoodFunction(samples):
    """
        samples: n * b numpy array
            n: nr of samples
            b: nr of bands
    """
    mu = np.mean(samples, axis=0)
    dm = samples - mu
    Cov = dm.transpose() @ dm
    return mult.multivariate_normal(mu, Cov, allow_singular=True)


def maxLikelihoodClassify(labelledData, data):
    """
        labelledData: list of np.arrays
        data: np.array
        All np.arrays of size n * b
            n: nr of samples
            b: nr of bands
    """

    n, b = data.shape
    l = len(labelledData)

    llhs = [
        getLikelihoodFunction(labelSampleData)
        for labelSampleData in labelledData
    ]

    allClassifications = np.zeros((n, l), dtype=np.dtype('float32'))
    for i, llh in enumerate(llhs):
        allClassifications[:, i] = llh.pdf(data)

    maxLlhClasses = np.argmax(allClassifications, axis=1)
    return maxLlhClasses


#%%
waterSamples = allData[190:201, 275:300, :].reshape(11*25, 10)
buildingSamples = allData[170:200, 300:390, :].reshape(30*90, 10)
treesSamples = allData[50:100, 250:300, :].reshape(50*50, 10)
fieldSamples = allData[50:90, 330:360, :].reshape(40*30, 10)
dataLinear = allData.reshape(268*661, 10)


classes = maxLikelihoodClassify([waterSamples, buildingSamples, treesSamples, fieldSamples], dataLinear)
classesImg = classes.reshape(268, 661, 1)
plt.imshow(classesImg, cmap="Set3")
    
```


This classifies our Weßling scene quite nicely.
\begin{figure}[H]
    \caption{Supervised classification of Weßling scene using maximum-likelihood
    \centering
      \includegraphics[width=0.65\textwidth]{images/max_likelihood_wessling.png
\end{figure





### U-Net
The U-Net is a popular, convolutional neural net for image segmentation.
```python
#%%
import os


inputDir = "./data/images"
targetDir = "./data/annotations/trimaps"
imageSize = (160, 160)
numClasses = 3
batchSize = 32

inputImagePaths = sorted([
    os.path.join(inputDir, fName)
    for fName in os.listdir(inputDir)
    if fName.endswith(".jpg")
])

targetImagePaths = sorted([
        os.path.join(targetDir, fName)
    for fName in os.listdir(targetDir)
    if fName.endswith(".png") and not fName.startswith(".")
])

#%% Data-loader

from tensorflow import keras as k
import numpy as np
from tensorflow.keras.preprocessing.image import load_img

class OxfordPets(k.utils.Sequence):
    def __init__(self, batchSize, imgSize, inputImgPaths, targetImgPaths):
        self.batchSize = batchSize
        self.imgSize = imgSize
        self.inputImgPaths = inputImgPaths
        self.targetImgPaths = targetImgPaths

    def __len__(self):
        """ Gives tf the amount of batches available """
        return len(self.targetImgPaths) // self.batchSize

    def __getitem__(self, idx):
        """ Returns tuple (input, target) corresponding to batch #idx """
        i = idx * self.batchSize
        
        batchInputImgPaths = self.inputImgPaths[i : i + self.batchSize]
        batchTargetImgPaths = self.targetImgPaths[i : i + self.batchSize]
        
        x = np.zeros((self.batchSize, self.imgSize[0], self.imgSize[1], 3), dtype='float32')
        for j, path in enumerate(batchInputImgPaths):
            img = load_img(path, target_size=self.imgSize)
            x[j, :, :, :] = img
        
        y = np.zeros((self.batchSize, self.imgSize[0], self.imgSize[1], 1), dtype='uint8')
        for j, path in enumerate(batchTargetImgPaths):
            img = load_img(path, target_size=self.imgSize, color_mode='grayscale')
            y[j] = np.expand_dims(img, 2)
            # Ground truth labels are 1, 2, 3. Subtract one to make them 0, 1, 2:
            y[j] -= 1
        return x, y

    

#%% 
from tensorflow.keras import layers


def makeModel(imgSize, numClasses):
    inputs = k.Input(shape=imgSize + (3,))

    ### First half of model: downsampling inputs

    # Entry block
    x = layers.Conv2D(32, 3, strides=2, padding="same")(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    previousBlockActivation = x

    # Blocks 1, 2, 3 are identical apart from the feature depth
    for filters in [64, 128, 256]:
        x = layers.Activation('relu')(x)
        x = layers.SeparableConv2D(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)
        
        x = layers.Activation('relu')(x)
        x = layers.SeparableConv2D(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)

        x = layers.MaxPooling2D(3, strides=2, padding='same')(x)

        # Project residual
        residual = layers.Conv2D(filters, 1, strides=2, padding='same')(previousBlockActivation)
        x = layers.add([x, residual])
        previousBlockActivation = x  # Setting aside next residual


    ### Second half of network: upsampling inputs

    for filters in [256, 128, 64, 32]:
        x = layers.Activation('relu')(x)
        x = layers.Conv2DTranspose(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)

        x = layers.Activation('relu')(x)
        x = layers.Conv2DTranspose(filters, 3, padding='same')(x)
        x = layers.BatchNormalization()(x)

        x = layers.UpSampling2D(2)(x)

        # Project residual
        residual = layers.UpSampling2D(2)(previousBlockActivation)
        residual = layers.Conv2D(filters, 1, padding='same')(residual)
        x = layers.add([x, residual])
        previousBlockActivation = x

    
    outputs = layers.Conv2D(numClasses, 3, activation='softmax', padding='same')(x)

    model = k.Model(inputs, outputs)
    return model


k.backend.clear_session()

model = makeModel(imageSize, numClasses)
model.summary()


# %%
import random

# Split our img paths into a training and a validation set
val_samples = 1000
random.Random(1337).shuffle(inputImagePaths)
random.Random(1337).shuffle(targetImagePaths)
trainInputImgPaths = inputImagePaths[:-val_samples]
trainTargetImgPaths = targetImagePaths[:-val_samples]
valInputImgPaths = inputImagePaths[-val_samples:]
valTargetImgPaths = targetImagePaths[-val_samples:]

# Instantiate data Sequences for each split
trainGen = OxfordPets(batchSize, imageSize, trainInputImgPaths, trainTargetImgPaths)
validGen = OxfordPets(batchSize, imageSize, valInputImgPaths, valTargetImgPaths)


# %%
# Configure the model for training.
# We use the "sparse" version of categorical_crossentropy
# because our target data is integers.
model.compile(optimizer="rmsprop", loss="sparse_categorical_crossentropy")

callbacks = [
    k.callbacks.ModelCheckpoint("oxford_segmentation.h5", save_best_only=True)
]

# Train the model, doing validation at the end of each epoch.
epochs = 15
model.fit(trainGen, epochs=epochs, validation_data=validGen, callbacks=callbacks)

# %%
valPreds = model.predict(validGen)

```








## Remote sensing for water quality
Nasa has very good documentation for this on [their website](https://earthdata.nasa.gov/learn/pathfinders/water-quality-data-pathfinder).

- Salinity: measured by SMOS (ESA) and Aquarius (NASA)
- Ocean current. Shine *really* long wave radar on the ocean - several kilometers (thats LF, VLF and ULF radio waves, btw). At this range, waves cancel out and you get the medium height of the water to a few centimeters exact. Using Navier-Stokes, water height is related to current. Unfortunately, this really only works for surface currents.


## Remote sensing for floods

## Remote sensing for ecology


## SNAP
Realistically, a lot of the geo-processing is better done in a dedicated tool.
This holds especially true for L1-products: you don't want to code all the pre-processing by hand.
SAR-satellites commonly only have a L1 product, so there is always some pre-processing required. 
Sentinel-1, for example, only offers L2 data over open ocean.


### Optical


- OWT: optical water type. Nice with sentinel 2 and 3. 
  - GLASS-6C-Normalized: 6 spectral signatures of lake-waters: clear/low-chloro, peat/high-humic, chloro-med, chloro-high, bright/sediment-med, bright/sediment-high
    


### SAR

SAR-preprocessing:

- TOPSAR-Split: 
- Orbit-files: updated orbit-info is available a couple of weeks after acquisition.
- Co-registration
- Coherence: removes base-noise (some objects on the ground do send off a tiny bit of radar on their own.)
- TOPSAR-deburst: moving-window averaging
- Multilook: Smoothing out speckle by looking at a location through multiple images.
- Terrain-Correction: radar is side-looking; has foreshortening etc. 


SAR-analysis

- Radar vegetation index
- SAR/Urban areas/Speckle divergence


### General

Classification:

- raster/classification/supervised/Random-forrest


### Automation
For the automation of tasks, SNAP provides a [CLI](http://step.esa.int/docs/tutorials/SNAP_CommandLine_Tutorial.pdf)





## Example: Ocean categorization

### Phase 0: research
Inspiration came from finding the OWC Classifier in SNAP. The classifier knows of a few types of water and their spectral signatures.
It's designed to work with Sentinel-3 data.
Specifically I red on [STEP](https://forum.step.esa.int/t/owt-classification/11360) that it's working with OLCI-L2 atmospherically corrected water spectra.

OLCI is simply the Ocean and Land Colour Instrument - one of the sensors next to the temperature-, SAR- and humidity-sensors on Sentinel 3.

It has two operation modes: above land and above water.

In the L2-product, cloud-pixels are discarded.
The above-land-L2 product, `OL_2_LFR` (full-res) and `OL_2_LRR` (reduced-res) are already analyzed: they contain Global Vegetation Index and Terrestrial Chlorophyll Index.
The above-water-L2 product, `OL_2_WRR` and `OL_2_WFR` are also analysed: Chlorophyll-a concentration, Total suspended matter concentration, Aerosol load.
Unfortunately, however, L2-water-products are not disseminated via scihub. Instead, that data is found on eumetsat. After further research, I also found an AWS bucket [here](https://meeo-s3.s3.amazonaws.com/index.html/Ag11hncyrvjCMREETSJjwK/26HzHFuYgMiBqXBNNxcRQdYMEE2y/6GmKi5Q7qbosp2mrF6U1GoGLApWdrRAVnsTdVYL27Dzu/3dGB8bvDxnJ26DPd93LRs1dSHxcEA1MrTtEkbucmy7UEbcyWdsb).

### Phase 1: data

### Phase 2: processing
Created a graph in SNAP.

```xml
    <graph id="Graph">
    <version>1.0</version>
    <node id="Read">
      <operator>Read</operator>
      <sources/>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <file>${input}</file>
      </parameters>
    </node>
    <node id="Subset">
      <operator>Subset</operator>
      <sources>
        <sourceProduct refid="Read"/>
      </sources>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <sourceBands/>
        <region>0,0,0,0</region>
        <referenceBand/>
        <geoRegion>POLYGON ((6.779224872589111 57.80636978149414, 17.677661895751953 57.80636978149414, 17.677661895751953 51.95401382446289, 6.779224872589111 51.95401382446289, 6.779224872589111 57.80636978149414, 6.779224872589111 57.80636978149414))</geoRegion>
        <subSamplingX>1</subSamplingX>
        <subSamplingY>1</subSamplingY>
        <fullSwath>false</fullSwath>
        <tiePointGridNames/>
        <copyMetadata>true</copyMetadata>
      </parameters>
    </node>
    <node id="OWTClassification">
      <operator>OWTClassification</operator>
      <sources>
        <sourceProduct refid="Subset"/>
      </sources>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <owtType>COASTAL</owtType>
        <reflectancesPrefix>Oa</reflectancesPrefix>
        <inputReflectanceIs>RADIANCE_REFLECTANCES</inputReflectanceIs>
        <writeInputReflectances>false</writeInputReflectances>
      </parameters>
    </node>
    <node id="Write">
      <operator>Write</operator>
      <sources>
        <sourceProduct refid="OWTClassification"/>
      </sources>
      <parameters class="com.bc.ceres.binding.dom.XppDomElement">
        <file>${output}</file>
        <formatName>GeoTIFF</formatName>
      </parameters>
    </node>
    <applicationData id="Presentation">
      <Description/>
      <node id="Read">
              <displayPosition x="27.0" y="34.0"/>
      </node>
      <node id="Subset">
        <displayPosition x="96.0" y="76.0"/>
      </node>
      <node id="OWTClassification">
        <displayPosition x="113.0" y="132.0"/>
      </node>
      <node id="Write">
              <displayPosition x="190.0" y="199.0"/>
      </node>
    </applicationData>
  </graph>  
```

Can be run from command line in a [https://hub.docker.com/r/mundialis/esa-snap}{SNAP-docker-container} with 
```bash
    path/to/snap/bin/gpt path/to/s3_l2_olci_wrr_graph.xml -t target.tiff -f GeoTIFF path/to/sourcefile.xml
```
Note that the `sourcefile.xml` will overwrite the `read/parameter/file` value in the graph-file.
There is a nice tutorial on [headless-SNAP](http://step.esa.int/docs/tutorials/SNAP_CommandLine_Tutorial.pdf).

Especially convenient is the fact that one can  insert variables in the form `${variableName}` in place
of a parameter value. You can then replace the variableName with a value at the command line.
For example, if a parameter for a file included the variable for `\$\{myFilename\}
```xml
    <parameters>
     <file>${myFilename}</file>
    </parameters>
```
and then call gpt using 
```bash
basePath=/home/michael/Desktop/code/snap
fileName=S3A_OL_2_WRR____20211103T094250_20211103T102707_20211103T121733_2657_078_136______MAR_O_NR_003.SEN3
$basePath/snap/bin/gpt $basePath/workspace/mygraph.xml \
    -t target.tiff -f GeoTIFF \
    -Pinput=$basePath/workspace/$fileName/xfdumanifest.xml \
    -Poutput=$basePath/workspace/output.tif
```

