# Python

## venv
- python -m venv ./venv  # creates a venv in the dir ./venv
- source ./venv/Scrips/activate
- pip install <some-package>
- deactivate
- pip freeze > requirements.txt
- pip install -r requirements.txt


## wheels
Python packages on Pypi come in *source-distributions*. 
Those contain both python source-files and c-source-files for any extensions.
Wheels are variantes of a package with pre-compiled binaries, ready made for specific distros.
When you see a message `Building wheels for collected packages:`, that means that a package is only available as a source-dist for your platform and binaries must be compiled locally.
For this to work, compilers like `g++` and dev-packages like `python-dev` (contains `*.h`s and `*.a`s) need to be present on your local machine.


## conda
Better than venv because:
- allows non-python binaries (like gdal, tensorflow, libblas, yfinance, ...))
- not bound to local python-version

Cheat-sheet:
- conda
  - config
    - --add channels conda-forge
    - --remove channels defaults
    - --set 
      - channel_priority strict
      - auto_activate_base false
    - --show channels
    - Or just alter `.condarc`
  - create 
    - --name <new-env-name>
    - --name <new-env-name> --file path/to/environment.yml
  - activate <env-name>
  - env 
    - list
    - export --no-builds | grep -v "prefix" > environment.yml
    - remove --name <env-name>
