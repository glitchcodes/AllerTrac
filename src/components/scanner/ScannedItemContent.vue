<script setup lang="ts">
  import { computed } from "vue";
  import { IonLabel, IonChip, IonIcon } from "@ionic/vue";
  import { alertCircleOutline } from "ionicons/icons";
  import { useAllergenStore } from "@/store/allergen";
  import type {FoodvisorFood} from "@/types/Foodvisor";

  const allergenStore = useAllergenStore();

  const props = defineProps<{
    food: FoodvisorFood
  }>();

  const allergens = computed(() => {
    return props.food.food_info.allergens;
  });

  const isAllergic = (allergen: string) => {
    const userAllergens = allergenStore._allergens;

    return userAllergens.some(item => item.name.includes(allergen));
  }
</script>

<template>
  <div v-if="allergens && allergens.length > 0">
    <p class="text-sm mb-2">
      This food may contain the following:
    </p>

    <ion-chip v-for="(allergen, index) in allergens"
              :key="index" :color="isAllergic(allergen.name) ? 'danger' : 'primary'">
      <ion-icon v-if="isAllergic(allergen.name)" :icon="alertCircleOutline"></ion-icon>
      <ion-label>{{ allergen.name }}</ion-label>
    </ion-chip>
  </div>
  <p v-else class="text-sm">
    No allergens were found for this ingredient
  </p>
</template>

<style scoped lang="scss">

</style>