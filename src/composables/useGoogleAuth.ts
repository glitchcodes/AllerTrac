import { Capacitor } from "@capacitor/core";
import { GoogleLoginResponse, SocialLogin } from "@capgo/capacitor-social-login";
import { alertController } from "@ionic/vue";
import { alertCircle } from "ionicons/icons";

import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useToastController } from "@/composables/useToastController";

import { useFetchAPI } from "@/composables/useFetchAPI";
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

      return;
    }

    try {
      const res = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
        },
      });

      const response = res.result as GoogleLoginResponse

      const data = JSON.stringify({
        email: response.profile.email,
        first_name: response.profile.givenName,
        last_name: response.profile.familyName,
        provider: 'google',
        account_id: response.profile.id,
        id_token: response.idToken,
        device_type: Capacitor.getPlatform()
      });

      const result = await useFetchAPI({
        url: '/auth/login-oauth',
        method: 'POST',
        data: data
      });

      // Set bearer token
      await auth.setBearerToken(result.data.token);

      // Redirect to welcome screen if the user hasn't completed onboarding
      if (result.data.redirect_to === 'onboarding') {
        await router.push({ name: 'onboarding-welcome' })
      } else {
        await router.push({ name: 'home' })
      }
    } catch (error) {
      if (error instanceof FetchError) {
        await toast.presentToast({
          message: 'Error: ' + error.data.message,
          duration: 5000,
          icon: alertCircle
        })
      } else {
        console.error(error);
      }
    }
  }

  return { initialize, signIn }
}