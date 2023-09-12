import { rmSync } from 'node:fs'
import { defineConfig, loadEnv, build } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import pkg from './package.json'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const env = loadEnv(mode, process.cwd(), '')
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!env.VSCODE_DEBUG
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
    // build: {
    //   rollupOptions: {
    //     input: {
    //       main: resolve(__dirname, 'index.html'),
    //       subWindow: resolve(__dirname, 'subWindow/index.html'),
    //     }
    //   }
    // },
    plugins: [
      vue(),
      // {
      //   name: 'test',
      //   apply: 'serve',
      //   configureServer (server) {
      //     server.httpServer.once('listening', () => {
      //       build({
      //         plugins: [
      //           {
      //             name: 'startup',
      //             async closeBundle () {
      //               process.env.VITE_DEV_SERVER_URL = 'http://localhost:3000/'
      //               console.log('close bundle')
      //               const { spawn } = await import('node:child_process')
      //               const electron = await import('electron')
      //               process.electronApp = spawn(electron.default ?? electron as any, ['.', '--no-sandbox'], { stdio: 'inherit' })
      //             }
      //           }
      //         ]
      //       })
      //     })
      //   }
      // },
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
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
    server: env.VSCODE_DEBUG && (() => {
      // const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        // host: url.hostname,
        // port: +url.port,
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
