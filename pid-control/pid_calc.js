
var kP = 1;
var kI = 1;
var kD = 1;
var derivator = 0;
var integrator = 0;
var integrator_max = 400;
var integrator_min = -400;
var quaternion = {};

io.on('connection', (socket) => {
  console.log('Connected!');
  socket.on('dronedata', (data) => {
  update(data);
  });
});


function update(_data){
var data = JSON.parse(_data);
quaternion[0] = data.rotx; //roll
quaternion[1] = data.roty; //pitch
quaternion[2] = data.rotz; //yaw

calculatePID(quaternion, [0, 0, 0]);
}

function calculatePID(_quaternion, setPoints){
  for(var i = 0; i < _quaternion.length-1; i++){
    var error = setPoints[i] - _quaternion[i];

    var pVal = error*kP;

    integrator += error;
    if(integrator > intergrator_max){
      integrator = integrator_max;
    }else if (integrator < integrator_min) {
      integrator = integrator_min;
    }
    var iVal = integrator*kI;

    var dVal = kD * (error - derivator);
    derivator = error;

    var pid = pVal + iVal + dVal;

    if(i == 0){
      var left = /*throttle + */ pid;
      io.emit('left', pid);
      var right = /*throttle - */ pid;
      io.emit('right', pid);
    }else if (i == 1) {
      var front = /*throttle + */ pid;
      io.emit('front', front);
      var back = /*throttle + */ pid;
      io.emit('back', back);
    }else if (i == 2) {
      //TODO: add yaw somehow?
    }
  }
}

function moveForward(){ //needs to keep GETTING CALLED CONTINUOUSLY OR IT WONT WORK for all 4
  calculatePID([], [0, 20, 0]);
}
function moveBackward(){
  calculatePID([], [0, -20, 0]);
}
function moveLeft(){
  calculatePID([], [20, 0, 0]);
}
function moveRight(){
  calculatePID([], [-20, 0, 0]);
}


function setKP(kP){
  this.kP = kP;
}
function setKI(kI){
  this.kI = kI;
}
function setKD(kD){
  this.kD = kD;
}
function getSetPoint(){
  return setPoint;
}
