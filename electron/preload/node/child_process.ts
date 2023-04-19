import childProcess from "node:child_process";

// const ls = childProcess.spawn('ls', {shell: 'powershell'});

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`子进程退出码：${code}`);
// });



// const l = childProcess.spawnSync('ls', {shell: 'powershell', encoding: 'utf8'})
// console.log(l,l.stdout.toString(), 'lll')

// const child = childProcess.execFile('node', ['--version'], (error, stdout, stderr) => {
//   if (error) {
//     throw error;
//   }
//   console.log(stdout);
// });


const n = childProcess.fork(`./electron/preload/node/child_process_sub.ts`)
n.on('error', () => {
  console.log('error')
})
n.on('close', () => {
  console.log('close')
})
n.send({a: 1})
n.on('message', (data) => {
  console.log('父进程', data)
})