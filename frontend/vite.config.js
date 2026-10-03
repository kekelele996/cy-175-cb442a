import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 8410,
        strictPort: true,
        host: true
    },
    preview: {
        port: 8410,
        strictPort: true,
        host: true
    }
})
