var derivator = 0;
var integrator = 0;
var integrator_max = 100;
var integrator_min = -100;
var quaternion = [];

var exports = module.exports = function(_socket, _kP, _kI, _kD, _bool){
  var socket = _socket;
  var kP = _kP;
  var kI = _kI;
  var kD = _kD;
  var bool = _bool;

this.update = function(_data){
quaternion[0] = _data.rotx; //roll
quaternion[1] = _data.roty; //pitch
quaternion[2] = _data.rotz; //yaw
quaternion[3] = _data.alt;

  socket.emit('pidData', {
    kp: kP,
    ki: kI,
    kd: kD
  });

  calculatePID(quaternion, [0, 0, 0, 10]);
};

var calculatePID = function(_quaternion, setPoints){
  for(var i = 0; i < _quaternion.length; i++){
    var error = setPoints[i] - _quaternion[i];

    var pVal = error*kP;

    integrator += error;
    if(integrator > integrator_max){
      integrator = integrator_max;
    }else if (integrator < integrator_min) {
      integrator = integrator_min;
    }
    var iVal = integrator*kI;

    var dVal = kD * (error - derivator);
    derivator = error;
    console.log("erroar: " + error);

    var pid = 0;
	pid += pVal;
//	pid += iVal;
	pid += dVal;




    // if(i === 0 & bool != true){
    //   var left = /*throttle + */ pid;
    //   socket.emit('writemotor', {side: "left", thrust: left});
    //   var right = /*throttle - */ -pid;
    //   socket.emit('writemotor', {side: "right", thrust: right});
    // }else if (i == 1 & bool != true) {
    //   var front = /*throttle + */ pid;
    //   socket.emit('writemotor', {side:"front", thrust: front});
    //   var back = /*throttle - */ -pid;
    //   socket.emit('writemotor', {side:"back", thrust: back});
    // }else if (i == 3 & bool === true) {
    //   var frontl = pid;
    //   var backl = pid;
    //   socket.emit("front", {side:"front", thrust:frontl});
    //   socket.emit("back", {side:"back", thrust:backl});
    // }
    if(pid > 0){
      if( i === 0 & bool !== true){
        var right = -pid;
        socket.emit('writemotor', {side: "right", thrust: right});
      }
      if (i == 1 & bool !== true){
        var back = -pid;
        socket.emit('writemotor', {side: "back", thrust: back});
      }
    }else if(pid < 0){
      if( i === 0 & bool !== true ){
        var left = pid;
        socket.emit('writemotor', {side: "left", thrust: left});
      }
      if(i == 1 & bool !== true){
        var front = pid;
        socket.emit('writemotor', {side: "front", thrust: front});
      }
    }if(i == 3 & bool === true){
      var frontl = pid;
      var backl = pid;
      socket.emit("front", {side:"front", thrust:frontl});
      socket.emit("back", {side:"back", thrust:backl});
    }
  }
};

this.calculatePID = calculatePID;

this.moveForward = function(){ //needs to keep GETTING CALLED CONTINUOUSLY OR IT WONT WORK for all 4
  calculatePID([], [0, 20, 0, 50]);
};
this.moveBackward = function(){
  calculatePID([], [0, -20, 0, 50]);
};
this.moveLeft = function(){
  calculatePID([], [20, 0, 0, 50]);
};
this.moveRight = function(){
  calculatePID([], [-20, 0, 0, 50]);
};


this.setKP = function(kP){
  this.kP = kP;
};
this.setKI = function(kI){
  this.kI = kI;
};
this.setKD = function(kD){
  this.kD = kD;
};
this.getKP = function(kP){
  this.kP = kP;
};
this.getKI = function(kI){
  this.kI = kI;
};
this.getKD = function(kD){
  this.kD = kD;
};
this.getSetPoint = function(){
  return setPoint;
};

};
// exports.processConnection = function(socket){
//   console.log('Connected!');
//   socket.on('dronedata', (data) => {
//   update(data);
//   });
// };
