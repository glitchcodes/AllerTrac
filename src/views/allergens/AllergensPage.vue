<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fastFood } from "ionicons/icons";
import { IonPage, IonContent, IonIcon } from '@ionic/vue';

const route = useRoute();
const allergens = ref([
  {
    id: 1,
    name: "Shellfish",
    title: "This is a dummy fact 1",
    subtext: "Learn about shellfish allergies.",
    source: "Food Allergy Research & Education (FARE)",
    path: "allergensPage",
    description: "Shellfish allergy is one of the most common food allergies known to mankind.",
    coverImage: "/images/allergies/shellfish.jpg",
    references: "https://example.com/reference1"
  },

  // Add more facts as needed
]);

const selectedAllergen = computed(() => {
  return allergens.value.find((allergen) => allergen.id === parseInt(route.params.id));
});
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <!-- Display details of the selected allergen -->
      <div class="bg-[#417776] rounded-2xl shadow-xl my-5 p-5 justify-center min-h-[8rem] flex flex-col ">
        <h2 class="text-3xl font-bold text-white mb-1">
          {{ selectedAllergen.name }} Allergy
        </h2>
        <p class="text-xs text-white">
          Based on an article from {{ selectedAllergen.source }}.
        </p>
      </div>
      <div class="bg-white rounded-2xl shadow-xl my-5 p-5  flex flex-col min-h-full">
        <div class="space-y-4 " v-if="selectedAllergen">
          <img class="w-full max-h-40 rounded-2xl object-cover" :src="selectedAllergen.coverImage" alt="Food" />
          <h2 class="text-3xl font-bold text-[#417776] mb-1">
            Overview
          </h2>
          <p class="my-5 mx-5 text-justify">{{ selectedAllergen.description }}</p>
          <div class="min-w-full pt-10">
            <p>Reference/s: </p>
            <p class="italic text-sm text-justify">{{ selectedAllergen.references }}</p>
          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>