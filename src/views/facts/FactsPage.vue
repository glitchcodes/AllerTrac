<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fastFood } from "ionicons/icons";
import { IonPage, IonContent, IonIcon } from '@ionic/vue';

const route = useRoute();
const facts = ref([
  {
    id: 1,
    name: "Common Allergens",
    title: "This is a dummy fact 1",
    subtext: "Learn about common allergens.",
    source: "https://example.com/source1",
    path: "https://example.com/source1",
    description: "This is a brief description of the dummy fact 1",
    coverImage: "/images/facts/common-allergens.jpg",
    factImage: "https://example.com/fact-image1.jpg",
    references: "https://example.com/reference1"
  },

  // Add more facts as needed
]);

const selectedFact = computed(() => {
  return facts.value.find((facts) => fact.id === parseInt(route.params.id));
});
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="flex items-center mb-2">
        <ion-icon class="text-2xl primary" aria-hidden="true" :icon="fastFood" />
        <h1 class="font-bold ms-2 mt-1 text-2xl">
          {{ selectedFact ? selectedFact.name : '' }} Allergy
        </h1>
      </div>
      <!-- Display details of the selected allergen -->
      <div class="space-y-4" v-if="selectedFact">
        <div
            class="bg-white rounded-2xl drop-shadow-xl p-3 bg-cover bg-center px-5 mt-2 min-w-full min-h-[30vh]  snap-center flex flex-col-reverse space-y-reverse bg-opacity-1"
            :style="{ backgroundImage: `url(${selectedFact.coverImage}`}"
        >
        </div>
        <div class="flex items-center mb-2 min-w-full">
          <p class="italic font-mono">Source: </p>
          <p class="italic mx-2 font-mono">{{ selectedFact.source }}</p>
        </div>
        <p class="my-5">{{ selectedFact.description }}</p>
        <div class="min-w-full bottom-0">
          <p>Reference/s: </p>
          <p class="italic text-sm font-mono">{{ selectedFact.references }}</p>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>