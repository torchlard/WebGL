
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n'+
  'uniform mat4 u_ModelMatrix;\n'+
  'void main(){\n'+
    'gl_Position = u_ModelMatrix *  a_Position;\n'+
  '}\n';
var FSHADER_SOURCE =
  'void main(){\n'+
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n'+
  '}\n';

var ANGLE_STEP = 65.0;

function main(){

  var canvas = document.getElementById("webgl");
  var gl = getWebGLContext(canvas);

  if(!gl){
    console.log('not supported for webGL');
    return;
  }

  // initialize shader
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('failed to init shader');
    return;
  }

  var n = initVertexBuffers(gl);
  if (n<0){
    console.log('fail to set vertex buffers.');
    return;
  }

  var Tx=0.6;
  // background
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  
  var currentAngle = 0.0;
  var modelMatrix = new Matrix4();
  // modelMatrix.setTranslate(Tx, 0, 0);
  // modelMatrix.rotate(ANGLE, 0, 0, 1);
  
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
  var tick = function(){
      currentAngle = animate(currentAngle);
      draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix);
      requestAnimationFrame(tick);
  };
  tick();
}

function initVertexBuffers(gl){
  var vertices = new Float32Array([
    0.0,0.3, -0.3,-0.3, 0.3,-0.3
  ]);
  var n = 3;

  var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed create buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(a_Position);

  return n;
}

// set new rotation, clear screen and draw array
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix){
    modelMatrix.setRotate(currentAngle, 0,0,1);
    modelMatrix.translate(0.5,0,0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0,n);
}

var g_last = Date.now();
function animate(angle){
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // get new angle according to time passed
    var newAngle = angle+ ANGLE_STEP*elapsed/1000.0 ;
    return newAngle%=360;
}





















