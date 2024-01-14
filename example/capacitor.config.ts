import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.plugin.nordicdfu',
  appName: 'example',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
