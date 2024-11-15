<script setup lang="ts">
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import { fastFood } from "ionicons/icons";
import { ref, onMounted } from "vue";
import { useFetchAPI } from '@/composables/useFetchAPI';

const facts = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Modify the fetch to request facts
onMounted(async () => {
  isLoading.value = true; // Start loading state
  try {
    const response = await useFetchAPI({
      url: '/facts/recent', // Assuming '/facts/facts' is your endpoint
      method: 'GET',
      // No data needed for a GET request (unless you're adding query parameters)
    });
    facts.value = response.data.facts;
  } catch (error) {
    console.error("Error fetching data:", error);
    error.value = error; // Store the error
  } finally {
    isLoading.value = false; // End loading state
  }
});


</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="flex items-center mb-2">
        <ion-icon class="text-2xl primary" aria-hidden="true" :icon="fastFood" />
        <h5 class="font-bold ms-2 mt-1 ">
          Explore about food allergies!
        </h5>
      </div>

      <img class="w-[130px] my-5 mx-auto" src="/images/facts/facts-logo.png" alt="Food" />

      <!-- Display list of facts -->
      <ul v-if="!isLoading && !error">
        <li v-for="(fact, index) in facts" :key="index">
          <router-link :to="{ name: fact.source, params: { id: fact.id } }" class="font-bold hover:underline">
            <button
                class="bg-white rounded-2xl drop-shadow-xl p-3 bg-cover bg-center px-5 mt-2 min-w-full min-h-100 max-h-[100] snap-center flex flex-col-reverse space-y-reverse bg-opacity-1 hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition duration-300 ease-in-out"
                :style="{ backgroundImage: `url(${fact.coverImage}`}"
            >
              <h6 class="text-sm text-[#F4EDEF]" style="text-shadow: 4px 4px 6px rgba(0, 0, 0, 1);">{{ fact.subtext }}</h6>
              <h3 class="font-bold text-lg text-[#F4EDEF]" style="text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.7);">{{ fact.name }}</h3>
            </button>
          </router-link>
        </li>
      </ul>
      <div v-else-if="isLoading">
        <div class="flex justify-center items-center">
          <ion-spinner name="crescent" class="text-primary text-3xl"></ion-spinner>
          <p class="text-lg text-primary font-bold">Loading...</p>
        </div>
      </div>
      <div v-else-if="error">
        Error loading facts: {{ error.message }}
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
//ion-content {
//  --ion-background-color: transparent;
//  background-image: url("/images/auth-bg.png");
//  background-size: cover;
//  opacity: 1;
//}
</style>