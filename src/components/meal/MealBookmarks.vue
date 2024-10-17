<script setup lang="ts">
  import { useBookmarkStore } from "@/store/bookmark";
  import MealComponent from "@/components/meal/MealComponent.vue";

  const bookmarkStore = useBookmarkStore();

  // Get bookmarks
  await bookmarkStore.getBookmarks();

  const meals = bookmarkStore._bookmarks.meals;
</script>

<template>
  <div>
    <div v-if="meals && meals.length > 0" class="grid grid-cols-2 gap-4">
      <template v-for="(meal, index) in meals" :key="index">
        <MealComponent :meal="meal.recipe" :links="meal._links"></MealComponent>
      </template>
    </div>
    <p v-else>You haven't bookmarked any meals yet.</p>
  </div>
</template>

<style scoped lang="scss">

</style>