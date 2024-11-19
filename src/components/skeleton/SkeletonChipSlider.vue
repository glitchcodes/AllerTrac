<script setup lang="ts">
import { IonChip, IonSkeletonText } from "@ionic/vue";
</script>

<template>
  <section>
    <div class="rounded-md flex justify-between mt-5 mb-3">
      <h5 class="font-bold">
        Here are some facts!
      </h5>
      <h5 class="font-bold">
        See all
      </h5>
    </div>

    <div class="overflow-x-auto scroll-smooth flex flex-nowrap space-x-2 no-scrollbar">
      <ion-chip class="overflow-visible">
        <ion-skeleton-text :animated="true" style="width: 70px; border-radius: 8px"></ion-skeleton-text>
      </ion-chip>
      <ion-chip class="overflow-visible">
        <ion-skeleton-text :animated="true" style="width: 70px; border-radius: 8px"></ion-skeleton-text>
      </ion-chip>
      <ion-chip class="overflow-visible">
        <ion-skeleton-text :animated="true" style="width: 70px; border-radius: 8px"></ion-skeleton-text>
      </ion-chip>
      <ion-chip class="overflow-visible">
        <ion-skeleton-text :animated="true" style="width: 70px; border-radius: 8px"></ion-skeleton-text>
      </ion-chip>
      <ion-chip class="overflow-visible">
        <ion-skeleton-text :animated="true" style="width: 70px; border-radius: 8px"></ion-skeleton-text>
      </ion-chip>
    </div>
  </section>
</template>

<style scoped lang="scss">
  ion-chip {
    --background: #417776;
  }
</style>