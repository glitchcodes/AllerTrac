<script setup lang="ts">
  import { computed } from "vue";
  import { IonPage, IonContent, IonIcon } from '@ionic/vue';
  import { fastFood } from "ionicons/icons";
  import { useAuthStore } from "@/store/auth";

  const authStore = useAuthStore();

  const full_name = computed(() => {
    if (authStore._user) {
      const user = authStore._user;

      return `${user.first_name} ${user.last_name}`;
    }

    return 'John Doe'
  })
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="flex items-center mb-2">
        <ion-icon class="text-2xl primary" aria-hidden="true" :icon="fastFood" />
        <h5 class="font-bold ms-2 mt-1">
          About to eat?
        </h5>
      </div>
      <h1 class="text-3xl font-bold mt-2">
        {{ full_name }}
      </h1>

      <div class="bg-white rounded-2xl shadow-xl p-5 mt-2">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl text-primary font-bold mb-3">
              Feeling better!
            </h2>
            <p class="text-[11px]">
              Scan your preferred food to view the ingredients and ensure it's safe for any allergies you might have!
            </p>
          </div>
          <img class="w-[130px]" src="/food1.png" alt="Food" />
        </div>
      </div>

      <div class="rounded-md flex justify-between mt-5">
        <h5 class="font-bold mt-1 mx-[1px]">
          Here are some facts!
        </h5>
        <h5 class="font-bold mt-1 hover:underline">
          <router-link :to="{ name: 'register' }" class="font-bold hover:underline">See All </router-link>
        </h5>
      </div>

      <div class="mt-4 overflow-x-auto scroll-smooth flex flex-nowrap space-x-4">
        <button class="bg-[#417776] text-sm rounded-2xl font-bold text-[#F4EDEF] px-4 py-2 hover:bg-[#3b6967] text-nowrap items-center">Common Allergens</button>
        <button class="bg-[#417776] text-sm rounded-2xl font-bold text-[#F4EDEF] px-4 py-2 hover:bg-[#3b6967] text-nowrap items-center">Food Allergy</button>
        <button class="bg-[#417776] text-sm rounded-2xl font-bold text-[#F4EDEF] px-4 py-2 hover:bg-[#3b6967] text-nowrap items-center">Emergency Plan</button>
        <button class="bg-[#417776] text-sm rounded-2xl font-bold text-[#F4EDEF] px-4 py-2 hover:bg-[#3b6967] text-nowrap items-center">Recipes</button>
      </div>

      <div class="mt-4 overflow-x-auto scroll-smooth flex flex-nowrap snap-mandatory snap-x">
        <div class="rounded-2xl shadow-xl mx-2 p-4 bg-cover bg-center min-h-96 min-w-80 max-h-96 max-w-80 overflow-hidden snap-center flex flex-col-reverse space-y-4 space-y-reverse" style="background-image: url('/images/allergies/shellfish.jpg');">
          <div class="p-4 bg-[#417776] rounded-lg opacity-90">
            <h3 class="font-bold text-lg text-[#F4EDEF]">Shellfish Allergy</h3>
            <p class="text-sm text-black">Shellfish allergy is an atypical response by the body's immune system to proteins in certain marine animals.</p>
          </div>
        </div>
        <div class="rounded-2xl shadow-xl mx-2 p-4 bg-cover bg-center min-h-96 min-w-80 max-h-96 max-w-80 overflow-hidden snap-center flex flex-col-reverse space-y-4 space-y-reverse" style="background-image: url('/images/allergies/fish.jpg');">
          <div class="bottom-100 left-4 w-full p-4 bg-[#417776] rounded-lg opacity-90">
            <h3 class="font-bold text-lg text-[#F4EDEF]">Fish Allergy</h3>
            <p class="text-sm text-black">Fish allergy is a common food allergy that can cause severe reactions.</p>
          </div>
        </div>
        <div class="rounded-2xl shadow-xl mx-2 p-4 bg-cover bg-center min-h-96 min-w-80 max-h-80 max-w-80 overflow-hidden snap-center flex flex-col-reverse space-y-4 space-y-reverse" style="background-image: url('/images/allergies/nut.jpg');">
          <div class="bottom-4 left-4 w-full p-4 bg-[#417776] rounded-lg opacity-90">
            <h3 class="font-bold text-lg text-[#F4EDEF]">Nut Allergy</h3>
            <p class="text-sm text-black">Peanut allergy is one of the most common causes of severe food allergies.</p>
          </div>
        </div>
        <div class="rounded-2xl shadow-xl mx-2 p-4 bg-cover bg-center min-h-96 min-w-80 max-h-80 max-w-80 overflow-hidden snap-center flex flex-col-reverse space-y-4 space-y-reverse" style="background-image: url('/images/allergies/allergies.jpg');">
          <button class="bottom-4 left-4 w-full p-4 bg-[#417776] rounded-lg opacity-90">
            <h3 class="font-bold text-lg text-[#F4EDEF]">See All</h3>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>
