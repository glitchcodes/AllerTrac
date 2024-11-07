<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from "vue";
  import { IonContent, IonPage, IonButton, IonIcon, onIonViewDidEnter, onIonViewWillLeave, isPlatform } from "@ionic/vue";
  import { arrowBack, locateOutline } from "ionicons/icons";
  import { Geolocation } from "@capacitor/geolocation";
  import { GoogleMap } from "@capacitor/google-maps";
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
  import { Capacitor } from "@capacitor/core";

  // Status Bar
  const statusBarHeight = ref();

  onMounted(async () => {
    statusBarHeight.value = (await SafeArea.getStatusBarHeight()).height
  })

  // Map
  const mapRef = ref<HTMLElement>();
  let map: GoogleMap;

  const createMap = async () => {
    if (!mapRef.value) return;

    map = await GoogleMap.create({
      id: 'hospital-locator',
      element: mapRef.value,
      apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
      config: {
        center: {
          lat: 11.816459,
          lng: 121.9759534,
        },
        zoom: 6,
        disableDefaultUI: true,
        androidMapId: 'ca2bcc0690f1e792'
      },
    })
  }

  onIonViewDidEnter(async () => {
    // await nextTick();
    await createMap();
    await nextTick();

    enableCurrentLocation();
  });

  onIonViewWillLeave(() => {
    map.destroy();
  });

  // Controls
  const currentLocationEnabled = ref(false);

  watch(currentLocationEnabled, (value: boolean) => {
    map.enableCurrentLocation(value);
  });

  const enableCurrentLocation = () => {
    currentLocationEnabled.value = true;

    // Move the camera into current position
    moveCameraToCurrentPosition()
  }

  const disableCurrentLocation = () => {
    currentLocationEnabled.value = false;
  }

  const moveCameraToCurrentPosition = async () => {
    // Get the current location from geolocation plugin
    const currentLocation = await Geolocation.getCurrentPosition();

    // Move the camera into the current position
    await map.setCamera({
      coordinate: {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude
      },
      zoom: 15,
      animate: true
    })
  }
</script>

<template>
  <ion-page>
    <nav class="flex items-center ion-padding absolute top-0 w-full z-[1000]"
         :style="{ marginTop: Capacitor.isNativePlatform() && isPlatform('mobile') ? statusBarHeight + 'px' : '0' }">
      <ion-button shape="round" router-link="/pages/emergency" router-direction="back">
        <ion-icon slot="icon-only" :icon="arrowBack" />
      </ion-button>

      <div class="flex-1" />

      <ion-button v-if="!currentLocationEnabled" shape="round" color="tertiary" @click="enableCurrentLocation">
        <ion-icon slot="icon-only" :icon="locateOutline" />
      </ion-button>

      <ion-button v-else shape="round" color="medium" @click="disableCurrentLocation">
        <ion-icon slot="icon-only" :icon="locateOutline" class="location-on" />
      </ion-button>
    </nav>
    <ion-content>
      <capacitor-google-map ref="mapRef"></capacitor-google-map>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  capacitor-google-map {
    display: inline-block;
    width: 100vw;
    height: 100%;
    z-index: 999;
  }

  ion-content {
    --background: transparent !important;
  }

  ion-icon.location-on {
    color: #FEEC37;
  }
</style>