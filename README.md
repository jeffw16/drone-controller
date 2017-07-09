# drone-controller
A web-based drone controller.

## Codebase
This project's codebase is split into two parts.
- `drone-controller` stores the backend server that communicates between the drone and the web client using Socket.IO. It also contains `pid-control`, which is our proprietary autonomous drone balancing engine.
- `drone-frontend` is the frontend server written in Vue that communicates with the server using Socket.IO. It allows for instantaneous monitoring of your autonomous drone and tweaking of key variables to ensure the drone flies smoothly during testing.
