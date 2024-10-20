<script setup lang="ts">
  import { ref } from "vue";
  import { IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from "@ionic/vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";

  import MealComponent from "@/components/meal/MealComponent.vue";

  import FetchError from "@/utils/errors/FetchError";
  import type { EdamamLinks, EdamamRecipes, EdamamResult } from "@/types/Edamam";

  const props = defineProps<{
    query: string
  }>();

  const meals = ref<EdamamRecipes[]>([]);
  const links = ref<EdamamLinks>();

  const searchMeal = async (query: string, _cont: string|null = null) => {
    if (query.length <= 1) return;

    const encodedQuery = encodeURIComponent(query);
    let url = `/meal/search?query=${encodedQuery}`;

    if (_cont) {
      const encodedCont = encodeURIComponent(_cont);
      url = `/meal/search?query=${encodedQuery}&_cont=${encodedCont}`;
    }

    try {
      const response = await useFetchAPI({
        url: url,
        method: 'GET'
      });

      const result = response.data.payload as EdamamResult;

      meals.value.push(...result.hits);
      links.value = result._links

    } catch (error) {
      if (error instanceof FetchError) {
        // TODO: Handle errors
      }
    }
  }

  await searchMeal(props.query);

  const fetchNextPage = async (ev: InfiniteScrollCustomEvent) => {
    // Fetch next page
    if (links.value && Object.keys(links.value).length > 0) {
      const nextPageUrl = links.value.next.href

      // Extract _cont from the url
      const params = new URLSearchParams(nextPageUrl);
      const contKey = params.get('_cont');

      await searchMeal(props.query, contKey)
    }

    setTimeout(() => ev.target.complete(), 1000);
  }
</script>

<template>
  <section>
    <div class="grid grid-cols-2 gap-4">
      <template v-for="(meal, index) in meals" :key="index">
        <MealComponent :meal="meal.recipe" :links="meal._links"></MealComponent>
      </template>
    </div>

    <ion-infinite-scroll v-if="links?.next" class="mt-5" @ionInfinite="fetchNextPage">
      <ion-infinite-scroll-content></ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </section>
</template>

<style scoped lang="scss">

</style>