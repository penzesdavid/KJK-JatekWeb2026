import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/https://penzesdavid.github.io/KJK-JatekWeb2026/', // <--- Ezt a sort add hozzá a saját repód nevével!
  plugins: [react(), tailwindcss()],
  // ... a többi config változatlan marad
  plugins: [react(), tailwindcss()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  }
});
  
