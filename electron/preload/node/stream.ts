import fs, { createReadStream, createWriteStream } from "fs";
import { Writable, Readable }  from "stream";

// 自动读取 on('data')
// const f = () => {
//   return new Promise(resolve => {
//     const w = fs.createWriteStream('./electron/preload/node/fsfile/file1.txt')
//     w.write('123123123')
//     w.end('\n231241')
//     resolve(true)
//   })
// }
// f().then(() => {
//   const r = fs.createReadStream('./electron/preload/node/fsfile/file1.txt')
//   r.on('close', () => {
//     console.log('close')
//   })
//   r.on('open', () => {
//     console.log('open')
//   })
//   r.on('ready', () => {
//     console.log('ready')
//   })
//   r.on('pause', () => {
//     console.log('pause')
//   })
//   r.on('resume', () => {
//     console.log('resume')
//   })
//   r.on('data', (chunk) => {
//     console.log('data', chunk.toString())
//   })
//   r.on('end', () => {
//     console.log('File reading completed');
//   });
//   r.on('error', (err) => {
//     console.log(err);
//   });
// })

// 手动读取
const a = createReadStream('./electron/preload/node/fsfile/file1.txt')
a.on('readable', () => {
  let data: Buffer = null
  while(data = a.read()) {
    console.log(data.toString(), data[0] == 0x32, 'data')
  }
})

const b = createWriteStream('./electron/preload/node/fsfile/1.txt')

// b.on('open', () => {
//   console.log('open')
//   b.write('cccccccccccccccccccccccccc')
  
// })
b.on('pipe', (read) => {
})
// readStream.pipe(writeStream) // 读取到的文件将写入文件中
const p = a.pipe(b)
