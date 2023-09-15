// import typescript from "@rollup/plugin-typescript";
import typescript from "rollup-plugin-typescript2";
import { defineConfig } from "rollup";

export default defineConfig(
  [
    {
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
      output: {
        dir: 'dist-electron/main',
        format: 'cjs'
      },
    },
    {
      input: ['electron/preload/index.ts'],
      plugins: [
        typescript({
          tsconfig: 'tsconfig.json',
          abortOnError: false,
          check: false
        })
      ],
      output: {
        dir: 'dist-electron/preload',
        format: 'cjs'
      },
    }
  ]
)