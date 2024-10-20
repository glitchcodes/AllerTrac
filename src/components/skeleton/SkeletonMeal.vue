<script setup lang="ts">
  import { IonSkeletonText } from "@ionic/vue";

  const props = defineProps<{
    length: number;
  }>()

</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="n in props.length" :key="n" class="bg-neutral-300 p-4 rounded-2xl min-h-60 relative">
      <span class="hidden">{{ n }}</span>
      <div class="absolute bottom-0 left-0 z-20 w-full p-4">
        <h1 class="text-white font-bold">
          <ion-skeleton-text :animated="true" class="rounded" style="height: 1rem;" />
        </h1>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>