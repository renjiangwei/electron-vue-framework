import fs from 'node:fs'
import path from 'node:path'

const root = 'G:\\projects\\LabAccreditSystem\\las-ui\\src'
const output = './a.txt'

const files = fs.readdirSync(root)

try {
  fs.rmSync(output)
} catch (error) {
  console.log(error)
}

const read = (file) => {
  const stat = fs.statSync(path.resolve(root, file))
  if (stat.isDirectory()) {
    // 文件夹
    const fsss = fs.readdirSync(path.resolve(root, file))
    fsss.forEach(i => {
      read(path.join(file, i))
    })
  } else {
    // 文件

    const p = path.parse(path.resolve(root, file));
    if (['.ts', '.vue'].includes(p.ext)) {
      const fscontent = fs.readFileSync(path.join(root, file)).toString()
      fs.appendFileSync(path.resolve(output), fscontent)
    }
  }
}

files.forEach(i => {
  read(i)
})