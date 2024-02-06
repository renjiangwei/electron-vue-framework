import { mkdirSync, readdirSync, rmSync, rmdirSync, statSync } from 'node:fs'
import { defineConfig, loadEnv, build } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
// import rollupResolve from '@rollup/plugin-node-resolve'
// import rollupCommonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'
import { resolve } from 'path'
import { ChildProcess, exec, spawn } from 'node:child_process'
import { builtinModules } from 'node:module'
import { build as esbuild } from 'esbuild'
import { esbuildElectron } from './plugins/esbuild'
import { viteBuildElectron } from './plugins/viteBuild'
import { rollupBuildElectron } from './plugins/rollupBuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const env = loadEnv(mode, process.cwd(), '')
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!env.VSCODE_DEBUG
  const list = []
  const ignoreExt = ['.d.ts', '.less', '.css']
  const ignoreDir = ['./assets']
  return {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src')
        }
      ]
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          subWindow: resolve(__dirname, 'subWindow/index.html'),
        }
      }
    },
    plugins: [
      vue(),
      // {
      //   name: 'vite-plugin-unused',
      //   enforce: 'pre',
      //   apply: 'build',
      //   load (source) {
      //     // console.log(id, 'load')
      //     if (!/node_modules/.test(source) && !/\x00/.test(source)) {
      //       list.push(source)
      //     }
      //   },
      //   buildEnd () {
      //     const list1 = list.map(i => path.normalize(i.split('?')[0]))
      //     const isIgnore = (src) => {
      //       let res = false
      //       res = ignoreExt.some(i => {
      //         // console.log(src, src.endsWith(i), 'check')
      //         return src.endsWith(i)
      //       })
      //       let dirRes = ignoreDir.some(i => {
      //         const p = path.normalize(path.resolve(sourceDir, i))
      //         // console.log(p, 'pp')
      //         return src.indexOf(p) > -1
      //       })
      //       return res || dirRes
      //     }
      //     const removeIfNotUse = (src) => {
      //       if (statSync(src).isDirectory()) {
      //         // 是文件夹
      //         removeDir(src)
      //       } else {
      //         // console.log('是文件', src)
      //         // 是文件
      //         if (list1.indexOf(src) > -1) {
      //           // rmdirSync(src);
      //           // console.log('used src', src)
      //         } else {
      //           // console.log('unused src', src)
      //           if (!isIgnore(src)) {
      //             // rmSync(src);
      //           }
      //           // if (src.endsWith('.vue')) {
      //           //   rmSync(src);
                  
      //           // }
      //         }
      //         //  copyFileSync(src, dest)
      //       }
      //     }
      //     const removeDir = (src) => {
      //       for(let file of readdirSync(src)) {
      //         const srcPath = path.resolve(src, file)
      //         removeIfNotUse(srcPath)
      //       }
      //     }
      //     const sourceDir = path.resolve(fileURLToPath(import.meta.url), '../', './src')
      //     const files = readdirSync(sourceDir)
      //     for(let file of files) {
      //       removeIfNotUse(path.resolve(sourceDir, file))
      //     }
      //   }
      // },

      // esbuild
      // ...esbuildElectron(isBuild),

      // electron插件内容
      // ...viteBuildElectron(isBuild),

      // rollup build
      // rollupBuildElectron(isBuild),

      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: ['electron/main/index.ts', 'electron/main/server.ts'],
          onstart(options) {
            if (env.VSCODE_DEBUG) {
              options.startup()
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        }
      ]),

      // Use Node.js API in the Renderer-process
      // renderer({
      //   resolve: {
      //     'mqtt': {
      //       type: 'cjs'
      //     },
      //   }
      // }),
      renderer(),
    ],
    server: (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
        proxy: {
          '^/api': {
            target: 'http://127.0.0.1:3001',
            changeOrigin: true,
            rewrite: path => path
          }
        }
      }
    })(),
    clearScreen: false,
  }
})
