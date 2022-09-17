# Python

## venv


## conda
Better than venv because:
- allows non-python binaries (like gdal, tensorflow, libblas, yfinance, ...))
- not bound to local python-version

Cheat-sheet:
- conda
  - config
    - --add channels conda-forge
    - --remove channels defaults
    - --set channel_priority strict
    - --show channels
    - Or just alter `.condarc`
  - create 
    - --name <new-env-name>
    - --name <new-env-name> --file path/to/environment.yml
  - activate <env-name>
  - env 
    - list
    - export --no-builds | grep -v "prefix" > environment.yml
