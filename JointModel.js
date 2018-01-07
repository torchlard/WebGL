var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Normal;\n' +        // Normal
'uniform mat4 u_MvpMatrix;\n' +
'uniform mat4 u_NormalMatrix;\n'+
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_Position = u_MvpMatrix * a_Position ;\n' +
' vec3 lightDirection = normalize(vec3(0.0,0.5,0.7));\n'+
' vec4 color = vec4(1.0,0.4,0.0,1.0);\n'+
' vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n'+
' float nDotL = max(dot(normal, lightDirection), 0.0);\n'+
' v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n ;'+
'}\n';

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
  gl.clearColor(0.9,0.9,0.9, 1);
  gl.enable(gl.DEPTH_TEST);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(50.0, canvas.width/canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(20.0,10.0,30.0, 0.0,0.0,0.0, 0.0,1.0,0.0);

  document.onkeydown = function(ev){ keydown(ev,gl,n,viewProjMatrix, u_MvpMatrix, u_NormalMatrix); };

  draw(gl,n,viewProjMatrix,u_MvpMatrix, u_NormalMatrix);
}

var ANGLE_STEP = 3.0;
var g_armAngle=90.0;
var g_joint1Angle = 45.0;
var g_joint2Angle = 0.0;
var g_joint3Angle = 0.0;

function keydown(ev,gl,n,viewProjMatrix, u_MvpMatrix, u_NormalMatrix){
  switch (ev.keyCode) {
    case 38: if(g_joint1Angle<135.0) g_joint1Angle+=ANGLE_STEP; break; //up
    case 40: if(g_joint1Angle>-165.0) g_joint1Angle-=ANGLE_STEP; break; //down
    case 37: g_armAngle = (g_armAngle+ANGLE_STEP)%360 ; break; //left
    case 39: g_armAngle = (g_armAngle-ANGLE_STEP)%360 ; break; //right
    case 90: g_joint2Angle = (g_joint2Angle+ANGLE_STEP)%360; break; //z
    case 88: g_joint2Angle = (g_joint2Angle-ANGLE_STEP)%360; break; //x
    case 86: if(g_joint3Angle<60.0) g_joint3Angle = (g_joint3Angle+ANGLE_STEP)%360;
    case 67: if(g_joint3Angle>-60.0) g_joint3Angle = (g_joint3Angle-ANGLE_STEP)%360;
    default: return;
  }
  draw(gl,n,viewProjMatrix,u_MvpMatrix, u_NormalMatrix);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
    1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
    1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
   -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
   -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
    1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
  ]);

  var normals = new Float32Array([
    0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, //front
    1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, //right
    0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, //up
    -1.0,0.0,0.0, -1.0,0.0,0.0, -1.0,0.0,0.0, -1.0,0.0,0.0, //left
    0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0, //down
    0.0,0.0,-1.0, 0.0,0.0,-1.0, 0.0,0.0,-1.0, 0.0,0.0,-1.0, //back
  ]);

  var indices = new Uint8Array ([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
  ]);
  // var n = 8;

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // var colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  // var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);  // Enable the assignment of the buffer object

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

var g_modelMatrix = new Matrix4(), g_mvpMatrix=new Matrix4();
function draw(gl,n,viewProjMatrix,u_MvpMatrix, u_NormalMatrix){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var baseHeight = 2.0;
  g_modelMatrix.setTranslate(0.0,-12.0,0.0);
  drawBox(gl,n, 10.0,baseHeight,10.0, viewProjMatrix,u_MvpMatrix,u_NormalMatrix);

  var arm1Length = 10.0;
  g_modelMatrix.setTranslate(0.0,baseHeight,0.0);
  g_modelMatrix.rotate(g_armAngle, 0.0,1.0,0.0);
  drawBox(gl,n, 3.0,arm1Length,3.0, viewProjMatrix,u_MvpMatrix, u_NormalMatrix);

  // arm2
  var arm2Length = 10.0;
  g_modelMatrix.translate(0.0, arm1Length, 0.0);
  g_modelMatrix.rotate(g_joint1Angle, 0.0,0.0,1.0);
  g_modelMatrix.scale(1.3,1.0,1.3);
  drawBox(gl,n, 4.0,arm2Length,4.0, viewProjMatrix,u_MvpMatrix,u_NormalMatrix);

  // palm
  var palmLength = 2.0;
  g_modelMatrix.translate(0.0, arm2Length, 0.0);
  g_modelMatrix.rotate(g_joint2Angle, 0.0,1.0,0.0);
  drawBox(gl,n, 2.0,arm2Length,6.0, viewProjMatrix,u_MvpMatrix,u_NormalMatrix);

  // finger1
  g_modelMatrix.translate(0.0, palmLength, 0.0);

  var fingerLength = 2.0;
  g_modelMatrix.rotate(g_joint3Angle, 1.0,0.0,0.0);
  drawBox(gl,n, 1.0,fingerLength,1.0, viewProjMatrix,u_MvpMatrix,u_NormalMatrix);

  // finger2
  g_modelMatrix.rotate(-g_joint3Angle, 1.0,0.0,0.0);
  drawBox(gl,n, 1.0,fingerLength,1.0, viewProjMatrix,u_MvpMatrix,u_NormalMatrix);

  // store and get matrix from array
  

}

var g_normalMatrix = new Matrix4();
function drawBox(gl,n, width,height,depth, viewProjMatrix,u_MvpMatrix,u_NormalMatrix){
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

  gl.drawElements(gl.TRIANGLES, n,gl.UNSIGNED_BYTE, 0);
}



