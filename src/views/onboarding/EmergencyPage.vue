<script setup lang="ts">
  import { onMounted, reactive, ref } from "vue";
  import { useRouter } from "vue-router";
  import { IonButton, IonContent, IonIcon, IonPage, loadingController } from "@ionic/vue";
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
  import { call, heart, mail, person } from "ionicons/icons";
  import { useAlertController } from "@/composables/useAlertController";
  import { useContactStore } from "@/store/contact";
  import TextInput from "@/components/auth/input/TextInput.vue";
  import SelectInput from "@/components/auth/input/SelectInput.vue";
  import FetchError from "@/utils/errors/FetchError";
  import type { EmergencyContact } from "@/types/EmergencyContact";

  const router = useRouter();
  const contactStore = useContactStore();
  const alertController = useAlertController()
  const statusBarHeight = ref<number>(0);

  onMounted(async () => {
    statusBarHeight.value = (await SafeArea.getStatusBarHeight()).height;
  });

  const relationships = [
      'parent',
      'spouse',
      'sibling',
      'child',
      'other'
  ];

  const form = reactive<EmergencyContact>({
    full_name: '',
    relationship: 'parent',
    phone_number: '',
    email: '',
  });

  const inputErrors = ref<any>({});

  const handleSaveChanges = async () => {
    // Show loading modal
    const isSubmitting = await loadingController.create({
      message: 'Adding contact...'
    });

    await isSubmitting.present();

    // Submit to the backend
    try {
      await contactStore.createContact({
        ...form,
        phone_number: form.phone_number.replace(/\s/g,'')
      })

      // Dismiss the loading modal
      await isSubmitting.dismiss()

      await router.push({
        name: 'onboarding-final'
      })
    } catch (error) {
      // Dismiss loading modal
      if (error instanceof FetchError) {
        switch (error.data.code) {
          case "INPUT_INVALID":
            inputErrors.value = error.data.errors;
            break;
          default:
            // Show another alert error
            await alertController.presentAlert({
              header: "Something went wrong",
              message: error.data.message
            })
        }
      }
      // Dismiss the loading modal
      await isSubmitting.dismiss()
    }
  }
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center gap-4"  :style="{ marginTop: `${statusBarHeight}px` }">
        <!-- <LogoComponent /> -->

        <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

          <div class="flex flex-col gap-4">
            <h5 class="text-primary text-2xl font-bold text-center">
              For your safety
            </h5>

            <p class="text-center text-sm">
              AllerTrac to the rescue! Press that emergency button for a loud alert and a quick call to your emergency contacts.
            </p>

            <p class="text-center text-sm">
              All set to tackle those unexpected allergic reactions like a superhero!
            </p>

            <img class="w-[120px] mx-auto" src="/images/onboarding-red.png" alt="Alert"/>
          </div>

          <div class="flex flex-col gap-4 mt-8">
            <h5 class="text-primary text-2xl font-bold text-center">
              Emergency Contact
            </h5>

            <p class="text-center text-sm">
              Start by adding one emergency contact to your profile.
            </p>

            <p class="text-center text-sm">
              You can add more on the profile page.
            </p>

            <div class="flex flex-col gap-4 my-4">
              <!-- Full name -->
              <TextInput v-model="form.full_name" placeholder="Full name" type="text" :errors="inputErrors.full_name">
                <template v-slot:icon>
                  <ion-icon aria-hidden="true" :icon="person" />
                </template>
              </TextInput>
              <!-- END Full name -->

              <!-- Relationship -->
              <SelectInput v-model="form.relationship" :options="relationships" label="Relationship" :errors="inputErrors.relationship">
                <template v-slot:icon>
                  <ion-icon aria-hidden="true" :icon="heart" />
                </template>
              </SelectInput>
              <!-- END Relationship -->

              <!-- Phone number -->
              <div>
                <TextInput v-model="form.phone_number" placeholder="Phone number" type="tel" :errors="inputErrors.phone_number">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="call" />
                  </template>
                </TextInput>
              </div>
              <!-- END Phone number -->

              <!-- Email Address -->
              <TextInput v-model="form.email" placeholder="Email" type="text" :errors="inputErrors.email">
                <template v-slot:icon>
                  <ion-icon aria-hidden="true" :icon="mail" />
                </template>
              </TextInput>
              <!-- END Email Address -->
            </div>
          </div>

          <div class="flex mt-6">
            <ion-button router-link="/o/allergies" router-direction="back" fill="outline" shape="round" class="w-full">
              Back
            </ion-button>
            <ion-button shape="round" class="w-full" @click="handleSaveChanges">
              Next
            </ion-button>
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