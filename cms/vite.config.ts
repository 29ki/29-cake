import dns from 'dns';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/*
  GitHub authentication only works on "localhost" and not "127.0.0.1".
  https://vitejs.dev/guide/migration.html#dev-server-changes
*/
dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  root: 'src',
  server: {
    port: 1234,
    open: '/',
  },
  build: {
    outDir: '../dist',
  },
  plugins: [
    react({
      include: /\.(jsx|tsx)$/,
      babel: {
        plugins: ['styled-components'],
        babelrc: false,
        configFile: false,
      },
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
