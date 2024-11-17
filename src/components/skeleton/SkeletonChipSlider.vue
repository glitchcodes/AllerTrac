<script setup lang="ts">
import { IonChip, IonSkeletonText } from "@ionic/vue";
</script>

<template>
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
</template>

<style scoped lang="scss">
  ion-chip {
    --background: #417776;
  }
</style>