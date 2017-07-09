var derivatorRoll = 0;
var integratorRoll = 0;
var derivatorPitch = 0;
var integratorPitch = 0;
var derivatorYaw = 0;
var integratorYaw = 0;
var derivatorAlt = 0;
var integratorAlt = 0;
var integrator_max = 100;
var integrator_min = -100;
var quaternion = [];

var exports = module.exports = function(_socket, _io, _kP, _kI, _kD, _bool){
  var io = _io;
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

  var pidData = {
    kp: kP,
    ki: kI,
    kd: kD
  }

  console.log(pidData)

  io.emit('pidData', pidData);

  calculatePID(quaternion, [0, 0, 0, 10]);
};

var calculatePID = function(_quaternion, setPoints){
  var pidRoll;
  var pidPitch;
  var pidYaw;
  for(var i = 0; i < _quaternion.length; i++){
    var pVal;
    var iVal;
    var dVal;
    var pid;
    var error;
    if(i === 0){
      error = setPoints[i] - _quaternion[i];
      pVal = error*kP;

      integratorRoll += error;
      if(integratorRoll > integrator_max){
        integratorRoll = integrator_max;
      }else if (integratorRoll < integrator_min) {
        integratorRoll = integrator_min;
      }
      iVal = integratorRoll*kI;

      dVal = kD * (error - derivatorRoll);
      derivatorRoll = error;

       pid = 0;
	     pid += pVal;
       pid += iVal;
	     pid += dVal;
      }
      if(i === 1){
        error = setPoints[i] - _quaternion[i];
        pVal = error*kP;

        integratorPitch += error;
        if(integratorPitch > integrator_max){
          integratorPitch = integrator_max;
        }else if (integratorPitch < integrator_min) {
          integratorPitch = integrator_min;
        }
        iVal = integratorPitch*kI;

        dVal = kD * (error - derivatorPitch);
        derivatorPitch = error;

         pid = 0;
  	     pid += pVal;
         pid += iVal;
  	     pid += dVal;
        }
        if(i === 2){
          error = setPoints[i] - _quaternion[i];
          pVal = error*kP;

          integratorYaw += error;
          if(integratorYaw > integrator_max){
            integratorYaw = integrator_max;
          }else if (integratorYaw < integrator_min) {
            integratorYaw = integrator_min;
          }
          iVal = integratorYaw*kI;

          dVal = kD * (error - derivatorYaw);
          derivatorYaw = error;

           pid = 0;
    	     pid += pVal;
           pid += iVal;
    	     pid += dVal;
          }

// testing version
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
    ///////////////////////////////////////////////
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
      socket.emit("writemotor", {side:"front", thrust:frontl});
      socket.emit("writermotor", {side:"back", thrust:backl});
    }
    //////////////////////////////////////////////

  }
        // socket.emit("writemotor", {side:"front", thrust:throttle+pidPitch - pidYaw});
        // socket.emit("writemotor", {side:"back", thrust:throttle-pidPitch-pidYaw});
        // socket.emit("writemotor", {side:"left", thrust:throttle+pidRoll+pidYaw});
        // socket.emit("writemotor", {side:"right", thrust:throttle-pidRoll+pidYaw});

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
