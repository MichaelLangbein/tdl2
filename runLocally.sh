#! /bin/bash
gnome-terminal -- sh -c "bash -c \"cd ~/Desktop/code/tdl2/backend/; npm run start; exec bash\""
gnome-terminal -- sh -c "bash -c \"cd ~/Desktop/code/tdl2/frontend/; http-server ./dist/frontend/ --port=8080 --cors -g; exec bash\""
firefox --new-tab 'http://127.0.0.1:8080'
