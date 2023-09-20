// import typescript from "@rollup/plugin-typescript";
import typescript from "rollup-plugin-typescript2";
import { defineConfig } from "rollup";

export default defineConfig(
  [
    {
      input: ['index.ts'],
      plugins: [
        typescript({
          tsconfig: 'tsconfig.json',
          abortOnError: false,
          check: false
        })
      ],
      output: {
        dir: 'dist',
        format: 'cjs'
      },
    },
    {
      input: ['bin/index.ts'],
      external: ['cac'],
      plugins: [
        typescript({
          tsconfig: 'tsconfig.json',
          abortOnError: false,
          check: false
        })
      ],
      output: {
        dir: 'dist/bin',
        format: 'cjs'
      },
    },
  ]
)