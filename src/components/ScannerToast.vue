<script setup lang="ts">
  import { computed } from "vue";
  import { IonIcon, isPlatform } from "@ionic/vue";
  import { closeOutline } from "ionicons/icons";
  import { Preferences } from "@capacitor/preferences";

  const emit = defineEmits(['dismiss'])

  const statusBarHeight = computed(() => {
    if (isPlatform('desktop')) return 20;

    return screen.height - window.innerHeight;
  })

  const dismissToast = async () => {
    await Preferences.set({
      key: 'scanner_toast_dismissed',
      value: 'true'
    });

    emit('dismiss')
  }
</script>

<template>
  <div class="bg-primary camera-notice rounded-xl shadow-md m-5 p-5 z-[1000] absolute w-[calc(100%-2.5rem)] flex items-center"
       :style="{ 'margin-top': statusBarHeight + 'px'}">
    <div>
      <h5 class="text-xl font-bold mb-3">
        Check Out What's Cookin' In Your Grub!
      </h5>
      <p class="text-sm">
        Capturing a photograph of your meal can assist in identifying its ingredients.
      </p>
    </div>
    <div class="w-[200px]"></div>

    <span class="absolute top-[1.25rem] right-[1.25rem] hover:cursor-pointer" @click="dismissToast">
      <ion-icon aria-label="Close toast message" :icon="closeOutline"></ion-icon>
    </span>
  </div>
</template>

<style scoped lang="scss">
  ion-icon {
    font-size: 1.5rem;
  }
</style>