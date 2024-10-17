<script setup lang="ts">
  import { ref, watchEffect } from "vue";
  import { IonChip, IonLabel, IonIcon } from "@ionic/vue";
  import { addCircleOutline, removeCircleOutline } from "ionicons/icons";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useAuthStore } from "@/store/auth";
  import type { Allergen } from "@/types/Allergen";

  const emit = defineEmits<{
    (event: 'change', isChanged: boolean): void
  }>();

  const authStore = useAuthStore();
  const model = defineModel();

  const previousAllergens = ref<string>('');
  const allergens = ref<Allergen[]>([]);
  const selectedAllergens = ref<Allergen[]>([]);

  watchEffect(() => {
    model.value = selectedAllergens.value

    // Compare and emit an event when the selected allergens are changed
    const currentAllergens = JSON.stringify(selectedAllergens.value);

    if (currentAllergens !== previousAllergens.value) {
      emit('change', true);
    } else {
      emit('change', false);
    }
  })

  // Fetch user allergens
  const fetchUserAllergens = async () => {
    try {
      const response = await useFetchAPI({
        url: '/user/allergens',
        method: 'GET'
      });

      const userAllergens: Allergen[] = response.data.allergens

      userAllergens.forEach((allergen) => {
        selectedAllergens.value.push(allergen);

        // Remove it from the list
        const index = allergens.value.map(item => item.id).indexOf(allergen.id)
        allergens.value.splice(index, 1);
      })

      // Store it as previous allergens
      previousAllergens.value = JSON.stringify(selectedAllergens.value)
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch allergens from the database
  try {
    const response = await useFetchAPI({
      url: '/allergens',
      method: 'GET'
    });

    allergens.value = response.data.allergens;

    if (authStore._isLoggedIn) {
      await fetchUserAllergens()
    }
  } catch (error) {
    console.error(error)
  }

  const handleChipSelect = (index: number) => {
    const allergen = allergens.value[index];

    // Push the allergen into selected array
    selectedAllergens.value.push(allergen);

    // Remove it from the allergen list
    allergens.value.splice(index, 1);
  }

  const handleChipDeselect = (index: number) => {
    const allergen = selectedAllergens.value[index];

    // Push the allergen back into the original list
    allergens.value.push(allergen);

    // Remove it from the selected allergens list
    selectedAllergens.value.splice(index, 1);
  }
</script>

<template>
  <div class="bg-[#43727a] p-4 rounded-lg text-white transition-all min-h-[310px]">
    <div class="mb-4">
      <h5 class="font-bold my-1">Selected Allergens</h5>
      <div v-if="selectedAllergens.length > 0">
        <transition-group name="fade">
          <ion-chip v-for="(allergen, index) in selectedAllergens" :key="index" @click="handleChipDeselect(index)">
            <ion-label>{{ allergen.name }}</ion-label>
            <ion-icon :icon="removeCircleOutline"></ion-icon>
          </ion-chip>
        </transition-group>
      </div>
      <p v-else>
        Nothing selected yet
      </p>
    </div>

    <div>
      <h5 class="font-bold my-1">Allergens</h5>
      <div v-if="allergens.length > 0">
        <transition-group name="fade">
          <ion-chip v-for="(allergen, index) in allergens" :key="index" @click="handleChipSelect(index)">
            <ion-label>{{ allergen.name }}</ion-label>
            <ion-icon :icon="addCircleOutline"></ion-icon>
          </ion-chip>
        </transition-group>
      </div>
      <p v-else>
        No more allergens
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  ion-chip {
    --background: #fff
  }
</style>