const appclient = require('express')();
const httpclient = require('http').Server(appclient);
const ioclient = require('socket.io')(httpclient);

const portclient = 8080;

const appdrone = require('express')();
const httpdrone = require('http').Server(appdrone);
const iodrone = require('socket.io')(httpdrone);

const portdrone = process.env.PORT || 3000;

appclient.get('/', (req, res) => {
  // res.send('Drone Controller API Home');
  res.sendFile(__dirname + '/templates/index.html');
});
appclient.get('/test', (req, res) => {
  res.sendFile(__dirname + '/templates/testing.html');
});

ioclient.on('connection', (socket) => {
  console.log('A user has connected.');
  socket.send('Welcome! WebSockets ONLY :D');
  socket.on('hello', (socket) => {
    console.log('Message from client', socket);
  });
  // pid -> drone
  socket.on('writeMotor', (socket) => {
    socket.emit('WriteMotor', socket);
  });
  // drone -> server
  socket.on('dronedata', (socket) => {
    socket.emit('drone', socket);
  });
  socket.on('disconnect', () => {
    console.log('This user has disconnected.');
  });
});

httpclient.listen(portclient, () => {
  console.log("Drone Controller Server - Client - Welcome");
  console.log("Listening on port " + portclient);
//setInterval(() => {
//  io.send('Spam every 5 seconds');
//}, 5000);
});

httpdrone.listen(portdrone, () => {
  console.log("Drone Controller Server - Drone - Welcome");
  console.log("Listening on port " + portdrone);
});
