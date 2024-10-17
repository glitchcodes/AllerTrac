<script setup lang="ts">
  import { IonIcon } from "@ionic/vue";
  import { informationCircle } from "ionicons/icons";
</script>

<template>
  <div class="flex items-center p-4 text-sm text-blue-800 rounded-lg bg-blue-100 gap-3" role="alert">
    <ion-icon class="alert-icon" aria-hidden="true" :icon="informationCircle" />
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
  ion-icon.alert-icon {
    font-size: 1.5rem;
    min-width: 24px;
    width: 24px;
    height: 24px;
  }
</style>