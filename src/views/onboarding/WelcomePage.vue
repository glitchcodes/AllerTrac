<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";

  import { IonPage, IonContent, IonIcon, IonButton, IonSpinner } from '@ionic/vue';
  import { person, call, today, alertCircle } from "ionicons/icons";
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";

  import { useToastController } from "@/composables/useToastController";
  import { useFetchAPI } from "@/composables/useFetchAPI";

  import TextInput from "@/components/auth/input/TextInput.vue";
  import DatePickerInput from "@/components/auth/input/DatePickerInput.vue";

  import FetchError from "@/utils/errors/FetchError";

  const router = useRouter();
  const toast = useToastController();

  const inputErrors = ref<any>({});

  const isSubmitting = ref<boolean>(false);

  const first_name = ref<string>('');
  const last_name = ref<string>('');
  const phone_number = ref<string>('');
  const birthday = ref<string>('');

  const statusBarHeight = ref<number>(0);

  // Get current user information
  onMounted(async () => {
    statusBarHeight.value = (await SafeArea.getStatusBarHeight()).height;

    try {
      const response = await useFetchAPI({
        url: '/user/miniature',
        method: 'GET'
      });

      first_name.value = response.data.user.first_name;
      last_name.value = response.data.user.last_name;
    } catch (error) {
      console.error(error)
    }
  })

  const submitForm = async () => {
    // Show the loading indicator
    isSubmitting.value = true;

    // Reset the errors
    inputErrors.value = {};

    try {
      const body = {
        first_name: first_name.value,
        last_name: last_name.value,
        phone_number: phone_number.value,
        birthday: birthday.value
      }

      await useFetchAPI({
        url: '/user/update-details',
        method: 'PATCH',
        data: JSON.stringify(body)
      });

      await router.push({ name: 'onboarding-allergens' });
    } catch (error) {
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

    isSubmitting.value = false;

  }
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center gap-4" :style="{ marginTop: `${statusBarHeight}px` }">
        <!-- <LogoComponent /> -->

        <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

          <h5 class="text-primary text-2xl font-bold text-center">
            Welcome to AllerTrac!
          </h5>

          <div class="my-8">
            <img class="w-[220px]" src="/images/onboarding-welcome-1.png" alt="Dialogue Box" />
            <img class="w-[160px] ml-auto" src="/images/onboarding-welcome-2.png" alt="Dialogue Box" />
          </div>

          <form @submit.prevent="submitForm">
            <div class="flex flex-col gap-4 text-left mb-6">
              <!-- First name -->
              <TextInput v-model="first_name" placeholder="First name" type="text" :errors="inputErrors.first_name">
                <template v-slot:icon>
                  <ion-icon aria-hidden="true" :icon="person" />
                </template>
              </TextInput>
              <!-- END First name -->

              <!-- Last name -->
              <TextInput v-model="last_name" placeholder="Last name" type="text" :errors="inputErrors.last_name">
                <template v-slot:icon>
                  <ion-icon aria-hidden="true" :icon="person" />
                </template>
              </TextInput>
              <!-- END Last name -->

              <!-- Phone number -->
              <TextInput v-model="phone_number" placeholder="+63 XXX XXX XXXX" type="tel" :errors="inputErrors.phone_number">
                <template v-slot:icon>
                  <ion-icon aria-hidden="true" :icon="call" />
                </template>
              </TextInput>
              <!-- END Last name -->

              <!-- Birthday -->
              <DatePickerInput v-model="birthday" placeholder="Birthday" :errors="inputErrors.birthday">
                <template v-slot:icon>
                  <ion-icon aria-hidden="true" :icon="today" />
                </template>
              </DatePickerInput>
              <!-- END Birthday -->
            </div>

            <ion-button v-if="!isSubmitting" expand="block" shape="round" type="submit" data-cy="submit">
              Next
            </ion-button>

            <ion-button v-if="isSubmitting" expand="block" shape="round" disabled>
                <span class="mr-2">
                  Please wait...
                </span>
              <ion-spinner name="circular"></ion-spinner>
            </ion-button>
          </form>

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

  ion-spinner {
    width: 20px;
    height: 20px;
  }
</style>