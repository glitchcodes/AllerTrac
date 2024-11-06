<script setup lang="ts">
  import { IonChip, IonIcon, IonLabel, modalController } from "@ionic/vue";
  import { alertCircleOutline, closeOutline } from "ionicons/icons";
  import { useAllergenStore } from "@/store/allergen";
  import type { Allergen } from "@/types/Allergen";

  const props = defineProps<{
    title: string
    allergens: Allergen[] | null
  }>()

  const allergenStore = useAllergenStore();

  const isAllergic = (allergen: string) => {
    const userAllergens = allergenStore._allergens;

    return userAllergens.some(item => item.name.includes(allergen));
  }

  const dismissModal = async () => await modalController.dismiss();
</script>

<template>
  <div class="p-5">
    <div class="flex items-center mb-4">
      <h1 class="text-xl font-bold flex-1">
        {{ props.title }}
      </h1>
      <ion-icon aria-label="Close dialog" :icon="closeOutline" class="size-6" @click="dismissModal" />
    </div>

    <div v-if="props.allergens && props.allergens.length > 0">
      <p class="mb-2">
        This ingredient may contain the following:
      </p>

      <ion-chip v-for="(allergen, index) in props.allergens"
                :key="index" :color="isAllergic(allergen.name) ? 'danger' : 'primary'">
        <ion-icon v-if="isAllergic(allergen.name)" :icon="alertCircleOutline"></ion-icon>
        <ion-label>{{ allergen.name }}</ion-label>
      </ion-chip>
    </div>

    <p v-else>
      No allergens were found for this ingredient
    </p>
  </div>
</template>

<style scoped lang="scss">

</style>