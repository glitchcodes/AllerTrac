import {Capacitor} from "@capacitor/core";
import {GoogleLoginResponse, SocialLogin} from "@capgo/capacitor-social-login";
import {alertController} from "@ionic/vue";
import {alertCircle} from "ionicons/icons";

import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/auth";
import {useToastController} from "@/composables/useToastController";
import FetchError from "@/utils/errors/FetchError";

export const useGoogleAuth = () => {
  const router = useRouter();
  const auth = useAuthStore();
  const toast = useToastController();

  const initialize = async () => {
    // const webClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    // const mobileClientId = isPlatform('ios') ? import.meta.env.VITE_GOOGLE_CLIENT_ID_IOS : import.meta.env.VITE_GOOGLE_CLIENT_ID

    await SocialLogin.initialize({
      google: {
        webClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        iOSClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID_IOS,
      },
    });
  }

  const signIn =  async () => {
    if (!Capacitor.isNativePlatform()) {
      const alert = await alertController.create({
        header: 'Not available',
        message: 'Google login is not available in web platform.',
        buttons: [
          {
            text: 'OK',
            role: 'confirm'
          }
        ]
      });

      await alert.present();

      throw new Error('Not implemented');
    }

    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });

    const response = res.result as GoogleLoginResponse

    console.log(response)

    return JSON.stringify({
      email: response.profile.email,
      first_name: response.profile.givenName,
      last_name: response.profile.familyName,
      access_token: response.accessToken!.token,
      provider: 'google',
      device_type: Capacitor.getPlatform()
    });
  }

  return { initialize, signIn }
}