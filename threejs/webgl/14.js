/**
 * 
 * @param {*} id 
 * @returns HTMLCanvasElement
 */
function getCanvas(id) {
    return document.getElementById(id);
    alert('请解开注释');
    return document.createElement('canvas');
}

const canvas = getCanvas('webgl');
const gl = canvas.getContext('webgl');

const cubeVertexShaderSource = document.getElementById('cubeVertexShader').innerText;
const cubeFragShaderSource = document.getElementById('cubeFragShader').innerText;
const textureVertexShaderSource = document.getElementById('textureVertexShader').innerText;
const textureFragShaderSource = document.getElementById('textureFragShader').innerText;

gl.enable(gl.DEPTH_TEST);

const textureProgram = initShader(gl, textureVertexShaderSource, textureFragShaderSource);
const cubeProgram = initShader(gl, cubeVertexShaderSource, cubeFragShaderSource);

// textureProgram 着色器变量地址
const texturePosition = gl.getAttribLocation(textureProgram, 'a_Position');
const a_TexCoord = gl.getAttribLocation(textureProgram, 'a_TexCoord');
const u_Sampler = gl.getUniformLocation(textureProgram, 'u_Sampler');
const textureMx = gl.getUniformLocation(textureProgram, 'mx');
const textureMy = gl.getUniformLocation(textureProgram, 'my');

// cubeProgram 着色器变量地址
const cubePosition = gl.getAttribLocation(cubeProgram, 'a_Position');
const a_color = gl.getAttribLocation(cubeProgram, 'a_color');
const a_normal = gl.getAttribLocation(cubeProgram, 'a_normal');
const u_lightColor = gl.getUniformLocation(cubeProgram, 'u_lightColor');
const u_lightDirection = gl.getUniformLocation(cubeProgram, 'u_lightDirection');
const cubeMx = gl.getUniformLocation(cubeProgram, 'mx');
const cubeMy = gl.getUniformLocation(cubeProgram, 'my');

const angle = Math.PI / 6;
const sin = Math.sin(angle);
const cos = Math.cos(angle);
const mxArr = new Float32Array([
    1, 0, 0, 0,
    0, cos, -sin, 0,
    0, sin, cos, 0,
    0, 0, 0, 1
]);
const myArr = new Float32Array([
    cos, 0, -sin, 0,
    0, 1, 0, 0,
    sin, 0, cos, 0,
    0, 0, 0, 1
]);
const cubeData = new Float32Array([
    .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5, .5,      //面1
    .5, .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5,      //面2
    .5, .5, .5, .5, .5, -.5, -.5, .5, -.5, .5, .5, .5, -.5, .5, -.5, -.5, .5, .5,      //面3
    -.5, .5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, .5,//面4
    -.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5,//面5
    .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5 //面6
]);
/**立方体顶点颜色数组colorData**/
const colorData = new Float32Array([
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面1
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面2
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面3
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面4
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面5
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 //红色——面6
]);
/**立方体顶点法向量数组normalData**/
const normalData = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,//z轴正方向——面1
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//x轴正方向——面2
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,//y轴正方向——面3
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,//x轴负方向——面4
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,//y轴负方向——面5
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1//z轴负方向——面6
]);
const data = new Float32Array([
    -0.4, 0.2, -0.51,
    -0.4, -0.2, -0.51,
    0.4, 0.2, -0.51,
    0.4, -0.2, -0.51
]);
const textureData = new Float32Array([
    0, 1,
    0, 0,
    1, 1,
    1, 0
]);

const image = new Image()
image.onload = textureFn;
image.src = document.getElementById('imageBase64').innerText;

function textureFn() {
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.useProgram(textureProgram);

    vertexBuffer(data, texturePosition, 3);
    vertexBuffer(textureData, a_TexCoord, 2);

    gl.uniformMatrix4fv(textureMy, false, myArr);
    gl.uniformMatrix4fv(textureMx, false, mxArr);
    gl.uniform1i(u_Sampler, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(cubeProgram);

    vertexBuffer(cubeData, cubePosition, 3);
    vertexBuffer(colorData, a_color, 3);
    vertexBuffer(normalData, a_normal, 3);

    gl.uniformMatrix4fv(cubeMx, false, mxArr);
    gl.uniformMatrix4fv(cubeMy, false, myArr);
    gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_lightDirection, 1 / Math.sqrt(15), 2 / Math.sqrt(15), -3 / Math.sqrt(15));
    
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function vertexBuffer(data, position, n) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(position, n, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
}

// 初始化着色器函数
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
    // 创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    // 创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // 引入顶点, 片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    // 编译顶点, 片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // 创建程序对象
    const program = gl.createProgram();
    // 附着顶点, 片元着色器到program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接program
    gl.linkProgram(program);

    return program;
}