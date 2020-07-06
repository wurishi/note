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

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

const aposLocation = gl.getAttribLocation(program, 'apos');
const a_color = gl.getAttribLocation(program, 'a_color');

// 顶点位置
const data = new Float32Array([
    //        立方体1
    .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5, .5,      //面1
    .5, .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5,      //面2
    .5, .5, .5, .5, .5, -.5, -.5, .5, -.5, .5, .5, .5, -.5, .5, -.5, -.5, .5, .5,      //面3
    -.5, .5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, .5,//面4
    -.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5,//面5
    .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5, //面6
    //        立方体2
    .2, .2, .2, -.2, .2, .2, -.2, -.2, .2, .2, .2, .2, -.2, -.2, .2, .2, -.2, .2,      //面1
    .2, .2, .2, .2, -.2, .2, .2, -.2, -.2, .2, .2, .2, .2, -.2, -.2, .2, .2, -.2,      //面2
    .2, .2, .2, .2, .2, -.2, -.2, .2, -.2, .2, .2, .2, -.2, .2, -.2, -.2, .2, .2,      //面2
    -.2, .2, .2, -.2, .2, -.2, -.2, -.2, -.2, -.2, .2, .2, -.2, -.2, -.2, -.2, -.2, .2,//面4
    -.2, -.2, -.2, .2, -.2, -.2, .2, -.2, .2, -.2, -.2, -.2, .2, -.2, .2, -.2, -.2, .2,//面2
    .2, -.2, -.2, -.2, -.2, -.2, -.2, .2, -.2, .2, -.2, -.2, -.2, .2, -.2, .2, .2, -.2 //面6
]);
/**
 创建顶点颜色数组colorData
 **/
const colorData = new Float32Array([
    //        立方体1，透明度0.6
    1, 0, 0, 0.6, 1, 0, 0, 0.6, 1, 0, 0, 0.6, 1, 0, 0, 0.6, 1, 0, 0, 0.6, 1, 0, 0, 0.6,//红色——面1
    0, 1, 0, 0.6, 0, 1, 0, 0.6, 0, 1, 0, 0.6, 0, 1, 0, 0.6, 0, 1, 0, 0.6, 0, 1, 0, 0.6,//绿色——面2
    0, 0, 1, 0.6, 0, 0, 1, 0.6, 0, 0, 1, 0.6, 0, 0, 1, 0.6, 0, 0, 1, 0.6, 0, 0, 1, 0.6,//蓝色——面3

    1, 1, 0, 0.6, 1, 1, 0, 0.6, 1, 1, 0, 0.6, 1, 1, 0, 0.6, 1, 1, 0, 0.6, 1, 1, 0, 0.6,//黄色——面4
    0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 0, 0.6,//黑色——面5
    1, 1, 1, 0.6, 1, 1, 1, 0.6, 1, 1, 1, 0.6, 1, 1, 1, 0.6, 1, 1, 1, 0.6, 1, 1, 1, 0.6, //白色——面6
    //        立方体2，不透明，A分量为1
    1, 0, 0, 1.0, 1, 0, 0, 1.0, 1, 0, 0, 1.0, 1, 0, 0, 1.0, 1, 0, 0, 1.0, 1, 0, 0, 1.0,//红色——面1
    0, 1, 0, 1.0, 0, 1, 0, 1.0, 0, 1, 0, 1.0, 0, 1, 0, 1.0, 0, 1, 0, 1.0, 0, 1, 0, 1.0,//绿色——面2
    0, 0, 1, 1.0, 0, 0, 1, 1.0, 0, 0, 1, 1.0, 0, 0, 1, 1.0, 0, 0, 1, 1.0, 0, 0, 1, 1.0,//蓝色——面3

    1, 1, 0, 1.0, 1, 1, 0, 1.0, 1, 1, 0, 1.0, 1, 1, 0, 1.0, 1, 1, 0, 1.0, 1, 1, 0, 1.0,//黄色——面4
    0, 0, 0, 1.0, 0, 0, 0, 1.0, 0, 0, 0, 1.0, 0, 0, 0, 1.0, 0, 0, 0, 1.0, 0, 0, 0, 1.0,//黑色——面5
    1, 1, 1, 1.0, 1, 1, 1, 1.0, 1, 1, 1, 1.0, 1, 1, 1, 1.0, 1, 1, 1, 1.0, 1, 1, 1, 1.0 //白色——面6
]);

vertexBuffer(colorData, a_color, 4);
vertexBuffer(data, aposLocation, 3);

// 绘制不透明立方体
gl.drawArrays(gl.TRIANGLES, 36, 36);
// 关闭深度缓冲区
gl.depthMask(false);
gl.drawArrays(gl.TRIANGLES, 0, 36);

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