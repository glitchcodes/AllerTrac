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
      clientId: '258636234738-tkmdlebvme0o7tqd2a4ej0o8a092mi2v.apps.googleusercontent.com',
      androidClientId: '258636234738-33l3gaomb6mhtlhqkfm6eqru7v0dug3t.apps.googleusercontent.com',
    }
  }
};

export default config;
