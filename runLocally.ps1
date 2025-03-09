try {

    Write-Output "Creating database backup..."
    cd ./backend/data
    $datetime = Get-Date -Format "yyyy_MM_dd_HH_mm"
    $sourceFile = "./tdl.db"
    $destinationFile = "../../../db_backups/tdl_" + $datetime + "_bak.db"
    Copy-Item -Path $sourceFile -Destination $destinationFile
    cd ../../
    
    Write-Output "Building backend..."
    cd ./backend
    npm run build
    start powershell {node --env-file=.env ./dist/index.js; Read-Host}
    
    Write-Output "Building frontend..."
    cd ../frontend
    npx ng build --configuration development
    start powershell {http-server .\dist\frontend\ --port=4200 --cors -g; Read-Host}
    cd ..
    # [system.Diagnostics.Process]::Start("chrome","http://localhost:4200")
    
    Write-Output("... done.")

} catch {
    Write-Host "An error occurred: $($_.Exception.Message)"
    exit 1
}