import fs from "fs";

const f = () => {
  return new Promise(resolve => {
    const w = fs.createWriteStream('./electron/preload/node/fsfile/file1.txt')
    w.write('123123123')
    w.end('\n231241')
    resolve(true)
  })
}
f().then(() => {
  const r = fs.createReadStream('./electron/preload/node/fsfile/file1.txt')
  r.on('close', () => {
    console.log('close')
  })
  r.on('open', () => {
    console.log('open')
  })
  r.on('ready', () => {
    console.log('ready')
  })
  r.on('pause', () => {
    console.log('pause')
  })
  r.on('resume', () => {
    console.log('resume')
  })
  r.on('data', (chunk) => {
    console.log('data', chunk.toString())
  })
  r.on('end', () => {
    console.log('File reading completed');
  });
  r.on('error', (err) => {
    console.log(err);
  });
})

