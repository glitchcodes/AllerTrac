<script setup lang="ts">
  import { ref, onBeforeMount, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {IonIcon, IonPage, IonContent, IonButton, IonSpinner, useIonRouter} from '@ionic/vue';
  import {arrowBack, closeCircleOutline, informationCircle} from "ionicons/icons";
  import VOtpInput from "vue3-otp-input"

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useToastController } from "@/composables/useToastController";
  import FetchError from "@/utils/errors/FetchError";

  const toast = useToastController();

  const route = useRoute();
  const router = useRouter();
  const ionRouter = useIonRouter();

  // Check if an identifier exists on the query params
  // If not, redirect to login page
  onBeforeMount(() => {
    if (!route.query.i) {
      ionRouter.navigate('/u/login', 'root', 'replace');
    }
  });

  const identifier = computed(() => {
    const encoded = route.query.i as string;

    if (!encoded) {
      return { prefix: '', type: '', id: '', full_identifier: '' }
    }

    const decoded = atob(encoded);

    const i = decoded.split(':')

    return {
      prefix: i[0],
      type: i[1],
      id: i[2],
      full_identifier: decoded
    }
  })

  const isSubmitting = ref<boolean>(false);
  const isResending = ref<boolean>(false);
  const resendTimer = ref<number>(0);

  const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
  const otp = ref("");

  const verifyOTP = async () => {
    isSubmitting.value = true

    const body = {
      identifier: identifier.value.full_identifier,
      code: otp.value
    }

    try {
      if (identifier.value.type === 'email-verification') {
        await verifyAccount(body);
      } else if (identifier.value.type === 'forget-password') {
        await forgotPassword(body);
      }
    } catch (error) {
      await handleErrors('verify', error);
    } finally {
      isSubmitting.value = false;
    }
  }

  const verifyAccount = async (body: { identifier: string, code: string }) => {
    const response = await useFetchAPI({
      url: '/auth/verify-account',
      method: 'PATCH',
      data: JSON.stringify(body)
    })

    await toast.presentToast({
      message: response.data.message,
      duration: 3000,
      icon: informationCircle
    })

    ionRouter.navigate('/u/login', 'forward', 'replace');
  }

  const forgotPassword = async (body: { identifier: string, code: string }) => {
    const response = await useFetchAPI({
      url: '/auth/verify-password-request',
      method: 'PATCH',
      data: JSON.stringify(body)
    })

    await toast.presentToast({
      message: response.data.message,
      duration: 3000,
      icon: informationCircle
    })

    await router.push({ name: 'reset-password', query: { t: response.data.ticket } });
  }

  const resendOTP = async () => {
    // Show loading indicator
    isResending.value = true;

    const body = {
      identifier: identifier.value.full_identifier
    }

    try {
      await useFetchAPI({
        url: '/auth/resend-verification',
        method: 'POST',
        data: JSON.stringify(body)
      });

      // Start 30 second timer
      resendTimer.value = 30;
      const countdown = setInterval(() => {
        resendTimer.value--;
        if (resendTimer.value === 0) {
          clearInterval(countdown);
        }
      }, 1000);

      await toast.presentToast({
        message: 'Verification code sent',
        duration: 3000,
        icon: informationCircle
      })
    } catch (error) {
      await handleErrors('resend', error)
    }

    isResending.value = false
  }

  const handleErrors = async (type: string, error: any) => {
    switch (type) {
      case 'verify':
        if (error instanceof FetchError) {
          await toast.presentToast({
            message: error.data.message,
            duration: 3000,
            icon: closeCircleOutline
          });
        } else {
          await toast.presentToast({
            message: 'Something went wrong while trying to verify your code.',
            duration: 3000,
            icon: closeCircleOutline
          });
        }

        console.error(error);

        break;
      case 'resend':
        if (error instanceof FetchError) {
          switch (error.statusCode) {
            case 429:
              await toast.presentToast({
                message: 'Please wait for the timer before you can resend your verification code',
                duration: 3000,
                icon: closeCircleOutline
              });
              break;
            default:
              await toast.presentToast({
                message: error.data.message,
                duration: 3000,
                icon: closeCircleOutline
              });
          }
        } else {
          await toast.presentToast({
            message: 'Something went wrong while trying to resend your verification code',
            duration: 3000,
            icon: closeCircleOutline
          });
        }

        console.error(error);
        break;
      default:
        throw new Error("No error to be handled");
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
              Verification Code
            </h5>

            <p class="mt-4 text-center">
              Please check your inbox for the verification code sent to the provided email address.
            </p>

            <form class="mt-8 mb-10" @submit.prevent>
              <div class="flex items-center justify-center mb-4">
                <v-otp-input ref="otpInput"
                             input-classes="w-14 h-14 mx-2 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-slate-400 hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                             input-type="number"
                             :num-inputs="4"
                             v-model:value="otp">
                </v-otp-input>
              </div>

              <div class="flex gap-1 justify-center items-center mb-10">
                <p class="mr-1">Didn't receive a code?</p>
                <p :class="{ 'text-gray-500': isResending || resendTimer > 0, 'text-primary': !isResending && resendTimer === 0 }"
                   class="font-bold hover:underline cursor-pointer"
                   @click.prevent="resendOTP" v-if="resendTimer === 0">
                  Resend
                </p>
                <p v-else class="text-gray-500 font-bold">{{ resendTimer }}s</p>
                <ion-spinner v-if="isResending" class="resend" name="circular"></ion-spinner>

              </div>

              <ion-button expand="block" shape="round" @click="verifyOTP">
                Next
              </ion-button>
            </form>

            <router-link v-if="identifier.type === 'forget-password'"
                         :to="{ name: 'forget-password' }"
                         router-direction="back"
                         class="flex items-center justify-center">
              <ion-icon aria-hidden="true" :icon="arrowBack" />
              <span class="ml-2">
                Return to forget password screen
              </span>
            </router-link>

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

ion-spinner.resend {
  width: 15px;
  height: 15px;
}
</style>