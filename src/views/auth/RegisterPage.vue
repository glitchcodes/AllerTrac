<script setup lang="ts">
  import { IonPage, IonContent } from '@ionic/vue';
  import ExploreContainer from '@/components/ExploreContainer.vue';
</script>

<template>
  <ion-page>
    <ion-content>
      <ExploreContainer name="Tab 3 page" />
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-content {
    --ion-background-color: transparent;
    background-image: url("/images/auth-bg.png");
    background-size: cover;
  }
</style>