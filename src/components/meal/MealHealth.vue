<script setup lang="ts">
  import { computed } from "vue";
  import { IonChip } from "@ionic/vue";
  import { useAllergenStore } from "@/store/allergen";
  import InfoAlert from "@/components/alert/InfoAlert.vue";
  import WarningAlert from "@/components/alert/WarningAlert.vue";

  const props = defineProps<{
    healthLabels: string[]
  }>();

  const allergenStore = useAllergenStore();

  const isStringInArray = (str: string, arr: string[]): boolean => {
    return arr.some(item => item.includes(str));
  }

  const allergensDetected = computed(() => {
    const allergens = allergenStore._allergens;
    const detectedArr: string[] = [];

    allergens.forEach((allergen) => {
      const encodedStr = allergen.name.replace(/\s+/g, '-');

      if (!isStringInArray(encodedStr, props.healthLabels)) {
        detectedArr.push(allergen.name);
      }
    })

    return detectedArr;
  });
</script>

<template>
  <div>
    <div v-if="allergensDetected.length > 0" class="mb-4">
      <WarningAlert class="mb-4">
        Based from your selected allergens, these labels are missing:
      </WarningAlert>

      <ion-chip v-for="label in allergensDetected" :key="label" color="danger">
        {{ label }}-Free
      </ion-chip>
    </div>

    <InfoAlert class="mb-4">
      Edamam reported these labels for this meal:
    </InfoAlert>
    <ion-chip v-for="label in props.healthLabels" :key="label" color="secondary">
      {{ label }}
    </ion-chip>
  </div>
</template>

<style scoped lang="scss">

</style>