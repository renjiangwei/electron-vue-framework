const fs = require('fs');
const type = {
  'JPEG 图像文件': 'FF D8 FF E0 00 10 4A 46 49 46 00 01',
  'PNG 图像文件': '89 50 4E 47 0D 0A 1A 0A',
  'GIF 图像文件': '47 49 46 38 39 61',
  'GIF 图像2': '47 49 46 38 37 61',
  'BMP 图像文件': '42 4D',
  'WAV 音频文件': '52 49 46 46 xx xx xx xx 57 41 56 45 66 6D 74 20',
  'MP3 音频文件': 'FF FB',
  'MP3 音频2': 'FF F3',
  'AVI 视频文件': '52 49 46 46 xx xx xx xx 41 56 49 20',
  'MP4 视频文件': '00 00 00 xx 66 74 79 70 69 73 6F 6D',
  'PDF 文件': '25 50 44 46 2D',
  'ZIP 压缩文件': '50 4B 03 04',
  'RAR 压缩文件': '52 61 72 21 1A 07 00',
  'EXE 可执行文件': '4D 5A',
  'DOCX 文件': '50 4B 03 04 14 00 06 00',
  'XLSX 文件': '50 4B 03 04 14 00 06 00',
  'PPTX 文件': '50 4B 03 04 14 00 06 00',
  'ICO 文件': '00 00 01 00 01 00',
}
const en = Object.entries(type)
const map = new Map(en)
// 读取文件
fs.readFile('favicon.ico', (err, data) => {
  if (err) throw err;

  // 将文件内容转换为二进制流输出
  const binaryData = Buffer.from(data);
  const entries = binaryData.entries()
  let str = ''
  for(let [key, value] of entries) {
    if (key < 16) {
      const v = value.toString(16).toUpperCase().length == 1 ? ('0' + value.toString(16).toUpperCase()) : value.toString(16).toUpperCase()
      str += ' ' + v
    } else {
      break;
    }
  }
  console.log('str', str)
  map.forEach((value, key) => {
    if (str.includes(value)) {
      console.log(key)
    }
  })
});

// const fakeFile = () => {
//   var buffer = new ArrayBuffer(64 * 1024);
//   var binary = new Uint8Array(buffer);
//   binary[0] = 0xFF;
//   binary[1] = 0xD8;
//   binary[2] = 0xFF;
//   binary[3] = 0xE0;
//   binary[4] = 0x00;
//   binary[5] = 0x10;
//   binary[6] = 0x4A;
//   binary[7] = 0x46;
//   binary[8] = 0x49;
//   binary[9] = 0x46;
//   binary[10] = 0x00;
//   binary[11] = 0x01;
//   fs.writeFile("date.jpeg", binary, function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("文件已创建并写入");
//     }
//   });
// }
// fakeFile()
