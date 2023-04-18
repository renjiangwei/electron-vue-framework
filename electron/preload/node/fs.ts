import fs from 'fs'
import path from 'node:path'
import { buffer } from 'stream/consumers'
fs.cp('./electron/preload/node/path.ts', './electron/preload/node/fsfile/path.ts', (err) => {
  console.log(err)
})

console.log(process.cwd(), 'cwd')

fs.watchFile('./electron/preload/node/path.ts', (cur) => {
  console.log(cur.size, 'cur')
})

fs.watch('./electron/preload/node/path.ts', (event) => {
  console.log(event, 'watch')
})

fs.readFile('./electron/preload/node/path.ts', (err, res) => {
  console.log(res, 'readFile')
})

fs.opendir('./electron/preload/', (err, res) => {
  console.log(res, 'opendir')
  console.log(res.readSync(), 'readSync')
  console.log(res.readSync(), 'readSync')
  console.log(res.readSync(), 'readSync')
  console.log(res.readSync(), 'readSync')
  console.log(res.readSync(), 'readSync')
})

fs.open('./electron/preload/node/path.ts', 'r+', (err, fd) => {
  console.log(fd, 'open')
  fs.read(fd, Buffer.from('sad1231', 'utf-8'), 0, 2, 0, (bytesRead, buffer) => {
    console.log(bytesRead, buffer, 'asd')
  })
})

fs.mkdir('./electron/preload/node/test', (err) => {
  console.log('mkdir', err)
})

fs.writeFile('./electron/preload/node/fsfile/buffer.ts', `import fs from 'fs'`, (err) => {
  console.log('writeFile', err)
})

fs.appendFile('./electron/preload/node/fsfile/buffer.ts', '\nconst a = 1', 'utf-8', (err) => {
  console.log('appendfile', err)
})