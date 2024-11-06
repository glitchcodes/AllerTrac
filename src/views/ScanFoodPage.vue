<script setup lang="ts">
  import { inject, onBeforeUnmount, onMounted, ref } from "vue";
  import { useRouter } from "vue-router"
  import { IonContent, IonPage, IonButton, IonIcon, onIonViewDidEnter, onIonViewWillLeave, isPlatform } from "@ionic/vue";
  import { Capacitor } from "@capacitor/core";
  import { Preferences } from "@capacitor/preferences";
  import {
    CameraPreview,
    CameraPreviewFlashMode,
    CameraPreviewOptions,
    CameraPreviewPictureOptions
  } from "@capacitor-community/camera-preview";
  import { flashOutline, flashOffOutline, alertCircleOutline } from "ionicons/icons";
  import { useToastController } from "@/composables/useToastController";
  import { useScannerStore } from "@/store/useScannerStore";
  import { Emitter } from "mitt";
  import ScannerToast from "@/components/ScannerToast.vue";

  type Events = {
    cameraStatusChanged: boolean,
    capturePhoto: void
  }

  const toastController = useToastController();
  const router = useRouter();
  const scannerStore = useScannerStore();
  const flashMode = ref<CameraPreviewFlashMode>('off');
  // const supportedFlashModes = ref<CameraPreviewFlashMode[]>([]);

  const isToastDismissed = ref(false);

  const setFlashMode = async (mode: CameraPreviewFlashMode) => {
    // Get supported flash modes
    let supportedFlashModes: CameraPreviewFlashMode[] = [];

    if (Capacitor.isNativePlatform() && isPlatform('mobile')) {
      const flashModes = await CameraPreview.getSupportedFlashModes();
      supportedFlashModes = flashModes.result;
    }

    if (!supportedFlashModes.includes(mode)) {
      console.error('Unsupported flash mode');

      return toastController.presentToast({
        message: 'Unsupported flash mode',
        position: 'top',
        icon: alertCircleOutline,
        duration: 3000
      });
    }

    flashMode.value = mode;
    await CameraPreview.setFlashMode({
      flashMode: flashMode.value
    });
  }

  const checkToastStatus = async () => {
    const isDismissed = await Preferences.get({ key: 'scanner_toast_dismissed' });

    if (!isDismissed.value) return false;

    isToastDismissed.value = JSON.parse(isDismissed.value);
  }

  const updateToastStatus = async () => {
    await checkToastStatus()
  }

  const emitter: Emitter<Events> = inject('emitter')!;

  const cameraPreviewOptions: CameraPreviewOptions = {
    parent: "camera-preview",
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    toBack: true,
    position: "rear"
  }

  onIonViewDidEnter(() => {
    CameraPreview.start(cameraPreviewOptions)

    emitter.emit("cameraStatusChanged", true);
  });

  onIonViewWillLeave(() => {
    CameraPreview.stop()

    emitter.emit("cameraStatusChanged", false);
  });

  // Events
  onMounted(async () => {
    emitter.on('capturePhoto', async () => {
      const captureOptions: CameraPreviewPictureOptions = {
        quality: 85
      }
      const result = await CameraPreview.capture(captureOptions)

      await scannerStore.setCapturedImage(result.value, 'image/jpeg')

      // Redirect to results page
      await router.push({ path: '/pages/scan-results' })
    })

    // Check toast message status
    await checkToastStatus();
  })

  onBeforeUnmount(() => {
    emitter.off('capturePhoto')
  });
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ScannerToast v-if="!isToastDismissed" @dismiss="updateToastStatus" />
      <img class="camera-stencil" src="/images/camera-stencil.png" alt="Camera Stencil" />
      <div id="camera-preview"></div>

      <div class="absolute z-[1001] bottom-[80px] right-[20px]">
        <ion-button v-if="flashMode === 'off'" shape="round" color="tertiary" @click="setFlashMode('on')">
          <ion-icon slot="icon-only" :icon="flashOffOutline" aria-label="Flash off" />
        </ion-button>
        <ion-button v-if="flashMode === 'on'" shape="round" color="medium" @click="setFlashMode('off')">
          <ion-icon slot="icon-only" :icon="flashOutline" aria-label="Flash on" class="flash-on" />
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-content {
    --background: transparent !important;
  }

  ion-icon.flash-on {
    color: #FEEC37;
  }

  #camera-preview {
    --background: transparent !important;
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 998;
  }

  .camera-stencil {
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    padding: 3rem;
  }

  .camera-notice {
    background-image: url("/camera-helper.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right -15% bottom 10%;
  }
</style>