import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Served as a GitHub Pages project site (https://<user>.github.io/money-calc/),
// so every asset URL needs the repo name as its base path.
export default defineConfig({
  base: '/money-calc/',
  plugins: [svelte()],
})
