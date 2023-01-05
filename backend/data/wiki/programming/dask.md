# Dask

## Setting-up a dev-cluster
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

  worker-b:
    image: ghcr.io/dask/dask:latest
    command: ["dask-worker", "tcp://scheduler:8786"]

  notebook:
    image: ghcr.io/dask/dask-notebook:latest
    ports:
      - "8888:8888"
    environment:
      - DASK_SCHEDULER_ADDRESS="tcp://scheduler:8786"
```