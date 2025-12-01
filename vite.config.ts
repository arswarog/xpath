import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [react()],
    server: {
        host: '0.0.0.0',
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                devtoolsPanel: path.resolve(__dirname, 'devtools_panel.html'),
            },
        },
        // Отключаем минимизацию для лучшей читаемости
        minify: false,
        // Включаем source maps
        sourcemap: true,
        // Включаем разбивку на чанки для лучшей отладки
        // chunkSizeWarningLimit: 500, // увеличение лимита для больших чанков
        // Для отладки можно настроить build output в формате es6 (для совместимости с браузерами)
        target: 'esnext',
    },
});
