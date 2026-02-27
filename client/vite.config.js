import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@utils': path.resolve(__dirname, 'src/shared/utils'),
      '@data': path.resolve(__dirname, 'src/shared/data'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@context': path.resolve(__dirname, 'src/shared/context'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
    },
  },
  assetsInclude: ['**/*.lottie'],
});
