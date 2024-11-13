<script setup lang="ts">
  import { onMounted, ref } from "vue";

  import { IonIcon, IonPage, IonContent, IonButton } from '@ionic/vue';
  import { checkmarkCircleOutline, closeCircleOutline, key } from "ionicons/icons";

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/input/TextInput.vue";
  import { useRoute, useRouter } from "vue-router";
  import { useToastController } from "@/composables/useToastController";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import FetchError from "@/utils/errors/FetchError";

  const password = ref<string>('');
  const confirmPassword = ref<string>('');

  const router = useRouter();
  const route = useRoute();
  const toastController = useToastController();

  const token = route.query.t;

  const isValidating = ref<boolean>(true);
  const isSubmitting = ref<boolean>(false);

  onMounted(async () => {
    // Check if the token is valid
    if (!token) {
      await router.replace({ name: 'login' });
    }

    try {
      await useFetchAPI({
        url: `/auth/check-forget-token/${token}`,
        method: 'GET'
      });

      isValidating.value = false;
    } catch (error) {
      if (error instanceof FetchError) {
        await toastController.presentToast({
          message: error.data.message,
          duration: 3000,
          icon: closeCircleOutline
        });

        await router.replace({ name: 'login' });
      } else {
        await toastController.presentToast({
          message: 'Something went wrong while checking your request',
          duration: 3000,
          icon: closeCircleOutline
        });

        await router.replace({ name: 'login' });
      }
    }
  })

  const handleSubmitForm = async () => {
    isSubmitting.value = true;

    try {
      const response = await useFetchAPI({
        url: '/auth/reset-password',
        method: 'PATCH',
        data: JSON.stringify({
          token: token,
          password: password.value,
          password_confirmation: confirmPassword.value
        })
      });

      if (response.status === 200) {
        await toastController.presentToast({
          message: 'Password reset successful. Please login again',
          duration: 3000,
          icon: checkmarkCircleOutline
        });

        await router.replace({ name: 'login' });
      }
    } catch (error) {
      if (error instanceof FetchError) {
        await toastController.presentToast({
          message: error.data.message,
          duration: 3000,
          icon: closeCircleOutline
        });
      } else {
        await toastController.presentToast({
          message: 'Something went wrong while checking your request',
          duration: 3000,
          icon: closeCircleOutline
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
              Reset Password
            </h5>

            <p class="mt-4 text-center">
              Enter your new password
            </p>

            <form class="mt-8" @submit.prevent="handleSubmitForm">
              <div class="flex flex-col gap-4 text-left mb-8">
                <!-- Password -->
                <InputComponent
                    v-model="password"
                    placeholder="Password"
                    type="password"
                    data-cy="password"
                    :disabled="isValidating"
                >
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Password -->

                <!-- Confirm Password -->
                <InputComponent
                    v-model="confirmPassword"
                    placeholder="Confirm password"
                    type="password"
                    data-cy="confirm-password"
                    :disabled="isValidating"
                >
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Confirm Password -->
              </div>

              <ion-button
                  expand="block"
                  shape="round"
                  type="submit"
                  :disabled="isSubmitting"
                  data-cy="submit-button"
              >
                Confirm
              </ion-button>
            </form>

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