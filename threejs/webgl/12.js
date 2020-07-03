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

const apos = gl.getAttribLocation(program, 'apos');
const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
const u_Sampler = gl.getUniformLocation(program, 'u_Sampler');

// 四个顶点的坐标
const data = new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5
]);
// uv纹理坐标
const textureData = new Float32Array([
    0, 1,// 左上角-uv0
    0, 0,// 左下角-uv1
    1, 1,// 右上角-uv2
    1, 0 // 右下角-uv3
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
gl.vertexAttribPointer(apos, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(apos);

const textureBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
gl.bufferData(gl.ARRAY_BUFFER, textureData, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_TexCoord);

function textureFn() {
    // 创建纹理图像缓冲区
    const texture = gl.createTexture();
    // 终理图片上下反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // 激活0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 绑定纹理缓冲区
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置纹理贴图填充方式(纹理贴图像素尺寸大于顶点绘制区域像素尺寸)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // 设置纹素格式, jpg格式对应gl.RGB
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // 将纹理缓冲区单元TEXTURE0中的颜色数据传入片元着色器
    gl.uniform1i(u_Sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


const image = new Image();
image.onload = textureFn;
image.src = document.getElementById('imageBase64').innerText;

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
