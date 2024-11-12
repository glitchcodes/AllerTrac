<script setup lang="ts">
  import { IonIcon } from "@ionic/vue";
  import { informationCircle, warningOutline } from "ionicons/icons";

  const props = defineProps<{
    type: 'info' | 'warning' | 'danger'
  }>();
</script>

<template>
  <div class="flex items-center p-4 text-sm text-blue-800 rounded-lg gap-3"
       :class="{
          'bg-blue-100 text-blue-800': props.type === 'info',
          'bg-yellow-50 text-yellow-800': props.type === 'warning',
          'bg-red-50 text-red-800': props.type === 'danger'
       }"
       role="alert">
    <ion-icon v-if="props.type === 'info'" class="alert-icon" aria-hidden="true" :icon="informationCircle" />
    <ion-icon v-if="props.type === 'warning' || props.type === 'danger'" class="alert-icon" aria-hidden="true" :icon="warningOutline" />

    <slot name="default"></slot>

    <slot name="end"></slot>
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