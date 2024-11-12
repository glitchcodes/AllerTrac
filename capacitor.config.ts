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
    // GoogleAuth: {
    //   scopes: [
    //     'email',
    //     'profile'
    //   ],
    //   clientId: process.env.VITE_GOOGLE_CLIENT_ID,
    //   androidClientId: process.env.VITE_GOOGLE_CLIENT_ID_ANDROID,
    //   iosClientId: process.env.VITE_GOOGLE_CLIENT_ID_IOS,
    // }
  }
};

export default config;
