const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var PIDControl = require('./pid-control/pid_calc.js');

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
  var pidControl = new PIDControl(socket);
  socket.emit('message', 'Welcome! You are connected.');
  socket.on('dronedata', (data) => {
    console.log('I received data from the drone.');
    pidControl.update(data);
    io.emit('clientReceiveData', data);
  });

  socket.on('disconnect', () => {
    console.log('This user has disconnected.');
  });
});

http.listen(port, () => {
  console.log("Drone Controller Server - Welcome");
  console.log("Listening on port " + port);
});
