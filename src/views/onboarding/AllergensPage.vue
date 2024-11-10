<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { IonContent, IonPage, IonButton } from "@ionic/vue";
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
  import { useRouter } from "vue-router";
  import { useAllergenStore } from "@/store/allergen";
  import AllergenSelector from "@/components/AllergenSelector.vue";
  import SkeletonAllergens from "@/components/skeleton/SkeletonAllergens.vue";
  import type { Allergen } from "@/types/Allergen";

  const router = useRouter();
  const allergenStore = useAllergenStore();

  const allergens = ref<Allergen[]>();
  const statusBarHeight = ref<number>(0);

  onMounted(async () => {
    statusBarHeight.value = (await SafeArea.getStatusBarHeight()).height;
  })

  const handleSubmitForm = async () => {
    try {
      // Update allergens
      await allergenStore.updateAllergens(allergens.value)

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
    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center gap-4"  :style="{ marginTop: `${statusBarHeight}px` }">
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