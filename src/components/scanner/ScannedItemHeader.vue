<script setup lang="ts">
  import { computed } from "vue";
  import { IonChip, IonIcon, IonLabel } from "@ionic/vue";
  import { alertCircleOutline } from "ionicons/icons";
  import { useAllergenStore } from "@/store/allergen";

  import type { FoodvisorFood } from "@/types/Foodvisor";
  import type { Allergen } from "@/types/Allergen";

  const allergenStore = useAllergenStore();

  const props = defineProps<{
    food: FoodvisorFood
  }>();

  const foodName = computed(() => {
    return props.food.food_info.display_name
  })

  const confidence = computed(() => {
    return parseFloat((props.food.confidence * 100).toFixed(2));
  })

  const chipColor = computed(() => {
    let chipClass: string;

    if (confidence.value > 90) {
      chipClass = 'success';
    } else if (confidence.value > 70) {
      chipClass = 'warning';
    } else {
      chipClass = 'danger';
    }

    return chipClass;
  });

  /**
   * This function is responsible for checking which allergens are relevant to the user
   * Note: Available for logged-in users only
   *
   * @returns computed<Allergen[]>
   */
  const relevantAllergens = computed(() => {
    const detected: Allergen[] = [];
    const allergens = JSON.parse(JSON.stringify(props.food.food_info.allergens));
    const userAllergens = allergenStore._allergens;

    allergens.forEach((allergen: Allergen) => {
      if (userAllergens.some(item => item.name.includes(allergen.name))) {
        detected.push(allergen)
      }
    })

    return detected;
  });
</script>

<template>
  <ion-label>
    <div class="flex items-center gap-3">
      <ion-chip :color="chipColor" class="shadow">
        <small>
          {{ confidence }}%
        </small>
      </ion-chip>
      <h3 class="flex-1">
        {{ foodName }}
      </h3>
      <ion-icon v-if="relevantAllergens.length > 0" :icon="alertCircleOutline" color="danger" />
    </div>
  </ion-label>
</template>

<style scoped lang="scss">

</style>