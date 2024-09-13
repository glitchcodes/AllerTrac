<script setup lang="ts">
  import { IonIcon } from "@ionic/vue";
  import { informationCircle } from "ionicons/icons";

  const props = defineProps<{
    text: string
  }>()
</script>

<template>
  <div class="flex items-center p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 gap-3" role="alert">
    <ion-icon class="alert-icon" aria-hidden="true" :icon="informationCircle" />
    <div>
      {{ props.text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  ion-icon.alert-icon {
    font-size: 1.5rem;
  }
</style>