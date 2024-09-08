<script setup lang="ts">
import { ref,} from "vue";
import { useRouter } from "vue-router";

import { IonPage, IonContent, IonIcon, IonButton, IonSpinner } from '@ionic/vue';
import {person, call, alertCircle, people, mail} from "ionicons/icons";
import TextInput from "@/components/auth/input/TextInput.vue";

import { useToastController } from "@/composables/useToastController";
import { useFetchAPI } from "@/composables/useFetchAPI";
import FetchError from "@/utils/errors/FetchError";
import LogoComponent from "@/components/auth/LogoComponent.vue";

const router = useRouter();
const toast = useToastController();

const inputErrors = ref<any>({});

const isSubmitting = ref<boolean>(false);

const first_name = ref<string>('');
const last_name = ref<string>('');
const phone_number = ref<string>('');
const birthday = ref<string>('');

/*// Get current user information
onMounted(async () => {
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
})*/

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
    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col h-full items-center justify-center gap-4">
           <LogoComponent />

          <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

            <h5 class="text-primary text-2xl font-bold text-center">
              For Your Safety
            </h5>

            <div class="my-2 items-center">
              <p class="text-center text-[12px]">AllerTrac to the rescue! Press that emergency button for a loud alert and a quick call to your emergency contacts. All set to tackle those unexpected allergic reactions like a superhero!</p>
              <img class="w-[80px] mx-auto fill-red-600" src="/images/emergency-button.png" alt="Alert Icon"/>
            </div>

            <h5 class="text-primary text-2xl font-bold text-center">
              Emergency Contacts
            </h5>

            <div class="my-2 items-center">
              <p class="text-center text-[12px]">A maximum of 2 emergency contacts <br> You can add more on <br> the profile page</p>
            </div>

            <form @submit.prevent="submitForm">
              <div class="flex flex-col gap-4 text-left mb-6">
                <!-- Fullname -->
                <TextInput v-model="first_name" placeholder="Fullname" type="text" :errors="inputErrors.first_name">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="person" />
                  </template>
                </TextInput>
                <!-- END First name -->

                <!-- Relationship -->
                <TextInput v-model="last_name" placeholder="Relationship" type="text" :errors="inputErrors.last_name">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="people" />
                  </template>
                </TextInput>
                <!-- END Last name -->

                <!-- Phone number -->
                <TextInput v-model="phone_number" placeholder="Phone Number" type="text" :errors="inputErrors.last_name">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="call" />
                  </template>
                </TextInput>
                <!-- END Last name -->

                <!-- Mail -->
                <TextInput v-model="email" placeholder="Email" type="text" :errors="inputErrors.last_name">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="mail" />
                  </template>
                </TextInput>
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