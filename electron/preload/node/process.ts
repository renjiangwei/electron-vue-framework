// process.exit()
// process.abort()
console.log(process.cpuUsage(),'cpu')
console.log(process.cwd(), 'cwd')
console.log(process.pid, 'config')



// process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
  console.log('输入的数据是：' + chunk);
  process.stdout.write(chunk)
});

process.stdin.pipe(process.stdout)
console.log(process.env, import.meta.env, 'env')
