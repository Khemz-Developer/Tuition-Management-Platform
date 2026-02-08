import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/shared/components'),
            '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
            '@/utils': path.resolve(__dirname, './src/shared/utils'),
            '@/types': path.resolve(__dirname, './src/shared/types'),
            '@/lib': path.resolve(__dirname, './src/lib'),
            '@/admin': path.resolve(__dirname, './src/admin-teacher-web'),
            '@/student': path.resolve(__dirname, './src/student-web'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
