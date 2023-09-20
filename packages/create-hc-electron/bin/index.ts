import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'cross-spawn'
import minimist from 'minimist'
import prompts from 'prompts'
import {
  blue,
  cyan,
  green,
  lightBlue,
  lightGreen,
  lightRed,
  magenta,
  red,
  reset,
  yellow,
} from 'kolorist'

const args = process.argv.slice(2)
const argv = minimist<{
  v: any,
  version: any,
}>(args)
if (argv.version || argv.v) {
  const pkgPath = path.join(__dirname, '../..', 'package.json')
  const str = fs.readFileSync(pkgPath, 'utf-8').toString()
  const pkg = JSON.parse(str)
  console.log('create-hc-electron version is:', pkg.version)
  process.exit(1)
}
const fileExist = (filePath) => {
  return fs.existsSync(filePath)
}

const isEmpty = (dirname) => {
  const files = fs.readdirSync(dirname)
  if (files.length === 0) {
    return true
  }
  return false
}

let defaultTargetDir = 'electron-project'
let targetDir = defaultTargetDir
let result: prompts.Answers<'projectName' | 'overwrite' | 'overwriteCheck'>;
const init = async () => {
  try {
    result = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: reset('Project name:'),
        initial: defaultTargetDir,
        onState: (state) => {
          targetDir = state.value || defaultTargetDir
        },
      },
      {
        type: () => (!fileExist(targetDir) || isEmpty(targetDir)) ? null : 'confirm',
        name: 'overwrite',
        message: () => `${targetDir} exist, overwrite?`,
      },
      {
        type: (prev, value, prompt) => {
          if (value.overwrite == false) {
            throw new Error(red('✖') + ' Operation cancelled')
          }
          return null
        },
        name: 'overwriteCheck'
      },
    ],
      {
        onCancel(prompt, answers) {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
    console.log('result:', result)

  } catch (err: any) {
    console.log(err.message)
    return
  }

  // 项目目标路径
  const root = path.resolve(process.cwd(), targetDir)
  if (result.overwrite) {
    if (!fs.existsSync(root)) {
      return
    }
    for(let file of fs.readdirSync(root)) {
      if (file == '.git') {
        continue
      }
      fs.rmSync(path.resolve(root, file), { recursive: true, force: true })
    }
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, {recursive: true})
  }

  // 项目模板路径
  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../..', 'template-electron-vue')
  const files = fs.readdirSync(templateDir)
  console.log(files, 'dff')
  for(let file of files) {
    if (file == 'package.json') {
      continue
    }
    const targetPath = path.join(root, file)
    copy(path.resolve(templateDir, file), targetPath)
  }
  const pkgPath = path.resolve(templateDir, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkgBuffer = fs.readFileSync(pkgPath)
    const pkg = JSON.parse(pkgBuffer.toString())
    pkg.name = targetDir;
    fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))
  }
}


const copy = (src, dest) => {
  if (fs.statSync(src).isDirectory()) {
    // 是文件夹
    copyDir(src, dest)
  } else {
    // 是文件
   fs.copyFileSync(src, dest)
  }
}

const copyDir = (src, dest) => {
  fs.mkdirSync(dest)
  for(let file of fs.readdirSync(src)) {
    const srcPath = path.resolve(src, file)
    const destPath = path.resolve(dest, file)
    copy(srcPath, destPath)
  }
}


init()




