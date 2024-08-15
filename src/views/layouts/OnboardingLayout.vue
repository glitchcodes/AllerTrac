<script setup lang="ts">
  import { IonPage, IonContent, IonRouterOutlet } from "@ionic/vue";
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-router-outlet></ion-router-outlet>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  //ion-content {
  //  --ion-background-color: transparent;
  //  background-image: url("/images/auth-bg.png");
  //  background-size: cover;
  //}
</style>