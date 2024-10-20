<script setup lang="ts">
  import { useBookmarkStore } from "@/store/bookmark";
  import MealComponent from "@/components/meal/MealComponent.vue";

  const bookmarkStore = useBookmarkStore();

  // Get bookmarks
  await bookmarkStore.getBookmarks();
</script>

<template>
  <div>
    <div v-if="bookmarkStore._bookmarks.meals && bookmarkStore._bookmarks.meals.length > 0"
         class="grid grid-cols-2 gap-4">
      <template v-for="(meal, index) in bookmarkStore._bookmarks.meals" :key="index">
        <MealComponent :meal="meal.recipe" :links="meal._links"></MealComponent>
      </template>
    </div>
    <p v-else>You haven't bookmarked any meals yet.</p>
  </div>
</template>

<style scoped lang="scss">

</style>