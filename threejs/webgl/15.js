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

// 渲染管线 α 融合
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

const aposLocation = gl.getAttribLocation(program, 'apos');
const a_color = gl.getAttribLocation(program, 'a_color');

const data = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, // 红色三角形的三个顶点
    -0.7, 0.3, 0.3, 0.3, 0.3, -0.7, // 绿色三角形的三个顶点
    -0.3, 0.7, 0.7, 0.7, 0.7, -0.3, // 蓝色三角形的三个顶点
]);

const colorData = new Float32Array([
    // 红色顶点
    1, 0, 0, 0.7,
    1, 0, 0, 0.7,
    1, 0, 0, 0.7,
    // 绿色顶点
    0, 1, 0, 0.7,
    0, 1, 0, 0.7,
    0, 1, 0, 0.7,
    // 蓝色顶点
    0, 0, 1, 0.7,
    0, 0, 1, 0.7,
    0, 0, 1, 0.7,
]);

vertexBuffer(colorData, a_color, 4);
vertexBuffer(data, aposLocation, 2);

gl.drawArrays(gl.TRIANGLES, 0, 9);

function vertexBuffer(data, posIndex, size) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(posIndex, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posIndex);
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
    // 使用program
    gl.useProgram(program);

    return program;
}