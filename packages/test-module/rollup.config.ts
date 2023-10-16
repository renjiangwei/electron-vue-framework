// import typescript from "@rollup/plugin-typescript";
import typescript from "rollup-plugin-typescript2";
import { defineConfig } from "rollup";
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
export default defineConfig(
  [
    {
      input: ['index.ts'],
      plugins: [
        resolve(),
        commonjs(),
        typescript({
          tsconfig: 'tsconfig.json',
          abortOnError: false,
          check: false,
        })
      ],
      output: [
        {
          file: 'dist/index.cjs',
          format: 'cjs',
        },
        {
          file: 'dist/index.js',
          format: 'es'
        }
      ],
    },
  ]
)