<script setup lang="ts">
  import { ref, onBeforeMount, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { IonIcon, IonPage, IonContent, IonButton, IonSpinner } from '@ionic/vue';
  import { arrowBack, informationCircle } from "ionicons/icons";
  import VOtpInput from "vue3-otp-input"

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useToastController } from "@/composables/useToastController";

  const toast = useToastController();

  const route = useRoute();
  const router = useRouter();

  // Check if an identifier exists on the query params
  // If not, redirect to login page
  onBeforeMount(() => {
    if (!route.query.i) {
      router.push({ name: 'login' })
    }
  });

  const identifier = computed(() => {
    const encoded = route.query.i as string;
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

  const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
  const otp = ref("");

  const verifyOTP = async () => {
    isSubmitting.value = true

    const body = {
      identifier: identifier.value.full_identifier,
      code: otp.value
    }

    try {
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

      await router.push({ name: 'login' });
    } catch (error) {
      handleErrors('verify', error);
    }

    isSubmitting.value = false;
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

      await toast.presentToast({
        message: 'Verification code sent',
        duration: 3000,
        icon: informationCircle
      })
    } catch (error) {
      handleErrors('resend', error)
    }

    isResending.value = false
  }

  const handleErrors = (type: string, error: any) => {
    switch (type) {
      case 'verify':
        // TODO: Handle errors
        break;
      case 'resend':
        // TODO: Handle errors
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
                <p :class="{ 'text-gray-500': isResending, 'text-primary': !isResending }"
                   class="font-bold hover:underline cursor-pointer"
                      @click.prevent="resendOTP">
                  Resend
                </p>
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