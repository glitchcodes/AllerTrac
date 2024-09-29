<script setup lang="ts">
  import { IonSkeletonText } from "@ionic/vue";
</script>

<template>
  <div class="bg-neutral-100 rounded-xl px-6 py-4 border-2 shadow w-full">
    <h2>
      <ion-skeleton-text :animated="true" style="width: 75%;"></ion-skeleton-text>
    </h2>
    <ul class="text-primary text-sm mt-3">
      <li class="flex gap-3">
        <ion-skeleton-text :animated="true" style="width: 35%;"></ion-skeleton-text>
        <ion-skeleton-text :animated="true" style="width: 55%;"></ion-skeleton-text>
      </li>
      <li class="flex gap-3">
        <ion-skeleton-text :animated="true" style="width: 35%;"></ion-skeleton-text>
        <ion-skeleton-text :animated="true" style="width: 55%;"></ion-skeleton-text>
      </li>
      <li class="flex gap-3">
        <ion-skeleton-text :animated="true" style="width: 35%;"></ion-skeleton-text>
        <ion-skeleton-text :animated="true" style="width: 55%;"></ion-skeleton-text>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  ion-skeleton-text {
    height: 12px;
    border-radius: 8px;
  }
</style>