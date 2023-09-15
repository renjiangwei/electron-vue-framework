import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'

rollup({
  input: 'electron/main/index.ts',
  output: {
    dir: 'dist-test',
    format: 'cjs',
  },
  plugins: [
    typescript(),
  ]
})