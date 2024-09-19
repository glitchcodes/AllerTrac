<script setup lang="ts">
  import { ref } from "vue";
  import { IonIcon, IonButton, IonSpinner, isPlatform } from "@ionic/vue";
  import { checkmarkCircleOutline, fastFood, save } from "ionicons/icons";
  import { useAllergenForm } from "@/composables/useAllergenForm";
  import { useToastController } from "@/composables/useToastController";
  import SkeletonAllergens from "@/components/skeleton/SkeletonAllergens.vue";
  import AllergenSelector from "@/components/AllergenSelector.vue";
  import type { Allergen } from "@/types/Allergen";

  const { updateAllergens } = useAllergenForm();
  const { presentToast } = useToastController()

  const allergens = ref<Allergen[]>();
  const isSaving = ref<boolean>(false);
  const hasEdited = ref<boolean>(false);

  const handleChangeEvent = (e: boolean) => {
    hasEdited.value = e;
  }

  const handleSaveEvent = async () => {
    isSaving.value = true;

    try {
      // Update allergens
      await updateAllergens(allergens.value)

      // Show toast
      await presentToast({
        message: 'Your allergens have been updated',
        position: 'bottom',
        positionAnchor: 'scan-food-button',
        duration: 3000,
        icon: checkmarkCircleOutline
      })

      // Disable the save button
      hasEdited.value = false;
    } catch (error) {
      console.error(error)
    }

    isSaving.value = false;
  }
</script>

<template>
  <div class="bg-white shadow-md p-4 rounded-lg">
    <div class="flex flex-grow items-center text-2xl gap-2 mb-4 min-h-[44px]">
      <ion-icon :icon="fastFood" />

      <h6 class="font-bold text-xl flex-grow">
        Allergies
      </h6>

      <template v-if="!isSaving">
        <ion-button v-if="isPlatform('ios')" fill="outline" :disabled="!hasEdited" @click="handleSaveEvent">
          <ion-icon slot="icon-only" aria-label="Save" :icon="save"></ion-icon>
        </ion-button>

        <ion-button v-else fill="outline" shape="round" :disabled="!hasEdited" @click="handleSaveEvent">
          <ion-icon slot="start" aria-label="Save" :icon="save"></ion-icon>
          <span class="ms-1">Save</span>
        </ion-button>
      </template>

      <template v-else>
        <ion-button v-if="isPlatform('ios')" fill="outline" disabled>
          <ion-spinner slot="icon-only"></ion-spinner>
        </ion-button>

        <ion-button v-else fill="outline" shape="round" disabled>
          <ion-spinner></ion-spinner>
          <span class="ms-2">Saving</span>
        </ion-button>
      </template>
    </div>

    <Suspense>
      <AllergenSelector v-model="allergens" @change="handleChangeEvent" />

      <template #fallback>
        <SkeletonAllergens />
      </template>
    </Suspense>
  </div>

</template>

<style scoped lang="scss">
  ion-spinner {
    width: 20px;
    height: 20px;
  }
</style>