import cac from 'cac'

const cli = cac('test-cac')
cli.option('--type <type>', 'Choose a project type', {
  default: 'node',
})

cli.command('lint [...files]', 'Lint files').action((files, options) => {
  console.log(files, options)
  if (options.type == 'electron') {
    console.log('dffff electron')
  }
})

cli.help()


const parsed = cli.parse()
console.log(JSON.stringify(parsed, null, 2))
