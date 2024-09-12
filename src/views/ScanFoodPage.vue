<script setup lang="ts">
  import { inject, onBeforeUnmount, onMounted, ref } from "vue";
  import { useRouter } from "vue-router"
  import { IonContent, IonPage, onIonViewDidEnter, onIonViewWillLeave } from "@ionic/vue";
  import { Preferences } from "@capacitor/preferences";
  import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from "@capacitor-community/camera-preview";
  import { useScannerStore } from "@/store/useScannerStore";
  import { Emitter } from "mitt";
  import ScannerToast from "@/components/ScannerToast.vue";

  type Events = {
    cameraStatusChanged: boolean,
    capturePhoto: void
  }

  const router = useRouter();
  const scannerStore = useScannerStore();

  const isToastDismissed = ref(false);

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
  onMounted(() => {
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
    checkToastStatus()
  })

  onBeforeUnmount(() => {
    emitter.off('capturePhoto')
  });
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ScannerToast v-if="!isToastDismissed" @dismiss="updateToastStatus" />
      <div id="camera-preview"></div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-content {
    --background: transparent !important;
  }

  #camera-preview {
    --background: transparent !important;
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .camera-notice {
    background-image: url("/camera-helper.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right -15% bottom 10%;
  }
</style>