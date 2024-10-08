<script setup lang="ts">
  import { ref } from "vue";
  import { IonContent, IonPage, IonButton } from "@ionic/vue";
  import { useRouter } from "vue-router";
  import { useAllergenForm } from "@/composables/useAllergenForm";
  import AllergenSelector from "@/components/AllergenSelector.vue";
  import SkeletonAllergens from "@/components/skeleton/SkeletonAllergens.vue";
  import type { Allergen } from "@/types/Allergen";

  const router = useRouter();
  const { updateAllergens } = useAllergenForm()

  const allergens = ref<Allergen[]>();

  const handleSubmitForm = async () => {
    try {
      // Update allergens
      await updateAllergens(allergens.value)

      // Redirect to final onboarding page
      await router.push({
        name: 'onboarding-final'
      })
    } catch (error) {
      console.error(error)
    }
  }
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col h-full items-center justify-center gap-4">
          <!-- <LogoComponent /> -->

          <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

            <h5 class="text-primary text-2xl font-bold text-center">
              Allergy can be troublesome
            </h5>

            <p class="mt-4 text-center">
              Ready to play detective with AllerTrac? Time to pick out the sneaky allergens hiding in your meals from the list below!
            </p>

            <img class="w-[120px] mx-auto my-4" src="/images/onboarding-allergens-1.png" alt="Food Bowl"/>

            <Suspense>
              <AllergenSelector v-model="allergens" />

              <template #fallback>
                <SkeletonAllergens />
              </template>
            </Suspense>

            <div class="flex mt-6">
              <ion-button router-link="/o/welcome" router-direction="back" fill="outline" shape="round" class="w-full">
                Back
              </ion-button>
              <ion-button shape="round" class="w-full" @click="handleSubmitForm">
                Next
              </ion-button>
            </div>
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