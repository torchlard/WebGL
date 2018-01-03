
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n'+
  'attribute float a_PointSize;\n'+
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main(){\n'+
    'gl_Position = a_Position;\n'+
    'gl_PointSize = a_PointSize;\n'+
    'v_Color = a_Color;\n'+
  '}\n';
var FSHADER_SOURCE =
  'precision mediump float;\n'+
  // 'varying vec4 v_Color;\n'+
  'uniform float u_Width;\n'+
  'uniform float u_Height;\n'+
  'void main(){\n'+
  // ' gl_FragColor = v_Color;\n'+
    'gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n'+
  '}\n';

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
  
  
}

function initVertexBuffers(gl){
  var verticesSizes = new Float32Array([
    0.0,0.3, 20.0, 1.0, 0.0, 0.0,
    -0.3,-0.3, 10.0, 0.0, 1.0, 0.0,
    0.3,-0.3, 30.0, 0.0, 0.0, 1.0,
  ]);
  var n = 3;

  var vertexSizeBuffer = gl.createBuffer();
  // if(!vertexBuffer){
  //   console.log('Failed create buffer object');
  //   return -1;
  // }
  var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*6,0);
  gl.enableVertexAttribArray(a_Position);
  
  // var sizeBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE*6,FSIZE*2);
  gl.enableVertexAttribArray(a_PointSize);
  
  // var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*6, FSIZE*3);
  // gl.enableVertexAttribArray(a_Color);
  var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  gl.uniform1f(u_Height, 400.0);
  // gl.enableVertexAttribArray(u_Height);
  var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  gl.uniform1f(u_Width, 400.0);
  // gl.enableVertexAttribArray(u_Width);
  
  return n;
}









