import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ust.capstone.allertrac',
  appName: 'AllerTrac',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    Keyboard: {
      resizeOnFullScreen: true
    }
  }
};

export default config;
