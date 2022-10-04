# Python

## venv
- python -m venv ./venv  # creates a venv in the dir ./venv
- source ./venv/Scrips/activate
- pip install <some-package>
- deactivate
- pip freeze > requirements.txt
- pip install -r requirements.txt


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
