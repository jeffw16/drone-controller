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
  var pidControl = new PIDControl(socket, io, 1, 25, 5, false);
  var altControl = new PIDControl(socket, io, 1, 1, 1, true);
  socket.emit('message', 'Welcome! You are connected.');
  socket.on('dronedata', (data) => {
    pidControl.update(data);
    altControl.update(data);
    io.emit('clientReceiveData', data);
  });







  socket.on('updaterotkp', (kp) => {
    pidControl.setKP(kp)
  })

  socket.on('updaterotki', (ki) => {
    pidControl.setKI(ki)
  })

  socket.on('updaterotkd', (kd) => {
    pidControl.setKD(kd)
  })

  socket.on('updatealtkp', (kp) => {
    altControl.setKP(kp)
  })

  socket.on('updatealtki', (ki) => {
    altControl.setKI(ki)
  })

  socket.on('updatealtkd', (kd) => {
    altControl.setKD(kd)
  })





  socket.on('disconnect', () => {
    console.log('This user has disconnected.');
  });
});

http.listen(port, () => {
  console.log("Drone Controller Server - Welcome");
  console.log("Listening on port " + port);
});
