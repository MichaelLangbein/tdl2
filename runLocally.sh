#! /bin/bash


isZsh=$( -n "ZSH_VERSION" )
isBash=$( -n "$BASH_VERION" )

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

if $isBash; then
	cd $thisDir/backend
	gnome-terminal -- npm run run:prod
	cd $thisDir/frontend
	gnome-terminal -- npm run host:locally
fi

if $isZsh; then
	osascript -e 'tell app "Terminal"
		do script "cd $thisDir/backend && npm run run:prod"
	end tell'
	osascript -e 'tell app "Terminal"
		do script "cd $thisDir/frontend && npm run host:locally"
	end tell'
fi


