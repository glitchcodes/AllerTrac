<script setup lang="ts">
  import { ref } from "vue";
  import { StatusBar } from "@capacitor/status-bar";
  import {isPlatform, modalController} from "@ionic/vue";
  import ViewMealModal from "@/components/modal/ViewMealModal.vue";

  import type {EdamamLinks, EdamamRecipe} from "@/types/Edamam";
  import {Capacitor} from "@capacitor/core";

  const isClicked = ref<boolean>(false);

  const props = defineProps<{
    meal: EdamamRecipe,
    links: EdamamLinks
  }>();

  const openMealModal = async () => {
    const isAndroid = Capacitor.isNativePlatform && isPlatform('android');

    // Show animation
    isClicked.value = true;

    setTimeout(() => {
      isClicked.value = false;
    }, 300);

    // Change status bar color to white
    if (isAndroid) {
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    }

    // Open modal
    const modal = await modalController.create({
      component: ViewMealModal,
      componentProps: {
        meal: props.meal,
        links: props.links
      }
    });

    await modal.present();

    // await StatusBar.hide();

    const dismissEvent = await modal.onWillDismiss();

    if (dismissEvent) {
      // Revert status bar color
      if (isMobile) {
        await StatusBar.setBackgroundColor({ color: '#efeee9' });
      }
    }
  }
</script>

<template>
  <div class="bg-cover p-4 rounded-2xl min-h-60 relative shadow"
       :class="{ 'animate__animated animate__pulse': isClicked }"
       :style="{
          backgroundImage: `url(${meal.images.REGULAR.url})`
       }" @click="openMealModal">
    <div class="overlay rounded-2xl z-10"></div>
    <div class="absolute bottom-0 left-0 z-20 w-full p-4">
      <h1 class="text-white font-bold line-clamp-3 overflow-hidden text-ellipsis">
        {{ props.meal.label }}
      </h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
  }

  .animate__animated.animate__pulse {
    --animate-duration: 0.3s;
  }
</style>