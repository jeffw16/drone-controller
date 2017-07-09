var kP = 1;
var kI = 1;
var kD = 1;
var derivator = 0;
var integrator = 0;
var integrator_max = 100;
var integrator_min = -100;
var quaternion = [];

var exports = module.exports = function(_socket){
  var socket = _socket;

this.update = function(_data){
quaternion[0] = _data.rotx; //roll
quaternion[1] = _data.roty; //pitch
quaternion[2] = _data.rotz; //yaw
quaternion[3] = _data.alt;

  calculatePID(quaternion, [0, 0, 0, 50]);
};

var calculatePID = function(_quaternion, setPoints){
  for(var i = 0; i < _quaternion.length-1; i++){
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

    var pid = pVal + iVal + dVal;

    if(i === 0){
      var left = /*throttle + */ pid;
      socket.emit('writemotor', {side: "left", thrust: left});
      var right = /*throttle - */ -pid;
      socket.emit('writemotor', {side: "right", thrust: right});
    }else if (i == 1) {
      var front = /*throttle + */ pid;
      socket.emit('writemotor', {side:"front", thrust: front});
      var back = /*throttle + */ pid;
      socket.emit('writemotor', {side:"back", thrust: back});
    }else if (i == 3) {
      var frontl = pid;
      var backl =  pid;
      socket.emit('writemotor', {side:"front", thrust: frontl});
      socket.emit('writemotor', {side:"back",  thrust: backl});
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
