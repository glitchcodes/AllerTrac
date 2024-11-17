<script setup lang="ts">
  import { ref } from "vue";
  import { IonChip, IonLabel } from "@ionic/vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import type { FactCategory } from "@/types/FactCategory";

  const categories = ref<FactCategory[]>();

  try {
    const response = await useFetchAPI({
      url: '/facts/category/random',
      method: 'GET'
    })

    categories.value = response.data.categories;
  } catch (error) {
    console.error(error);
  }
</script>

<template>
  <div class="overflow-x-auto scroll-smooth flex flex-nowrap space-x-2 no-scrollbar">
    <ion-chip v-for="category in categories" :key="category.id" :router-link="'/facts/' + category.id" class="overflow-visible">
      <ion-label class="text-nowrap text-white">{{ category.name }}</ion-label>
    </ion-chip>
  </div>
</template>

<style scoped lang="scss">
  ion-chip {
    --background: #417776;
  }
</style>