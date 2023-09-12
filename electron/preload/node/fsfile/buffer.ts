import * as fs from 'fs'
const a = 1

console.log(__dirname, ' __dirname')

const res = fs.readFileSync('./electron/preload/node/test/5  温州国际旅行卫生保健中心.jpg')
const fileReader = new FileReader()
fileReader.readAsDataURL(new Blob([res], { type: 'image/jpg' }))
fileReader.onload = (e) => {
  fs.writeFile('./electron/preload/node/test/5  温州国际旅行卫生保健中心.txt', e.target.result as string, () => {
    console.log('err')
  })
  console.log(e.target.result)
}