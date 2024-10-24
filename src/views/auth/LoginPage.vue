<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { IonPage, IonContent, IonIcon, IonButton, IonSpinner } from "@ionic/vue";
  import { alertCircle, key, mailOutline } from "ionicons/icons";
  import { useRouter } from "vue-router";
  import { useGoogleAuth } from "@/composables/useGoogleAuth";
  import { useAuthStore } from "@/store/auth";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useToastController } from "@/composables/useToastController";

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/input/TextInput.vue";
  import FetchError from "@/utils/errors/FetchError";

  // Composable
  const router = useRouter();
  const toast = useToastController();
  const googleAuth = useGoogleAuth();

  // Initialize Google OAuth
  onMounted(() => {
    googleAuth.initialize();
  })

  // Stores
  const auth = useAuthStore();

  // States
  const isSubmitting = ref<boolean>(false);
  const isLoggingInWithGoogle = ref<boolean>(false);

  const email = ref<string>('');
  const password = ref<string>('');

  const genericError = ref<string>('');
  const inputErrors = ref<any>({});

  // Actions
  const submitForm = async () => {
    // Show loading indicator
    isSubmitting.value = true;

    // Reset errors
    genericError.value = "";
    inputErrors.value = {};

    const body = {
      email: email.value,
      password: password.value
    }

    try {
      const response = await useFetchAPI({
        url: '/auth/login',
        method: 'POST',
        data: JSON.stringify(body)
      })

      await auth.setBearerToken(response.data.token);

      const redirectTo = response.data.redirect_to;

      // Redirect to welcome screen if the user hasn't completed onboarding
      if (redirectTo === 'onboarding') {
        await router.replace({ name: 'onboarding-welcome' })
      } else {
        await router.replace({ name: 'home' })
      }

    } catch (error) {
      await handleAuthErrors(error);
    }

    // Hide loading indicator
    isSubmitting.value = false;
  }

  const loginWithGoogle = async () => {
    // Show loading indicator
    isLoggingInWithGoogle.value = true;

    // Sign in with Google
    await googleAuth.signIn()

    // Hide loading indicator
    isLoggingInWithGoogle.value = false;
  }

  const handleAuthErrors = async (error: any) => {
    if (error instanceof FetchError) {
      switch (error.data.code) {
        case "INPUT_INVALID":
          inputErrors.value = error.data.errors;
          break;
        default:
          await toast.presentToast({
            message: 'Error: ' + error.data.message,
            duration: 5000,
            icon: alertCircle
          })
      }
    }
  }
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col h-full items-center justify-center gap-4">
          <LogoComponent />

          <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

            <h5 class="text-primary text-2xl font-bold text-center">
              Sign In
            </h5>

            <form class="mt-8 mb-10" @submit.prevent="submitForm">
              <div class="flex flex-col gap-4 text-left">
                <!-- Email Address -->
                <InputComponent v-model="email" placeholder="Email Address" type="email" data-cy="email" :errors="inputErrors.email">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="mailOutline" />
                  </template>
                </InputComponent>
                <!-- END Email Address -->

                <!-- Password -->
                <InputComponent v-model="password" placeholder="Password" type="password" data-cy="password" :errors="inputErrors.password">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Password -->
              </div>

              <div class="flex my-6">
                <div class="flex-1">
                  <p v-if="genericError.length > 0" class="text-rose-500">
                    {{ genericError }}
                  </p>
                </div>

                <router-link :to="{ name: 'forget-password' }" class="hover:underline">
                  Forgot Password?
                </router-link>
              </div>

              <ion-button v-if="!isSubmitting" expand="block" shape="round" type="submit" data-cy="submit">
                Login
              </ion-button>

              <ion-button v-if="isSubmitting" expand="block" shape="round" disabled>
                <span class="mr-2">
                  Logging in
                </span>
                <ion-spinner name="circular"></ion-spinner>
              </ion-button>
            </form>

            <!-- OAuth Providers -->
            <div class="border-t-[1px] border-gray-300"></div>

            <p class="inline-block bg-white relative text-center left-1/2 -top-[13px] -translate-x-1/2 px-2">
              Or login with
            </p>

            <div class="mt-4 mb-6">
              <ion-button v-if="!isLoggingInWithGoogle" class="oauth" expand="block" shape="round" fill="outline" @click="loginWithGoogle">
                <img src="/icons/google-logo.svg" alt="Google Logo" />
                <span class="ml-3">
                  Continue with Google
                </span>
              </ion-button>

              <ion-button v-else class="oauth" expand="block" shape="round" fill="outline" disabled>
                <img src="/icons/google-logo.svg" alt="Google Logo" />
                <span class="ml-3 mr-2">
                  Logging into Google...
                </span>
                <ion-spinner name="circular"></ion-spinner>
              </ion-button>
            </div>
            <!-- END OAuth Providers -->

            <p class="text-center">
              New around here? <router-link :to="{ name: 'register' }" class="font-bold hover:underline">Sign up</router-link>
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-content {
    --ion-background-color: transparent;
    background-image: url("/images/auth-bg.png");
    background-size: cover;
  }

  ion-button.oauth {
    --padding-top: 0.25rem;
    --padding-bottom: 0.25rem;
    img {
      width: 30px;
      height: 30px;
    }
  }

  ion-spinner {
    width: 20px;
    height: 20px;
  }
</style>