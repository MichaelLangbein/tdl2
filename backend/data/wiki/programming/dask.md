# Dask

# Setting-up a dev-cluster
```yml
version: "3.1"

services:
  scheduler:
    image: ghcr.io/dask/dask:latest
    ports:
      - "8786:8786"
      - "8787:8787"
    command: ["dask-scheduler"]

  worker-a:
    image: ghcr.io/dask/dask:latest
    command: ["dask-worker", "tcp://scheduler:8786"]
    environment:
      - EXTRA_CONDA_PACKAGES="graphviz datashader"

  worker-b:
    image: ghcr.io/dask/dask:latest
    command: ["dask-worker", "tcp://scheduler:8786"]
    environment:
      - EXTRA_CONDA_PACKAGES="graphviz datashader"

  notebook:
    image: ghcr.io/dask/dask-notebook:latest
    ports:
      - "8888:8888"
    environment:
      - DASK_SCHEDULER_ADDRESS="tcp://scheduler:8786"
      - EXTRA_CONDA_PACKAGES="graphviz datashader"
```


# Concepts

## Delayed
Functions wrapped with `dask.delayed` are not run immediately, but rather passed as graphs to the dask-runtime.
```python
import dask

def add(a, b):
  return a + b

addD = dask.delayed(add)
resultD = addD(1, 2)
resultD.compute()
```

## Cluster
The sheer existence of a cluster-manager in your script causes all graphs to be executed on that cluster instead of locally.
```python
from dask.distributed import Client, progress

client = Client()
```
