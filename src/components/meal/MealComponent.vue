<script setup lang="ts">
  import type { EdamamRecipe } from "@/types/Edamam";

  const props = defineProps<{
    meal: EdamamRecipe
  }>();
</script>

<template>
  <div class="bg-cover p-4 rounded-2xl min-h-60 relative shadow"
       :style="{
          backgroundImage: `url(${meal.images.REGULAR.url})`
       }">
    <div class="overlay rounded-2xl z-10"></div>
    <div class="absolute bottom-0 left-0 z-20 w-full p-4">
      <h1 class="text-white font-bold line-clamp-3 overflow-hidden text-ellipsis">
        {{ props.meal.label }}
      </h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
  }
</style>