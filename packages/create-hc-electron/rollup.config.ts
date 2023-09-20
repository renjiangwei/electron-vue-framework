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
      output: {
        dir: 'dist',
        format: 'cjs'
      }
    },
    {
      input: ['bin/index.ts'],
      plugins: [
        resolve(),
        commonjs(),
        typescript({
          tsconfig: 'tsconfig.json',
          abortOnError: false,
          check: false
        })
      ],
      output: {
        dir: 'dist/bin',
        format: 'cjs'
      }
    },
  ]
)