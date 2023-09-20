import fs from 'fs'
import path from 'path'
export const readConfig = () => {
  try {
    const dev = process.env.NODE_ENV == 'development'
    const configPath = dev ? path.join('G:/projects/env/screen-ui', './config.json')
      : path.join(path.dirname(__dirname), '../config.json')
    console.log(configPath, 'dirname')
    const res = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(res)
    console.log(config, 'config')
    return config
  } catch (error) {
    return {}
  }
}