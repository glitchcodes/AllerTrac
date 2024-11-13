<script setup lang="ts">
  import { ref } from "vue";

  import { IonIcon, IonPage, IonContent, IonButton, IonSpinner } from '@ionic/vue';
  import { arrowBack, closeCircleOutline, informationCircleOutline, mailOutline } from "ionicons/icons";
  import { useRouter } from "vue-router";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useToastController } from "@/composables/useToastController";
  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/input/TextInput.vue";
  import FetchError from "@/utils/errors/FetchError";

  const router = useRouter()
  const toastController = useToastController();

  const email = ref<string>('');
  const isSubmitting = ref<boolean>(false);

  const submitResetRequest = async () => {
    if (email.value.length <= 0) return;

    isSubmitting.value = true;

    try {
      const response = await useFetchAPI({
        url: '/auth/forgot-password',
        method: 'POST',
        data: JSON.stringify({
          email: email.value
        })
      });

      email.value = "";

      await router.push({ name: 'verify-registration', query: { i: response.data.identifier } });
    } catch (error) {
      if (error instanceof FetchError) {
        if (error.data.code === 'INPUT_INVALID') {
          await toastController.presentToast({
            message: 'We will send a password request to this email if it exists in our system',
            duration: 3000,
            icon: informationCircleOutline,
          });
        } else {
          await toastController.presentToast({
            message: error.data.message,
            duration: 3000,
            icon: closeCircleOutline,
          });
        }
      } else {
        console.error(error);

        await toastController.presentToast({
          message: 'Something went wrong',
          duration: 3000,
          icon: closeCircleOutline,
        });
      }
    } finally {
      isSubmitting.value = false;
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
              Forgot Password
            </h5>

            <p class="mt-4 text-center">
              We need your email address to send a verification code.
            </p>

            <form class="mt-8 mb-10" @submit.prevent="submitResetRequest">

              <div class="text-left mb-8">
                <!-- Email Address -->
                <InputComponent v-model="email" placeholder="Email Address" type="email" data-cy="email">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="mailOutline" />
                  </template>
                </InputComponent>
                <!-- END Email Address -->
              </div>

              <ion-button v-if="!isSubmitting" expand="block" shape="round" type="submit">
                Confirm
              </ion-button>

              <ion-button v-else expand="block" shape="round" type="submit" disabled>
                <ion-spinner class="mr-2"></ion-spinner>
                Confirming...
              </ion-button>
            </form>

            <router-link :to="{ name: 'login' }" class="flex items-center justify-center">
              <ion-icon aria-hidden="true" :icon="arrowBack" />
              <span class="ml-2">
                Return to login screen
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
</style>