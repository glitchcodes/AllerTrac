<script setup lang="ts">
  import { ref } from "vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";

  import MealComponent from "@/components/meal/MealComponent.vue";

  import FetchError from "@/utils/errors/FetchError";
  import type { EdamamRecipes, EdamamResult } from "@/types/Edamam";

  const props = defineProps<{
    query: string
  }>();

  const meals = ref<EdamamRecipes[]>([]);

  const searchMeal = async (query: string) => {
    if (query.length <= 1) return;

    const encodedQuery = encodeURIComponent(query);

    try {
      const response = await useFetchAPI({
        url: `/meal/search?query=${encodedQuery}`,
        method: 'GET'
      });

      const result = response.data.payload as EdamamResult;

      meals.value = result.hits
    } catch (error) {
      if (error instanceof FetchError) {
        // TODO: Handle errors
      }
    }
  }

  await searchMeal(props.query);
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <template v-for="(meal, index) in meals" :key="index">
      <MealComponent :meal="meal.recipe" :links="meal._links"></MealComponent>
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>