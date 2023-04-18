// const http = require('http')
import http from 'http'

const server = http.createServer((req, res) => {
  console.log(req.method, req.url, 'req.method')
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    console.log(body);
    res.end(JSON.stringify({
      code: 200,
      success: true,
      data: {
        token: 'asd'
      }
    }));
  });
})
server.listen('3001')

