import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'khaleej-mobile',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "SplashScreen": {
      "launchShowDuration": 0
    }
  }
};

export default config;
