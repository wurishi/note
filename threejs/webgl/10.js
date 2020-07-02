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
// uniform 使用 getUniformLocation 声明
const u_lightColor = gl.getUniformLocation(program, 'u_lightColor');
// const u_lightDirection = gl.getUniformLocation(program, 'u_lightDirection');
const u_lightPosition = gl.getUniformLocation(program, 'u_lightPosition');

// 从program获取mx,my索引(地址)
const mx = gl.getUniformLocation(program, 'mx');
const my = gl.getUniformLocation(program, 'my');

// 绕x轴旋转45度
const mxArr = new Float32Array([
    1, 0, 0, 0,
    0, Math.cos(Math.PI / 4), -Math.sin(Math.PI / 4), 0,
    0, Math.sin(Math.PI / 4), Math.cos(Math.PI / 4), 0,
    0, 0, 0, 1
]);
gl.uniformMatrix4fv(mx, false, mxArr);

// 给点光源传入颜色和方向 RGB(1,1,1)
gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);
// 点光源的位置 (2,3,4)
gl.uniform3f(u_lightPosition, 2.0, 3.0, 4.0);

const data = new Float32Array([
    .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5, .5,      //面1
    .5, .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5,      //面2
    .5, .5, .5, .5, .5, -.5, -.5, .5, -.5, .5, .5, .5, -.5, .5, -.5, -.5, .5, .5,      //面3
    -.5, .5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, .5,//面4
    -.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5,//面5
    .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5 //面6
]);
const colorData = new Float32Array([
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//红色
]);
// 顶点法向量数组 normalData
const normalData = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,//z轴正方向——面1
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,//x轴正方向——面2
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,//y轴正方向——面3
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,//x轴负方向——面4
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,//y轴负方向——面5
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1//z轴负方向——面6
]);

// normal缓冲区
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

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aposLocation);

// 深度测试
gl.enable(gl.DEPTH_TEST);
// draw
// gl.drawArrays(gl.TRIANGLES, 0, 36);
let angle = Math.PI / 4; // 起始角度
const angleSpeed = Math.PI / 3000; // 角速度 Math.PI / 3000 弧度每毫秒
let T0 = new Date(); // 上次时间

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT); // 清空上一帧图像
    // 因为 requestAnimationFrame 执行间隔是不稳定的, 大约是每16.6-33.3毫秒执行一次
    // 所以通过计算二次时间间隔来保证动画播放的稳定
    const T1 = new Date();// 本次时间
    const t = T1 - T0;
    T0 = T1;

    // 立方体旋转
    angle += t * angleSpeed;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const myArr = new Float32Array([
        cos, 0, -sin, 0,
        0, 1, 0, 0,
        sin, 0, cos, 0,
        0, 0, 0, 1
    ]);
    gl.uniformMatrix4fv(my, false, myArr);
    requestAnimationFrame(draw);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

draw();

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