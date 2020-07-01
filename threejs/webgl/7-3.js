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

const data = new Float32Array([
    -0.5, 0.5, // 第一个顶点位置
    0, 0, 1, // 第一个顶点颜色
    0.5, 0.5, // 第二个顶点位置
    1, 0, 0 // 第二个顶点颜色
]);

// 创建缓冲区, 写入位置和颜色数据
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

// 4*5 表示每5个元素是一个单元, 4表示一个元素占据的字节数 (float32 是 4字节表示一个数字)
gl.vertexAttribPointer(aposLocation, 2, gl.FLOAT, false, 4 * 5, 0);
// 4*2 表示每5个元素一个单元中, 偏移2个元素后的3个元素才是顶点颜色数据
gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 4 * 5, 4 * 2);
gl.enableVertexAttribArray(aposLocation);
gl.enableVertexAttribArray(a_color);

// 执行绘制
gl.drawArrays(gl.LINES, 0, 2);

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