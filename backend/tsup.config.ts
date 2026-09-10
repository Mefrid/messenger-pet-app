import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/app.ts'],
  target: 'esnext',
  clean: true,
})
