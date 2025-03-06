cd ./backend
npm run build
start powershell {node --env-file=.env ./dist/index.js; Read-Host}
cd ../frontend
npx ng build --configuration development
start powershell {http-server .\dist\frontend\ --port=4200 --cors -g; Read-Host}
# [system.Diagnostics.Process]::Start("chrome","http://localhost:4200")


