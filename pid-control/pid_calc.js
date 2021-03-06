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
  this.kP = _kP;
  this.kI = _kI;
  this.kD = _kD;
  var bool = _bool;

this.update = function(_data){
quaternion[0] = _data.rotx; //roll
quaternion[1] = _data.roty; //pitch
quaternion[2] = _data.rotz; //yaw
quaternion[3] = _data.alt;
  var pidData = {
    kp: this.kP,
    ki: this.kI,
    kd: this.kD
  };
  console.log(pidData);

if(bool !== true){
  io.emit('pidRotData', pidData);

} else {
  io.emit('pidAltData', pidData);
}

  calculatePID(quaternion, [0, 0, 0, 8]);
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
      pVal = error*this.kP;

      integratorRoll += error;
      if(integratorRoll > integrator_max){
        integratorRoll = integrator_max;
      }else if (integratorRoll < integrator_min) {
        integratorRoll = integrator_min;
      }
      iVal = integratorRoll*this.kI;

      dVal = this.kD * (error - derivatorRoll);
      derivatorRoll = error;

       pidRoll = 0;
	     pidRoll += pVal;
       pidRoll += iVal;
	     pidRoll += dVal;
      }
      if(i === 1){
        error = setPoints[i] - _quaternion[i];
        pVal = error*this.kP;

        integratorPitch += error;
        if(integratorPitch > integrator_max){
          integratorPitch = integrator_max;
        }else if (integratorPitch < integrator_min) {
          integratorPitch = integrator_min;
        }
        iVal = integratorPitch*this.kI;

        dVal = this.kD * (error - derivatorPitch);
        derivatorPitch = error;

         pidPitch = 0;
  	     pidPitch += pVal;
         pidPitch += iVal;
  	     pidPitch += dVal;
        }
        if(i === 2){
          error = setPoints[i] - _quaternion[i];
          pVal = error*this.kP;

          integratorYaw += error;
          if(integratorYaw > integrator_max){
            integratorYaw = integrator_max;
          }else if (integratorYaw < integrator_min) {
            integratorYaw = integrator_min;
          }
          iVal = integratorYaw*this.kI;

          dVal = this.kD * (error - derivatorYaw);
          derivatorYaw = error;

           pidYaw = 0;
    	     pidYaw += pVal;
           pidYaw += iVal;
    	     pidYaw += dVal;
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

      if( i === 0 & bool !== true){
        var right = -pidRoll-pidYaw;
        socket.emit('writemotor', {side: "right", thrust: right});
      }
      if (i == 1 & bool !== true){
        var back = -pidPitch-pidYaw;
        socket.emit('writemotor', {side: "back", thrust: back});
      }


      if( i === 0 & bool !== true ){
        var left = pidRoll+pidYaw;
        socket.emit('writemotor', {side: "left", thrust: left});
      }
      if(i == 1 & bool !== true){
        var front = pidPitch-pidYaw;
        socket.emit('writemotor', {side: "front", thrust: front});
      }

    if(i == 3 & bool === true){
      var thrust = 40;
      socket.emit("writemotor", {side:"front", thrust:thrust});
      socket.emit("writemotor", {side:"back", thrust:thrust});
    }
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
  console.log("kp set");
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
