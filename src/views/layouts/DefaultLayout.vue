<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { Capacitor } from "@capacitor/core";
  import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonFab,
    IonFabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
    isPlatform
  } from '@ionic/vue';
  import { camera, home, fastFood, person } from 'ionicons/icons';
  import { Emitter } from "mitt";
  import {Keyboard} from "@capacitor/keyboard";

  type Events = {
    cameraStatusChanged: boolean,
    capturePhoto: void
  }

  const router = useRouter()
  const route = useRoute();
  const emitter: Emitter<Events> = inject('emitter')!;

  const isCameraActive = ref(false);
  const isFabHidden = ref(false);

  onMounted(() => {
    emitter.on('cameraStatusChanged', (e: boolean) => {
      isCameraActive.value = e
    })
  })

  onBeforeUnmount(() => {
    emitter.off('cameraStatusChanged')
  });

  // Keyboard events
  // Hide fab button when the keyboard is shown
  Keyboard.addListener('keyboardWillShow', () => {
    isFabHidden.value = true;
  })

  Keyboard.addListener('keyboardWillHide', () => {
    setTimeout(() => {
      isFabHidden.value = false;
    }, 100)
  })

  const fabBottomStyle = computed(() => {
    if (Capacitor.isNativePlatform() && isPlatform('ios')) {
      return '2.3rem';
    }

    return '10px';
  })

  const currentPage = computed(() => {
    return route.path
  });

  const handleCameraClick = () => {
    // Navigate to scan food page
    if (currentPage.value !== '/pages/scan-food') {
      return router.push({ path: '/pages/scan-food' })
    }

    // Emit an even when clicked & the camera is active
    if (isCameraActive.value) {
      emitter.emit('capturePhoto')
    }
  }
</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="pages/home" href="/pages/home">
          <ion-icon aria-hidden="true" :icon="home" />
<!--          <ion-label>Home</ion-label>-->
        </ion-tab-button>

        <ion-tab-button tab="pages/emergency" href="/pages/emergency">
          <ion-icon aria-hidden="true" src="/icons/alert.svg" />
<!--          <ion-label>Alerts</ion-label>-->
        </ion-tab-button>

        <ion-tab-button tab="pages/scan-food" disabled></ion-tab-button>

        <ion-tab-button tab="pages/search" href="/pages/search">
          <ion-icon aria-hidden="true" :icon="fastFood" />
<!--          <ion-label>Tab 3</ion-label>-->
        </ion-tab-button>

        <ion-tab-button tab="pages/tab4" href="/pages/profile">
          <ion-icon aria-hidden="true" :icon="person" />
<!--          <ion-label>Food</ion-label>-->
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

    <ion-fab slot="fixed" vertical="bottom" horizontal="center">
      <ion-fab-button id="scan-food-button"
                      :class="{ active: isCameraActive, hidden: isFabHidden }"
                      :style="{ bottom: fabBottomStyle }"
                      @click="handleCameraClick">
        <ion-icon aria-hidden="true" :icon="camera" />
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-router-outlet {
    margin-top: var(--status-bar-height);
  }

  ion-tab-bar {
    background-color: #fff;
    box-shadow: 0px -12px 42px -1px rgba(0, 0, 0, 0.1);
    ion-tab-button {
      background-color: #fff;
    }
  }

  ion-fab-button {
    --background: var(--ion-color-primary);

    --border-color: var(--ion-color-primary-contrast);
    --border-style: solid;
    --border-width: 4px;

    --box-shadow: none;
    //-webkit-transform: scale(1.2) translate3d(0, 0, 0);
    transform: translate3d(0,0,0);
    will-change: transform;
    transition: transform 0.3s ease;

    &.active {
      transform: perspective(10px) translate3d(0, -0.8rem, 2px);
      //transition: 0.3s;
    }
  }

  #scan-food-button {
    position: relative;
  }
</style>