<template>
  <ion-app>
    <transition enter-active-class="animate__animated animate__slideInLeft"
                leave-active-class="animate__animated animate__slideOutRight"
                mode="out-in">
      <div v-show="isInitializing" class="bg-[#efeee9] w-[100vw] h-[100vh] fixed top-0 left-0 flex items-center justify-center">
        <div>
          <img src="/images/logo-128x128.png" alt="AllerTrac logo" />

          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </div>
      </div>
    </transition>

    <transition enter-active-class="animate__animated animate__slideInLeft"
                leave-active-class="animate__animated animate__slideOutRight"
                mode="out-in">
      <ion-router-outlet v-show="!isInitializing" />
    </transition>
  </ion-app>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from "vue";
  import { IonApp, IonRouterOutlet, IonProgressBar, isPlatform } from '@ionic/vue';
  import { StatusBar, Style } from "@capacitor/status-bar";
  import { NativeAudio } from "@capacitor-community/native-audio";
  import { Network } from "@capacitor/network";

  import { useRoute } from "vue-router";
  import { useAuthStore } from "@/store/auth";
  import { useNetworkStore } from "@/store/network";
  import { useAllergenStore } from "@/store/allergen";
  import NotAllowedError from "@/utils/errors/NotAllowedError";

  const route = useRoute();
  const authStore = useAuthStore();
  const networkStore = useNetworkStore();
  const allergenStore = useAllergenStore();

/*  const injectSafeAreaVariables = () => {
    SafeAreaController.injectCSSVariables();
  };*/

  const isInitializing = ref<boolean>(true);

  onMounted(async () => {
    // Init network status
    const networkStatus = await Network.getStatus();
    await networkStore.updateNetworkStatus(networkStatus);

    // Listen for network connection change
    Network.addListener('networkStatusChange', status => {
      networkStore.updateNetworkStatus(status);
    })

    if (networkStore._isConnected) {
      try {
        // Validate user session
        await authStore.validateToken();

        // Get user allergens
        if (authStore._isLoggedIn) {
          await allergenStore.getAllergens();
        }
      } catch (error) {
        if (error instanceof NotAllowedError) {
          await authStore.removeBearerToken();
        }
      }
    }

    isInitializing.value = false;
  });

  // Preload alert sound
  NativeAudio.preload({
    assetId: 'emergency-alert',
    assetPath: 'alert.wav',
    audioChannelNum: 1,
    isUrl: false
  })

  watch(() => route.path, async (newRoute) => {
    const isAndroid = isPlatform('android');

    // Only show transparent status bar on these pages
    const whitelistedPages = [
        '/u/login',
        '/u/register',
        '/u/password/forget',
        '/u/password/verify',
        '/u/password/reset',
        '/pages/scan-food',
        '/pages/scan-results',
        '/logout'
    ]

    // Show dark themed status bar on these pages
    const darkStatusBarPages = [
        '/pages/scan-food'
    ]

    const isWhitelistedPage = whitelistedPages.includes(newRoute);
    const isDarkStatusBar = darkStatusBarPages.includes(newRoute);

    if (isPlatform('hybrid')) {
      const settings = {
        style: isDarkStatusBar ? Style.Dark : Style.Light,
        overlay: isAndroid ? isWhitelistedPage : false
      }

      await StatusBar.setBackgroundColor({ color: '#efeee9' });
      await StatusBar.setStyle({ style: settings.style })


      if (isAndroid) {
        await StatusBar.setOverlaysWebView({ overlay: settings.overlay })
      }

      if (!isWhitelistedPage) {
        await StatusBar.show();
      }
    }
  }, { immediate: true })
</script>
