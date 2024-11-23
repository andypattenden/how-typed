import { defineConfig } from 'vitest/config'

process.env.FORCE_COLOR = 1

export default defineConfig({
  test: {
    root: 'src',
    globals: true,
  },
})
