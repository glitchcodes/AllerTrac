<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { createGesture } from "@ionic/vue";
  import { useEmergencyStore } from "@/store/emergency";
  import type { GestureDetail } from "@ionic/vue";

  const emergencyStore = useEmergencyStore();

  const alertButton = ref();

  const TIMEOUT = 500;

  onMounted(() => {
    const gesture = createGesture({
      gestureName: "long-press",
      el: alertButton.value,
      threshold: 0,
      onStart: () => onStart(),
      onMove: (detail) => onMove(detail),
      onEnd: () => clearGestureTimeout()
    })

    gesture.enable(true);
  })

  let timeout: any;

  const onStart = () => {
    clearGestureTimeout();

    timeout = setTimeout(() => {

      if (emergencyStore.isAlertActivated) {
        emergencyStore.deactivateAlert();
      } else {
        emergencyStore.activateAlert();
      }

      timeout = undefined;
    }, TIMEOUT);
  }

  const onMove = (detail: GestureDetail) => {
    // Allow slight movement; Otherwise, cancel
    if (detail.deltaX <= 10 && detail.deltaY <= 10) {
      return;
    }

    clearGestureTimeout()
  }

  const clearGestureTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined
    }
  }
</script>

<template>
  <button ref="alertButton" class="bg-[#eb0c1b] border-[#c20b17] border-8 border-solid shadow rounded-full p-8 active:scale-90 alert-button">
    <img src="/icons/alert-white.png" class="w-full max-w-[120px]" alt="Alert Icon" />
  </button>
</template>

<style scoped lang="scss">
  .alert-button {
    transition: 0.2s;
  }

  @media screen and (max-height: 640px) {
    .alert-button img {
      max-width: 60px;
    }
  }
</style>