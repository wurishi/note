const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

http
  .createServer((req, res) => {
    if (req.url === '/') {
      const filePath = path.join(__dirname, '19-example.html');
      fs.readFile(filePath, (err, data) => res.end(data));
    } else if (req.url === '/rxjs.js') {
      const filePath = path.join(
        __dirname,
        '../node_modules/rxjs/bundles/rxjs.umd.js'
      );
      fs.readFile(filePath, (err, data) => res.end(data));
    } else if (req.url.startsWith('/search')) {
      const query = url.parse(req.url, true).query;
      if (query.query) {
        const result = [];
        result.push(query.query);
        const upper = query.query.toUpperCase();
        result.push([
          upper + ' 这是提示信息',
          upper + ' (电子游戏)',
          upper + ' 伪造信息'
        ]);
        res.setHeader('content-type', 'text/html;charset=utf-8;');
        res.end(JSON.stringify(result));
      } else {
        res.end(JSON.stringify([query.query, []]));
      }
    } else {
      res.end('404');
    }
  })
  .listen(8888, () => {});
