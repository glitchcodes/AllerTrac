<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
  import { onMounted, watch } from "vue";
  import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/vue';
  import { StatusBar, Style } from "@capacitor/status-bar";
  import { NativeAudio } from "@capacitor-community/native-audio";
  import { Network } from "@capacitor/network";

  import { useRoute } from "vue-router";
  import { useNetworkStore } from "@/store/network";

  const route = useRoute();
  const networkStore = useNetworkStore();

/*  const injectSafeAreaVariables = () => {
    SafeAreaController.injectCSSVariables();
  };*/

  onMounted(async () => {
    // Init network status
    const networkStatus = await Network.getStatus();
    await networkStore.updateNetworkStatus(networkStatus);

    // Listen for network connection change
    Network.addListener('networkStatusChange', status => {
      networkStore.updateNetworkStatus(status);
    })
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
