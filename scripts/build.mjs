import { build } from 'esbuild'
build({
  outdir: 'dist-electron/main',
  format: 'cjs',
  entryPoints: [
    'electron/main/index.ts',
    'electron/main/server.ts',
  ]
})
build({
  outdir: 'dist-electron/preload',
  format: 'cjs',
  bundle: true,
  platform: 'node',

  target: ['node14'],
  entryPoints: [
    'electron/preload/index.ts',
  ]
})