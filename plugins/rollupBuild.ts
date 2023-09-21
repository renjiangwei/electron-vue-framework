import { rollup, InputOptions } from 'rollup'
import { AddressInfo } from 'node:net';
import { Plugin } from "vite";
import typescript from 'rollup-plugin-typescript2';
export const rollupBuildElectron = (isBuild): Plugin[] => {
  return [
    {
      name: 'test',
      apply: 'serve',
      configureServer (server) {
        server.httpServer.once('listening', async () => {
          const address = server.httpServer.address() as AddressInfo
          Object.assign(process.env, {
            VITE_DEV_SERVER_URL: `http://${address.address}:${address.port}${server.config.base}`
          })
          const res = await rollup({
            input: ['electron/main/index.ts', 'electron/main/server.ts'],
            plugins: [
              {
                name: 'dd',
                buildStart () {
                  console.log('build start')
                },
              },
              typescript({
                tsconfig: 'tsconfig.json',
                abortOnError: false,
                check: false
              })
            ],
            external: ['express', 'node:os', 'node:path', 'electron'],
          } as InputOptions)
          await res.write({
            dir: 'dist-electron/main',
            format: 'cjs'
          })
          await res.close()
          console.log(res, 'res')
          const exit = () => {
            if (process.electronApp) {
              process.electronApp.removeAllListeners()
              process.electronApp.kill()
            }
          }
          const preloadBundle = await rollup({
            input: ['electron/preload/index.ts'],
            plugins: [
              typescript({
                tsconfig: 'tsconfig.json',
                abortOnError: false,
                check: false
              }),
              {
                name: 'electron-start',
                async buildEnd () {
                  const { spawn } = await import('node:child_process')
                  const electron = await import('electron')
                  exit()
                  process.electronApp = spawn(electron.default ?? electron as any, ['.', '--no-sandbox'], { stdio: 'inherit' })
                  process.electronApp.once('exit', () => {
                    process.exit()
                  })
                  process.once('exit', exit)
                }
              }
            ],
            output: {
              dir: 'dist-electron/preload',
              format: 'cjs'
            },
          } as InputOptions)
          await preloadBundle.write({
            dir: 'dist-electron/preload',
            format: 'cjs',
          })
        })
      }
    },
    {
      name: 'esbuild',
      apply: 'build',
      async closeBundle() {
        const res = await rollup({
          input: ['electron/main/index.ts', 'electron/main/server.ts'],
          plugins: [
            {
              name: 'dd',
              buildStart () {
                console.log('build start')
              },
            },
            typescript({
              tsconfig: 'tsconfig.json',
              abortOnError: false,
              check: false
            })
          ],
          external: ['express', 'node:os', 'node:path', 'electron'],
        } as InputOptions);
        await res.write({
          dir: 'dist-electron/main',
          format: 'cjs'
        })
        await res.close()
        const preloadBundle = await rollup({
          input: ['electron/preload/index.ts'],
          plugins: [
            typescript({
              tsconfig: 'tsconfig.json',
              abortOnError: false,
              check: false
            })
          ],
        } as InputOptions)
        preloadBundle.write({
          dir: 'dist-electron/preload',
          format: 'cjs'
        })
      }
    },
  ]
}