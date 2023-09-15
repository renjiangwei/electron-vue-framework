import { build } from 'esbuild'

export const esbuildElectron = (isBuild) => {
  return [
    {
      name: 'test',
      apply: 'serve',
      configureServer (server) {
        server.httpServer.once('listening', async () => {
          await build({
            outdir: 'dist-electron/main',
            format: 'cjs',
            entryPoints: [
              'electron/main/index.ts',
              'electron/main/server.ts',
            ],
          })
          await build({
            outdir: 'dist-electron/preload',
            format: 'cjs',
            bundle: true,
            platform: 'node',
            target: ['node14'],
            entryPoints: [
              'electron/preload/index.ts',
            ],
            plugins: [
              {
                name: 'f',
                setup (build) {
                  build.onEnd(async () => {
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
                  })
                }
              }
            ]
          })
        })
      }
    },
    {
      name: 'esbuild',
      apply: 'build',
      async closeBundle() {
        const res = await build({
          outdir: 'dist-electron/main',
          format: 'cjs',
          entryPoints: [
            'electron/main/index.ts',
            'electron/main/server.ts',
          ],
        })
        console.log('res', res)
        const preRes = await build({
          outdir: 'dist-electron/preload',
          format: 'cjs',
          bundle: true,
          platform: 'node',
          target: ['node14'],
          entryPoints: [
            'electron/preload/index.ts',
          ],
        })
        console.log('preRes', preRes)
      }
    },
  ]
}