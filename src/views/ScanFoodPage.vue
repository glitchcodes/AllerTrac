<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted } from "vue";
  import { useRouter } from "vue-router"
  import { IonContent, IonPage, isPlatform, onIonViewDidEnter, onIonViewWillLeave } from "@ionic/vue";
  import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from "@capacitor-community/camera-preview";
  import { useScannerStore } from "@/store/useScannerStore";
  import { Emitter } from "mitt";

  type Events = {
    cameraStatusChanged: boolean,
    capturePhoto: void
  }

  const router = useRouter();
  const scannerStore = useScannerStore();

  const emitter: Emitter<Events> = inject('emitter')!;
  const statusBarHeight = computed(() => {
    if (isPlatform('desktop')) return 20;

    return screen.height - window.innerHeight;
  })

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
  })

  onBeforeUnmount(() => {
    emitter.off('capturePhoto')
  })
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="bg-primary camera-notice rounded-xl shadow-md m-5 p-5 z-[1000] absolute w-[calc(100%-2.5rem)] flex items-center"
           :style="{
             'margin-top': statusBarHeight + 'px'
           }">
        <div>
          <h5 class="text-xl font-bold mb-3">
            Check Out What's Cookin' In Your Grub!
          </h5>
          <p class="text-sm">
            Capturing a photograph of your meal can assist in identifying its ingredients.
          </p>
        </div>
        <div class="w-[200px]"></div>
      </div>
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