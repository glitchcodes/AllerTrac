<script setup lang="ts">
  import { ref } from "vue";
  import { IonHeader, IonContent, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, modalController } from "@ionic/vue";
  import { checkmark, chevronBack } from "ionicons/icons";
  import { Cropper, CircleStencil, CropperResult } from "vue-advanced-cropper";
  import 'vue-advanced-cropper/dist/style.css';

  const props = defineProps<{
    image: string
  }>();

  const cropperRef = ref<any>(null);

  const handleCropChange = ({ coordinates, canvas }: CropperResult) => {
    console.debug("Crop change event:", coordinates, canvas);
  }

  const dismissModal = () => modalController.dismiss(null, 'cancel');

  const saveChanges = async () => {
    const { canvas } = cropperRef.value.getResult();
    let blobUrl: string|null = null;

    if (canvas) {
      // Create an url and then emit it back
      canvas.toBlob((blob: any) => {
        blobUrl = URL.createObjectURL(blob);
        modalController.dismiss({ image: blobUrl }, 'confirm');
      }, 'image/jpeg');
    }

  }
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Crop Avatar</ion-title>

      <ion-buttons slot="start">
        <ion-button @click="dismissModal">
          <ion-icon aria-label="Back" :icon="chevronBack" />
        </ion-button>
      </ion-buttons>

      <ion-buttons slot="end">
        <ion-button :strong="true" @click="saveChanges">
          <ion-icon aria-label="Confirm" :icon="checkmark" />
        </ion-button>
      </ion-buttons>

    </ion-toolbar>
  </ion-header>

  <ion-content>
    <cropper ref="cropperRef"
             class="cropper"
             :src="props.image"
             :stencil-props="{
               handlers: {},
               movable: false,
               resizable: false,
               aspectRatio: 1,
             }"
               :resize-image="{
               adjustStencil: false
             }"
             :stencil-component="CircleStencil"
             image-restriction="stencil"
             @change="handleCropChange" />
  </ion-content>
</template>

<style scoped lang="scss">
.cropper {
  height: 100%;
  width: 100%;
  background: #DDD;
}
</style>