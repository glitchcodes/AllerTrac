<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
  import { watch } from "vue";
  import { useRoute } from "vue-router";
  import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/vue';
  import { StatusBar, Style } from "@capacitor/status-bar";

  const route = useRoute();

  watch(() => route.path, async (newRoute) => {
    const isAndroid = isPlatform('android');

    // Only show transparent status bar on these pages
    const whitelistedPages = [
        '/u/login',
        '/u/register',
        '/u/forgot-password',
        '/pages/scan-food'
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
        overlay: isAndroid ? isWhitelistedPage : false,
        // color: isScanning ? 'transparent' : '#efeee9'
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

    // if (isPlatform('hybrid')) {
    //   if (newValue === "/pages/scan-food") {
    //     await StatusBar.setStyle({ style: Style.Dark });
    //     if (isPlatform('android')) await StatusBar.setOverlaysWebView({ overlay: true });
    //   } else {
    //     await StatusBar.setStyle({ style: Style.Light });
    //     await StatusBar.setBackgroundColor({
    //       color: '#efeee9'
    //     })
    //     if (isPlatform('android')) await StatusBar.setOverlaysWebView({ overlay: false });
    //     await StatusBar.show()
    //   }
    // }
  }, { immediate: true })



</script>
