import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { isPlatform } from "@ionic/vue";
import { alertCircle } from "ionicons/icons";

import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useToastController } from "@/composables/useToastController";

import { useFetchAPI } from "@/composables/useFetchAPI";
import FetchError from "@/utils/errors/FetchError";

export const useGoogleAuth = () => {
  const router = useRouter();
  const auth = useAuthStore();
  const toast = useToastController()

  const initialize = async () => {
    const webClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const mobileClientId = isPlatform('ios') ? import.meta.env.VITE_GOOGLE_CLIENT_ID_IOS : import.meta.env.VITE_GOOGLE_CLIENT_ID

    await GoogleAuth.initialize({
      clientId: isPlatform('desktop') ? webClientId : mobileClientId,
      scopes: ['email', 'profile'],
      grantOfflineAccess: true
    });
  }

  const signIn =  async () => {
    try {
      const response = await GoogleAuth.signIn()

      const data = JSON.stringify({
        email: response.email,
        first_name: response.givenName,
        last_name: response.familyName,
        provider: 'google',
        account_id: response.id,
        id_token: response.authentication.idToken
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