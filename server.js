const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var pidControl = require('./pid-control/pid_calc.js');

pidControl.setConstructor(io);

const port= process.env.PORT || 3000;

app.get('/', (req, res) => {
  // res.send('Drone Controller API Home');
  res.sendFile(__dirname + '/templates/index.html');
});
app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/templates/testing.html');
});

io.on('connection', (socket) => {
  console.log('A user has connected.');
  socket.emit('message', 'Welcome! You are connected.');

  socket.on('dronedata', (data) => {
    console.log('I received data from the drone.');
    pidControl.update(data);
  });

  socket.on('disconnect', () => {
    console.log('This user has disconnected.');
  });
});

function writeMotor(info) {
  io.emit('writemotor', {side: "front", thrust: 50});
}

http.listen(port, () => {
  console.log("Drone Controller Server - Welcome");
  console.log("Listening on port " + port);
});
