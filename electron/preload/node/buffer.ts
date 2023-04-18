import fs from 'fs'
import buffer from 'node:buffer'
// 废弃new Buffer(),因为构造函数参数类型不同效果也不同
// Buffer.alloc Buffer.from

const b = Buffer.alloc(10, 'd', 'ascii')
b[0] = 65
b[1] = 97
b[2] = 0x41
console.log(b, 'alloc')
console.log(b.toString(), 'alloc')

const b2 = Buffer.from('这是')
console.log(b2.toString('utf-8'), 'from')

const b3 = Buffer.from(b)
console.log(b3.toString(), 'from')
b3[3] = 65
console.log(b, b3, 'from')

const b4 = Buffer.allocUnsafe(10)
console.log(b4, 'allocUnsafe')

const str1 = '\uff12'
const str2 = '\uffff'
console.log(Buffer.byteLength(str1), 'byteLength', str1.length, 'length', str1)
console.log(Buffer.byteLength(str2), 'byteLength', str2.length, 'length', str2, str2.charCodeAt(0).toString(2))

const b5 = buffer.transcode(Buffer.from('243GF'), 'utf8', 'binary')
console.log(b5, 'transcode', b5.toString())

/*
  大端序、小端序
*/
console.log(b2, 'write', b2.toString())
const n2 = b2.writeIntLE(123441, 0, 6)
console.log(n2, 'write', b2.readIntBE(0, 6))

const params = new URLSearchParams({
  a: '75%',
  b: '=',
  c: '?',
  d: '#',
  e: '&',
  f: ' 1',
})
console.log(params.toString(), 'searchParams')
