// LookAtTrianglesWithKeys.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n'+
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n'+
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';
var nf;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  nf = document.getElementById("nearFar");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var n = initVertexBuffers(gl);
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0,0,5.0, 0,0,-100, 0,1,0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  document.onkeydown = function(ev){ keydown(ev, gl, n, u_ViewMatrix,u_ModelMatrix, viewMatrix); };

  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  var projMatrix = new Matrix4();
  projMatrix.setPerspective(30, canvas.width/canvas.height, 1,100);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var modelMatrix = new Matrix4();
  modelMatrix.setTranslate(1.25,0.0,0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES,0,n); //right side

  modelMatrix.setTranslate(-0.75,0,0);
  gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES,0,n); //left side

  // draw(gl, n, u_ViewMatrix, viewMatrix);   // Draw
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // right side
    0.0, 1.0,-4.0,  0.4,1.0,0.4, // The back green one
    -0.5,-1.0,-4.0,  0.4,1.0,0.4,
    0.5,-1.0,-4.0,  1.0,0.4,0.4,
    
    0.0, 1.0,-2.0,  1.0,0.4,0.4, // The middle yellow one
    -0.5,-1.0,-2.0,  1.0,1.0,0.4,
    0.5,-1.0,-2.0,  1.0,1.0,0.4,

      0.0, 1.0,0.0,  0.4,0.4,1.0,  // The front blue one
    -0.5,-1.0,0.0,  0.4,0.4,1.0,
      0.5,-1.0,0.0,  1.0,0.4,0.4,

    //  //left side
    //  -0.75, 1.0,-6.0,  0.4,1.0,0.4, // The back green one
    //  -1.25,-1.0,-6.0,  0.4,1.0,0.4,
    //  -0.25,-1.0,-6.0,  1.0,0.4,0.4,
     //
    //   -0.75, 1.0,-2.0,  1.0,0.4,0.4, // The middle yellow one
    //   -1.25,-1.0,-2.0,  1.0,1.0,0.4,
    //   -0.25,-1.0,-2.0,  1.0,1.0,0.4,
     //
    //   -0.75, 1.0,0.0,  0.4,0.4,1.0,  // The front blue one
    //   -1.25,-1.0,0.0,  0.4,0.4,1.0,
    //   -0.25,-1.0,0.0,  1.0,0.4,0.4,
  ]);
  var n = 9;

  // Create a buffer object
  var vertexColorbuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  return n;
}

var g_eyeX = 0.0, g_eyeY = 0.0, g_eyeZ = 5; // Eye position
function keydown(ev, gl, n, u_ViewMatrix,u_ModelMatrix, viewMatrix) {
  switch (ev.keyCode) {
    case 39: g_eyeX+=0.01; break; //left
    case 37: g_eyeX-=0.01; break; //left
    case 38: g_eyeY+=0.01; break; //up
    case 40: g_eyeY-=0.01; break; //down
    default: return;

  }
  draw(gl, n, u_ViewMatrix,u_ModelMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix,u_ModelMatrix, viewMatrix) {
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var modelMatrix = new Matrix4();
  modelMatrix.setTranslate(1.25,0.0,0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES,0,n); //right side

  modelMatrix.setTranslate(-0.75,0,0);
  gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES,0,n); //left side

  nf.innerHTML = "X: "+Math.round(g_eyeX*100)/100+", Y: "+Math.round(g_eyeY*100)/100;
}
