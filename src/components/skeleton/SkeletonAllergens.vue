<script setup lang="ts">
  import { IonChip, IonLabel, IonSkeletonText } from "@ionic/vue";
</script>

<template>
  <div class="bg-[#43727a] p-4 rounded-lg text-white">
    <div class="mb-4">
      <h5 class="font-bold mt-1">Selected</h5>
      <p>Nothing selected yet</p>
    </div>

    <div>
      <h5 class="font-bold mb-1">Allergens</h5>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 70px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 60px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 40px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 60px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 60px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 70px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 90px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
      <ion-chip>
        <ion-label>
          <ion-skeleton-text :animated="true" style="width: 50px; border-radius: 8px"></ion-skeleton-text>
        </ion-label>
      </ion-chip>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>