const http = require('http');
const fs = require('fs');
const path = require('path');

http
  .createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.url === '/') {
      const filePath = path.join(__dirname, '18-concatmap-fetch.html');
      fs.readFile(filePath, (err, data) => res.end(data));
    } else if (req.url === '/rxjs.js') {
      const filePath = path.join(
        __dirname,
        '../node_modules/rxjs/bundles/rxjs.umd.js'
      );
      fs.readFile(filePath, (err, data) => res.end(data));
    } else {
      const result = {
        code: 200,
        msg: '请求成功'
      };
      // 延迟5秒响应
      setTimeout(() => {
        res.end(JSON.stringify(result));
      }, 5000);
    }
  })
  .listen(8888, () => {});
