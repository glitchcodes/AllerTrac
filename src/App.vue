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
  import { Capacitor } from "@capacitor/core";
  import { App } from "@capacitor/app";
  import { StatusBar, Style } from "@capacitor/status-bar";
  import { NativeAudio } from "@capacitor-community/native-audio";
  import { Network } from "@capacitor/network";

  import { useRoute, useRouter } from "vue-router";
  import { useAuthStore } from "@/store/auth";
  import { useNetworkStore } from "@/store/network";
  import { useNotificationStore } from "@/store/notification";
  import { useAlarmStore } from "@/store/alarm";
  import { useAllergenStore } from "@/store/allergen";
  import { useEmergencyStore } from "@/store/emergency";
  import NotAllowedError from "@/utils/errors/NotAllowedError";
  import type { User } from "@/types/User";

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const networkStore = useNetworkStore();
  const notificationStore = useNotificationStore();
  const alarmStore = useAlarmStore()
  const allergenStore = useAllergenStore();
  const emergencyStore = useEmergencyStore();

  const isInitializing = ref<boolean>(true);

  onMounted(async () => {
    // Init network status
    const networkStatus = await Network.getStatus();
    await networkStore.updateNetworkStatus(networkStatus);

    // Init alarms
    // TODO: Move into background runner
    await alarmStore.init()

    // Check permission for notifications
    if (Capacitor.isNativePlatform()) {
      await notificationStore.checkPermissions();

      if (isPlatform('android')) {
        await notificationStore.checkExactAlarmPermission();
      }

      if (notificationStore.permissionStatus === 'prompt' || notificationStore.permissionStatus === 'prompt-with-rationale') {
        await notificationStore.requestPermissions()
      }
    }

    NativeAudio.preload({
      assetId: 'siren-alert',
      assetPath: 'alert.wav',
      audioChannelNum: 1,
      isUrl: false
    });

    NativeAudio.preload({
      assetId: 'beep-alert',
      assetPath: 'beep.wav',
      audioChannelNum: 1,
      isUrl: false
    });

    // Listen for app state changes
    App.addListener('appStateChange', () => {
      if (Capacitor.isNativePlatform() && isPlatform('android')) {
        notificationStore.checkExactAlarmPermission();
      }
    });

    App.addListener('resume', () => {
      NativeAudio.preload({
        assetId: 'siren-alert',
        assetPath: 'alert.wav',
        audioChannelNum: 1,
        isUrl: false
      });

      NativeAudio.preload({
        assetId: 'beep-alert',
        assetPath: 'beep.wav',
        audioChannelNum: 1,
        isUrl: false
      });
    })

    App.addListener('pause', () => {
      emergencyStore.deactivateAlert();

      NativeAudio.unload({
        assetId: 'siren-alert'
      });

      NativeAudio.unload({
        assetId: 'beep-alert'
      })
    });

    // Listen for network connection change
    Network.addListener('networkStatusChange', status => {
      networkStore.updateNetworkStatus(status);
    })

    if (networkStore._isConnected) {
      try {
        // Validate user session
        const response = await authStore.validateToken();
        const user: User = response.data.user;

        // Redirect user to onboarding if not yet done
        if (
            user.is_onboarding && !(
                route.name === 'onboarding-welcome' ||
                route.name === 'onboarding-allergens' ||
                route.name === 'onboarding-contacts' ||
                route.name === 'onboarding-final'
            )
        ) {
          isInitializing.value = false;
          return await router.replace({ name: 'onboarding-welcome' })
        }

        // Get user allergens
        if (authStore._isLoggedIn) {
          await allergenStore.getAllergens();
        }
      } catch (error) {
        if (error instanceof NotAllowedError) {
          await authStore.removeBearerToken();
        }
      }
    } else {
      // Load from local storage
      await authStore.loadUserInfo();
      await allergenStore.getAllergensOffline();
    }

    isInitializing.value = false;
  });

  watch(() => route.path, async (newRoute) => {
    const isAndroid = isPlatform('android');

    // Only show transparent status bar on these pages
    const whitelistedPages = [
        '/u/login',
        '/u/register',
        '/u/password/forget',
        '/u/password/verify',
        '/u/password/reset',
        '/o/welcome',
        '/o/allergies',
        '/o/congrats',
        '/pages/scan-food',
        '/pages/scan-results',
        '/pages/emergency/hospitals',
        '/logout'
    ]

    // Show dark themed status bar on these pages
    const darkStatusBarPages = [
        '/pages/scan-food'
    ]

    const isWhitelistedPage = whitelistedPages.includes(newRoute);
    const isDarkStatusBar = darkStatusBarPages.includes(newRoute);

    if (Capacitor.isNativePlatform() && isPlatform('android')) {
      const settings = {
        style: isDarkStatusBar ? Style.Dark : Style.Light,
        overlay: isAndroid ? isWhitelistedPage : false
      }

      await StatusBar.setBackgroundColor({ color: '#efeee9' });
      await StatusBar.setStyle({ style: settings.style })

      await StatusBar.setOverlaysWebView({ overlay: settings.overlay })

      if (!isWhitelistedPage) {
        await StatusBar.show();
      }
    }
  }, { immediate: true })
</script>
