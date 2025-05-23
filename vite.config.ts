import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // needed so electron can link to the dist-ui files correctly
  base: './',
  build: {
    // output the react dist files seperately than electron's
    outDir: 'dist-ui'
  }
})
