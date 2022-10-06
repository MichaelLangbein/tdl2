#! /bin/bash

thisDir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )


read -n 1 -p "Compile first? [y/N] " compile
if [[ $compile == "y" || $compile == "Y" ]]; then
    cd $thisDir/backend
    npm ci
    npm run build
    cd $thisDir/frontend
    npm ci
    npm run build
fi

cd $thisDir/backend
gnome-terminal -- npm run run:prod
cd $thisDir/frontend
gnome-terminal -- npm run host:locally



