// vite.config.js
import path from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    sourcemap: true
    // lib: {
    //   entry: path.resolve(__dirname, 'src/main.ts'),
    //   name: 'picasso',
    //   fileName: format => `picasso.${format}.js`
    // },
  }
})