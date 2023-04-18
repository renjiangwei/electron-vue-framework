import path from 'node:path'

console.log(__dirname, 'dirname')

const basename = path.basename(__dirname)
console.log(basename, 'basename')

const delimiter = path.delimiter
console.log(delimiter, 'delimiter')

console.log(process.env.PATH)
console.log(process.env.PATH.split(path.delimiter))

const dirname = path.dirname(__dirname)
console.log(dirname, 'dirname')

console.log(path.extname('env.development'), 'extname')
console.log(path.extname('.a.a.b'), 'extname')

const fp = path.format({
  root: 'C:\\',
  dir: 'C:\\a/b/c',
  // base: 'd.txt',
  ext: '.txt',
  name: 'fff',
})
console.log(fp, 'path format')

console.log(path.isAbsolute('//server'), 'isAbsolute')
console.log(path.isAbsolute('server/a'), 'isAbsolute')

console.log(path.join('/adf', 'asd', 'ff', '../fv'), 'join')

console.log(path.normalize('C://////asd//df\\dasd/v.x/sdf/..'), 'normalize')

console.log(path.parse(__dirname), 'parse')

console.log(path.relative(__dirname, 'F:'), 'relative')

const r = path.resolve() // 注意resolve从右向左拼接路径，直到得到一个绝对路径，如果没有得到，就拼接当前文件绝对路径
const r1 = path.resolve('/a', '/asd', 'ff')
const r2 = path.resolve('a', 'asd', 'ff')
console.log(r, r1, r2, 'resolve')

console.log(path.sep, 'sep') // windows: \和/都可以分割但是返回\ linux /

console.log(path.posix.sep, 'sep')
