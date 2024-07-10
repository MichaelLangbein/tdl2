#! /bin/bash


thisDir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )


echo "Running tdl2"
echo "Base dir: $thisDir"
echo " "


read -n 1 -p "Compile first? [y/N] " compile
if [[ $compile == "y" || $compile == "Y" ]]; then
    echo "Compiling ..."
    cd $thisDir/backend
    npm ci
    npm run build
    cd $thisDir/frontend
    npm ci
    npm run build
fi

echo "Running in bash ..."
if command -v gnome-terminal &> /dev/null
then
    cd $thisDir/backend
    gnome-terminal -- npm run run:prod
    cd $thisDir/frontend
    gnome-terminal -- npm run host:locally
else
    cd $thisDir/backend
    xfce4-terminal -e 'npm run run:prod' --hold
    cd $thisDir/frontend
    xfce4-terminal -e 'npm run host:locally' --hold
fi


