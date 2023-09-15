import { Plugin, build } from "vite";
import { builtinModules } from "node:module";
export const viteBuildElectron = (isBuild): Plugin[] => {
  return [
    {
      name: 'test',
      apply: 'serve',
      configureServer(server) {
        server.httpServer.once('listening', async () => {
          const builtins = builtinModules.filter(e => !e.startsWith('_')); builtins.push('electron', ...builtins.map(m => `node:${m}`))
          build({
            configFile: false,
            publicDir: false,
            build: {
              rollupOptions: {
                external: builtins
              },
              lib: {
                entry: ['electron/preload/index.ts'],
                formats: ['cjs'],
                fileName: () => '[name].js',
              },
              outDir: 'dist-electron/preload',
              emptyOutDir: false,
            },
            resolve: {
              browserField: false,
              mainFields: ['module', 'jsnext:main', 'jsnext']
            },
          })
          build({
            configFile: false,
            publicDir: false,
            build: {
              minify: false,
              rollupOptions: {
                external: builtins,
              },
              lib: {
                entry: ['electron/main/index.ts', 'electron/main/server.ts'],
                formats: ['cjs'],
                fileName: () => '[name].js',
              },
              outDir: 'dist-electron/main',
              emptyOutDir: false,
            },
            resolve: {
              browserField: false,
              // mainFields: ['module', 'jsnext:main', 'jsnext']
            },
            plugins: [
              {
                name: 'startup',
                async closeBundle() {
                  process.env.VITE_DEV_SERVER_URL = 'http://localhost:3000/'
                  console.log('close bundle')
                  const { spawn } = await import('node:child_process')
                  const electron = await import('electron')

                  process.electronApp = spawn(electron.default ?? electron as any, ['.', '--no-sandbox'], { stdio: 'inherit' })
                  process.electronApp.once('exit', () => {
                    process.exit()
                  })
                  process.once('exit', () => {
                    if (process.electronApp) {
                      process.electronApp.removeAllListeners()
                      process.electronApp.kill()
                    }
                  })
                }
              }
            ]
          })
        })
      }
    },
    {
      name: 'test1',
      apply: 'build',
      closeBundle() {
        const builtins = builtinModules.filter(e => !e.startsWith('_')); builtins.push('electron', ...builtins.map(m => `node:${m}`))
        build({
          configFile: false,
          publicDir: false,
          build: {
            rollupOptions: {
              external: builtins
            },
            lib: {
              entry: ['electron/preload/index.ts'],
              formats: ['cjs'],
              fileName: () => '[name].js',
            },
            outDir: 'dist-electron/preload',
            emptyOutDir: false,
          },
          resolve: {
            browserField: false,
            mainFields: ['module', 'jsnext:main', 'jsnext']
          },
        })
        build({
          configFile: false,
          publicDir: false,
          build: {
            minify: false,
            rollupOptions: {
              external: builtins,
            },
            lib: {
              entry: ['electron/main/index.ts', 'electron/main/server.ts'],
              formats: ['cjs'],
              fileName: () => '[name].js',
            },
            outDir: 'dist-electron/main',
            emptyOutDir: false,
          },
          resolve: {
            browserField: false,
            // mainFields: ['module', 'jsnext:main', 'jsnext']
          },
        })
      },
    },
    
  ]
}