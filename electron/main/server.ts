import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

export const startServer = () => {
  const app = express()

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  app.get('/api/test', (req, res) => {
    res.setHeader('ContentSecurityPolicy', ['default-src', 'self', '192.168.131.16'])
    res.send(req.query.callback + '(' + JSON.stringify({
      a: 100
    }) + ')')
  })
  // app.use('/api', createProxyMiddleware({
  //   target: 'http://192.168.131.167:81/api',
  //   changeOrigin: true,
  //   pathRewrite: path => path.replace('/api', '')
  // }))
  app.listen(8880, function () {
    console.log("Listen to Port 8880!");
  });
}
const a = express()
a.listen()