import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import (reference) "${path.resolve("src/assets/css/index.less")}";`,
                },
                javascriptEnabled: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        https:true,
        proxy: {
            '/api': {
                target: "https://fanyi-api.baidu.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
            '/users': {
                target: "http://127.0.0.1:3002",
                // target: "http://192.168.1.10",
                // target: "https://handytranlate.top:3002/",
                changeOrigin: true,
            },
            '/translate': {
                target: "http://127.0.0.1:3002",
                // target: "https://handytranlate.top:3002/",
                changeOrigin: true,
            },
        },
    },
    
})
