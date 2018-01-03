// var VSHADER_SOURCE =
//   'void main(){\n'+
//   ' gl_Position = vec4(0.3, 0.4, 0.0, 1.0);\n'+
//   ' gl_PointSize = 10.0;\n'+
//   '}\n';
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n'+
  'attribute float a_PointSize;\n'+
  'void main(){\n'+
    'gl_Position = a_Position;\n'+
    'gl_PointSize = a_PointSize;\n'+
  '}\n';
var FSHADER_SOURCE =
  'precision mediump float;\n'+
  'uniform vec4 u_FragColor;\n'+
  'void main(){\n'+
  ' gl_FragColor = u_FragColor;\n'+
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

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_Position<0){
    console.log('fail to get storage location of a_Position');
    return;
  }

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  // register function
  canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position, u_FragColor);};

  gl.vertexAttrib3f(a_Position, 0.54,0.0,0.0);
  gl.vertexAttrib1f(a_PointSize, 15.0);

  gl.clearColor(0.0, 0.0, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.POINTS, 0,1);
}

var g_points = [];
var g_colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  // map x,y to [-1,1] coordinates
  x = ((x-rect.left)- canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y-rect.top))/(canvas.height/2);
  g_points.push([x,y]);

  if(x>=0.0 && y>=0.0){
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if(x<0.0 && y<0.0){
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {
    g_colors.push([0.0, 0.0, 1.0, 1.0]);
  }

  gl.clear(gl.COLOR_BUFFER_BIT);
  var len = g_points.length;
  for(var i=0; i<len; i++){
    var xy = g_points[i];
    var rgba = g_colors[i];

    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // pass color to uniform variable
    gl.uniform4f(u_FragColor, rgba[0],rgba[1],rgba[2],rgba[3]);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}





















