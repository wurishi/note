/**
 * 
 * @param {*} id 
 * @returns HTMLCanvasElement
 */
function getCanvas(id) {
    return document.getElementById(id);
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

// 获取顶点着色器的位置变量apos, aposLocation指向了apos
const aposLocation = gl.getAttribLocation(program, 'apos');
const a_color = gl.getAttribLocation(program, 'a_color');

// 顶点数据data, 二个三角形
const data = new Float32Array([
    -0.5, 0.5,
    0.5, 0.5,
    0.5, -0.5, // 第一个三角形
    -0.5, 0.5,
    0.5, -0.5,
    -0.5, -0.5, // 第二个三角形
]);
// 顶点颜色colorData, 存储三个顶点的RGB颜色值
const colorData = new Float32Array([
    1, 0, 0,
    1, 0, 0,
    1, 0, 0, // 第一个
    0, 0, 1,
    0, 0, 1,
    0, 0, 1, // 第二个
]);

// 创建顶点颜色缓冲区
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_color);

// 创建顶点位置缓冲区
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
gl.vertexAttribPointer(aposLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aposLocation);

// 执行绘制 三角形模式
gl.drawArrays(gl.TRIANGLES, 0, 6);

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