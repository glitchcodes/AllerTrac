<script setup lang="ts">
  import { computed } from "vue";
  import {
    IonLabel,
    IonChip,
    IonIcon,
    IonList,
    IonItem,
    modalController
  } from "@ionic/vue";
  import { alertCircleOutline } from "ionicons/icons";
  import { useAllergenStore } from "@/store/allergen";
  import InfoAlert from "@/components/alert/InfoAlert.vue";
  import type { FoodvisorFood, FoodvisorFoodInfo } from "@/types/Foodvisor";
  import type { Allergen } from "@/types/Allergen";
  import FoodInfoDialog from "@/components/dialog/FoodInfoDialog.vue";

  const allergenStore = useAllergenStore();

  const props = defineProps<{
    foods: FoodvisorFood[]
  }>();

  /**
   * Get the allergens from the first food
   *
   * @returns Allergen[]
   */
  const allergens = computed(() => {
    return props.foods[0].food_info.allergens;
  });

  const computedConfidence = (value: number) => {
    return parseFloat((value * 100).toFixed(2));
  }

  const computedChipColor = (confidence: number) => {
    let chipClass: string;

    if (confidence > 85) {
      chipClass = 'success';
    } else if (confidence > 70) {
      chipClass = 'warning';
    } else {
      chipClass = 'danger';
    }

    return chipClass;
  }

  const isAllergic = (allergen: string) => {
    const userAllergens = allergenStore._allergens;

    return userAllergens.some(item => item.name.includes(allergen));
  }

  /**
   * This function is responsible for checking which allergens are relevant to the user
   * Note: Available for logged-in users only
   *
   * @returns Allergen[]
   */
  const containsRelevantAllergens = (allergens: Allergen[]) => {
    const detected: Allergen[] = [];
    const userAllergens = allergenStore._allergens;

    allergens.forEach((allergen: Allergen) => {
      if (userAllergens.some(item => item.name.includes(allergen.name))) {
        detected.push(allergen)
      }
    })

    return detected;
  }

  const openAllergenDialog = async (food: FoodvisorFoodInfo) => {
    const modal = await modalController.create({
      component: FoodInfoDialog,
      componentProps: {
        title: food.display_name,
        allergens: food.allergens
      },
      id: 'food-info-dialog'
    });

    await modal.present();
  }
</script>

<template>
  <div v-if="allergens && allergens.length > 0">
    <p class="text-sm mb-2">
      This ingredient may contain the following:
    </p>

    <div class="flex gap-2">
      <ion-chip v-for="(allergen, index) in allergens"
                :key="index" :color="isAllergic(allergen.name) ? 'danger' : 'primary'">
        <ion-icon v-if="isAllergic(allergen.name)" :icon="alertCircleOutline"></ion-icon>
        <ion-label>{{ allergen.name }}</ion-label>
      </ion-chip>
    </div>
  </div>
  <InfoAlert v-else class="text-sm">
    No allergens were found for this ingredient
  </InfoAlert>

  <div class="mt-5">
    <p class="text-sm mb-2">
      Other possible ingredients:
    </p>
    <ion-list>
      <ion-item v-for="ingredient in props.foods.slice(1)"
                :key="ingredient.food_info.food_id"
                class="ion-no-padding"
                button
                @click="openAllergenDialog(ingredient.food_info)"
      >
        <ion-chip :color="computedChipColor(ingredient.confidence)" slot="start" class="!mr-2">
          <small>
            {{ computedConfidence(ingredient.confidence) }}%
          </small>
        </ion-chip>
        <ion-label class="!text-sm">
          {{ ingredient.food_info.display_name }}
        </ion-label>
        <ion-icon v-if="containsRelevantAllergens(ingredient.food_info.allergens).length > 0"
                  :icon="alertCircleOutline"
                  color="danger"
                  class="size-4"
        />
      </ion-item>
    </ion-list>
  </div>
</template>

<style scoped lang="scss">

</style>