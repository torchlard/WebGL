var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n'+
  'uniform mat4 u_ModelViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n'+
  'varying vec4 v_Color;\n'+
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ModelViewMatrix* a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  ' gl_FragColor = v_Color;\n'+
  '}\n';

function main() {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var nf = document.getElementById("nearFar");
  var n = initVertexBuffers(gl);

  var u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
  var modelViewMatrix = new Matrix4();
  modelViewMatrix.setLookAt(0.2,0.25,0.25, 0,0,0, 0,1,0);

  // var modelMatrix = new Matrix4();
  // modelMatrix.setRotate(0,0,0,1);
  // var modelViewMatrix = viewMatrix.multiply(modelMatrix);
  gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  var projMatrix = new Matrix4();
  projMatrix.setOrtho(-1.0, 1.0, -1.0,1.0,0.0,2.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  draw(gl,n,u_ModelViewMatrix, modelViewMatrix);

  // document.onkeydown = function(ev) { keydown(ev,gl,n,u_ModelViewMatrix, modelViewMatrix, nf); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
     0.0, 0.5,-0.4,  0.4,1.0,0.4, //back green
    -0.5,-0.5,-0.4,  0.4,1.0,0.4,
     0.5,-0.5,-0.4,  1.0,1.0,0.4,

     0.5, 0.4,-0.2,  1.0,0.4,0.4, //yellow
    -0.5, 0.4,-0.2,  1.0,1.0,0.4,
     0.0,-0.6,-0.2,  1.0,1.0,0.4,

     0.0, 0.5, 0.0,  0.4,0.4,1.0, //front blue
    -0.5,-0.5, 0.0,  0.4,0.4,1.0,
     0.5,-0.5, 0.0,  1.0,0.4,0.4,
  ]);
  var n = 9; // The number of vertices

  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*6, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*6, FSIZE*3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}

// var g_eyeX=0.2, g_eyeY=0.25, g_eyeZ=0.25;
// var g_near=0.0, g_far=0.5;
function keydown(ev, gl,n,u_ViewMatrix, viewMatrix, nf){
  switch(ev.keyCode) {
    case 39: g_near+=0.01; break; //right
    case 37: g_near-=0.01; break; //left
    case 38: g_far +=0.01; break; //up
    case 40: g_far -=0.01; break; //down
    default: return;
  }
  draw(gl,n,u_ViewMatrix, viewMatrix,nf);
}

function draw(gl,n, u_ViewMatrix, viewMatrix){
  // viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0,0,0,0,1,0);
  viewMatrix.setOrtho(-1,1,-1,1,0.0,2.0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // nf.innerHTML = "near: "+Math.round(g_near*100)/100+", far: "+Math.round(g_far*100)/100;
  gl.drawArrays(gl.TRIANGLES, 0,n);
}









