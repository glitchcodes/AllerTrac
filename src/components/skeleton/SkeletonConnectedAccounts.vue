<script setup lang="ts">
  import { IonSkeletonText, IonThumbnail } from "@ionic/vue";
</script>

<template>
  <section class="bg-white p-4 rounded-lg">
    <h5 class="text-lg font-bold mb-4">
      Connected Accounts
    </h5>

    <div class="flex items-center gap-3 p-3 border rounded-lg">
      <ion-thumbnail class="rounded-full">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <div class="flex-1">
        <ion-skeleton-text :animated="true" style="width: 40%; height: 14px;"></ion-skeleton-text>
        <ion-skeleton-text :animated="true" style="width: 50%; height: 14px;"></ion-skeleton-text>
      </div>
      <div>
        <ion-skeleton-text :animated="true" class="rounded-full" style="width: 4rem; height: 2rem;"></ion-skeleton-text>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">

</style>