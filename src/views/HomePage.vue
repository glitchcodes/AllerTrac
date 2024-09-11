<script setup lang="ts">
  import { computed } from "vue";
  import {IonPage, IonContent, IonIcon, IonChip, IonSkeletonText} from '@ionic/vue';
  import { fastFood } from "ionicons/icons";
  import { useAuthStore } from "@/store/auth";

  import FactCarousel from "@/components/FactCarousel.vue";
  import SkeletonCard from "@/components/skeleton/SkeletonCard.vue";
  import FactCategorySlider from "@/components/FactCategorySlider.vue";
  import SkeletonChipSlider from "@/components/skeleton/SkeletonChipSlider.vue";

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

      <div class="bg-white rounded-2xl shadow-xl p-5 mt-4">
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

      <Suspense>
        <FactCategorySlider class="mt-2 mb-4" />

        <template #fallback>
          <SkeletonChipSlider class="mt-2 mb-4" />
        </template>
      </Suspense>

      <Suspense>
        <FactCarousel />

        <template #fallback>
          <div class="mt-4 overflow-x-auto scroll-smooth flex flex-nowrap snap-mandatory snap-x">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </template>
      </Suspense>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-chip {
  --background: #417776;
}
</style>
