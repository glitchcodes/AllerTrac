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
    },
    GoogleAuth: {
      scopes: [
        'email',
        'profile'
      ],
      serverClientId: '593030014005-sbree9pbnp02gh8u349d1tb71jkmlhru.apps.googleusercontent.com'
    }
  }
};

export default config;
