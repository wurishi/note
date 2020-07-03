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

// 顶点着色器
const vertexShaderSource = document.getElementById('vertexShader').innerText;
// 片元着色器
const fragShaderSource = document.getElementById('fragmentShader').innerText;

// 初始化着色器
const program = initShader(gl, vertexShaderSource, fragShaderSource);

const aposLocation = gl.getAttribLocation(program, 'apos');
const a_color = gl.getAttribLocation(program, 'a_color');
const a_normal = gl.getAttribLocation(program, 'a_normal');
const u_lightColor = gl.getUniformLocation(program, 'u_lightColor');
const u_lightDirection = gl.getUniformLocation(program, 'u_lightDirection');

const mx = gl.getUniformLocation(program, 'mx');
const my = gl.getUniformLocation(program, 'my');
const Tx = gl.getUniformLocation(program, 'Tx');

// 平行光颜色,方向(1,2,-3)
gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);
// normalize方向
gl.uniform3f(u_lightDirection, 1 / Math.sqrt(15), 2 / Math.sqrt(15), -3 / Math.sqrt(15));

// 顶点位置
const data = new Float32Array([
    .3, .3, .3, -.3, .3, .3, -.3, -.3, .3, .3, .3, .3, -.3, -.3, .3, .3, -.3, .3,      //面1
    .3, .3, .3, .3, -.3, .3, .3, -.3, -.3, .3, .3, .3, .3, -.3, -.3, .3, .3, -.3,      //面2
    .3, .3, .3, .3, .3, -.3, -.3, .3, -.3, .3, .3, .3, -.3, .3, -.3, -.3, .3, .3,      //面3
    -.3, .3, .3, -.3, .3, -.3, -.3, -.3, -.3, -.3, .3, .3, -.3, -.3, -.3, -.3, -.3, .3,//面4
    -.3, -.3, -.3, .3, -.3, -.3, .3, -.3, .3, -.3, -.3, -.3, .3, -.3, .3, -.3, -.3, .3,//面3
    .3, -.3, -.3, -.3, -.3, -.3, -.3, .3, -.3, .3, -.3, -.3, -.3, .3, -.3, .3, .3, -.3 //面6
]);

// 顶点颜色
const colorData = new Float32Array([
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面1
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面2
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面3
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面4
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色——面5
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 //红色——面6
]);

// 法向量数组
const normalData = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,//z轴正方向——面1
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//x轴正方向——面2
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,//y轴正方向——面3
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,//x轴负方向——面4
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,//y轴负方向——面5
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1//z轴负方向——面6
]);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_normal);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_color);

const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aposLocation);

gl.enable(gl.DEPTH_TEST);

let angle = Math.PI / 4;
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
gl.uniformMatrix4fv(mx, false, mxArr);
gl.uniformMatrix4fv(my, false, myArr);

function draw(x) {
    const TxArr = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, 0, 0, 1
    ]);
    gl.uniformMatrix4fv(Tx, false, TxArr);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}
draw(0.5); // x轴平移0.5
// gl.clear(gl.COLOR_BUFFER_BIT);
draw(-0.5); // x轴平移-0.5

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
    // 使用program
    gl.useProgram(program);

    return program;
}