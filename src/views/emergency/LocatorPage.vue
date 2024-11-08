<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from "vue";
  import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonBadge,
    IonItem,
    IonList,
    IonLabel,
    IonPopover,
    IonRadio,
    IonRadioGroup,
    isPlatform,
    loadingController,
    onIonViewDidEnter,
    onIonViewWillLeave,
    RadioGroupCustomEvent
  } from "@ionic/vue";

  import { arrowBack, locateOutline, optionsOutline } from "ionicons/icons";
  import { Geolocation } from "@capacitor/geolocation";
  import { GoogleMap } from "@capacitor/google-maps";
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
  import { Capacitor } from "@capacitor/core";

  import { Loader } from "@googlemaps/js-api-loader";
  import { CupertinoPane } from "cupertino-pane";
  import { buildAddressString, calculateDistance } from "@/utils/helpers";

  import type { MapPlace } from "@/types/Map";
  import type { LatLng } from "@capacitor/google-maps/dist/typings/definitions";

  // Status Bar
  const statusBarHeight = ref<number>();

  // Cupertino Pane
  const drawer = ref();

  // Markers
  const markers = ref<string[]>([]);

  onMounted(async () => {
    statusBarHeight.value = (await SafeArea.getStatusBarHeight()).height
  })

  // Loading Indicator
  const loading = ref<HTMLIonLoadingElement>();

  const showLoading = async () => {
    loading.value = await loadingController.create({
      message: 'Please wait...'
    });

    await loading.value.present();
  }

  const dismissLoading = async () => {
    if (loading.value) {
      await loading.value.dismiss();
    }
  }

  // Map
  let map: GoogleMap;
  const mapRef = ref<HTMLElement>();
  const currentPosition = ref<LatLng>();

  const placeLibrary = ref();

  const hospitals = ref<MapPlace[]>([]);
  const searchDistance = ref<number>(5);

  // Fetch hospitals again when search distance has changed
  watch(searchDistance, async () => {
    hospitals.value = [];
    hospitals.value = await locateHospitals();
  })

  const handleDistanceChange = (e: RadioGroupCustomEvent) => {
    searchDistance.value = e.detail.value;
  }

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
        mapId: '1c37b8ae063466d4',
        androidMapId: 'ca2bcc0690f1e792',
        iOSMapId: 'd1c1f7275f70b601',
      },
    })
  }

  onIonViewDidEnter(async () => {
    // Show loading controller
    await showLoading()

    // Instantiate cupertino pane
    drawer.value = new CupertinoPane('ion-drawer', {
      parentElement: '#hospital-locator',
      buttonDestroy: false,
      bottomOffset: 56,
      touchMoveStopPropagation: true,
      breaks: {
        top: { // Topper point that pane can reach
          enabled: true, // Enable or disable breakpoint
          height: window.screen.height - (135 * 0.35) - 54 - 100, // Pane breakpoint height
          bounce: true // Bounce pane on transition
        },
      }
    });

    // Create map and get current position
    await createMap();
    await nextTick();

    // Load Place Library
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
      version: 'weekly'
    });

    const { Place } = await loader.importLibrary('places');
    placeLibrary.value = Place;

    // Enable current location
    enableCurrentLocation();

    const { coords } = await Geolocation.getCurrentPosition();

    currentPosition.value = {
      lat: coords.latitude,
      lng: coords.longitude
    }

    // Search hospitals
    hospitals.value = await locateHospitals();
    await drawer.value.present()

    // Move the camera into current position
    await moveCameraToCurrentPosition()

    // await openSheetModal();
    await dismissLoading();
  });

  onIonViewWillLeave(() => {
    // Remove markers
    removeMarkers()

    // Destroy map
    map.destroy();

    // Destroy sheet modal
    if (drawer.value) {
      drawer.value.destroy({ animate: false });
    }
  });

  // Controls
  const currentLocationEnabled = ref(false);

  watch(currentLocationEnabled, (value: boolean) => {
    map.enableCurrentLocation(value);
  });

  const enableCurrentLocation = () => {
    currentLocationEnabled.value = true;
  }

  const disableCurrentLocation = () => {
    currentLocationEnabled.value = false;
  }

  // Move the camera into the current position
  const moveCameraToCurrentPosition = async () => {
    await map.setCamera({
      coordinate: {
        lat: currentPosition.value!.lat,
        lng: currentPosition.value!.lng
      },
      zoom: 15,
      animate: true
    })
  }

  // Remove markers
  const removeMarkers = async () => {
    if (markers.value.length > 0) {
      await map.removeMarkers(markers.value);
      markers.value = [];
    }
  }

  const locateHospitals = async () => {
    // Remove any markers on the map
    await removeMarkers();

    // Convert distance (km) to meters
    const radius = searchDistance.value * 1000;

    const request = {
      fields: ['displayName', 'location', 'addressComponents'],
      locationRestriction: {
        center: currentPosition.value,
        radius: radius
      },
      includedPrimaryTypes: ['hospital'],
      // maxResultCount: 5,
      rankPreference: 'POPULARITY',
      language: 'en-US',
      region: 'ph'
    }

    const { places } = await placeLibrary.value.searchNearby(request)

    // Add markers on the map
    for (const place of places) {
      const markerId = await map.addMarker({
        coordinate: {
          lat: place.Ng.lat(),
          lng: place.Ng.lng()
        },
        title: place.Eg.displayName
      });

      markers.value.push(markerId);
    }

    return places;
  }
</script>

<template>
  <ion-page id="hospital-locator">
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

      <ion-drawer class="hospital-drawer">
        <div class="ion-padding">

          <div class="flex items-center mb-6">
            <h1 class="text-2xl font-bold flex-1">
              Nearby Hospitals
            </h1>
            <ion-button shape="round" color="tertiary" id="search-options">
              <ion-icon slot="icon-only" :icon="optionsOutline" aria-label="Options" />
            </ion-button>
          </div>

          <ion-popover trigger="search-options" trigger-action="click">
            <ion-content class="ion-padding ">
              <p class="mb-3">
                Search distance
              </p>
              <ion-radio-group :value="searchDistance" @ionChange="handleDistanceChange">
                <ion-item lines="none" color="light" class="rounded-lg shadow mb-3">
                  <ion-radio :value="5" justify="space-between">5km</ion-radio>
                </ion-item>
                <ion-item lines="none" color="light" class="rounded-lg shadow">
                  <ion-radio :value="10" justify="space-between">10km</ion-radio>
                </ion-item>
              </ion-radio-group>
            </ion-content>
          </ion-popover>

          <ion-list v-if="hospitals.length > 0" lines="none">
            <ion-item v-for="hospital in hospitals"
                      :key="hospital.id"
                      color="light"
                      class="rounded-lg shadow mb-3"
                      button
            >
              <ion-icon slot="start" icon="/icons/building-office.svg" aria-label="Navigate Icon" />
              <ion-label>
                <h2 class="font-bold">
                  {{ hospital.Eg.displayName }}
                </h2>
                <small>
                  {{ buildAddressString(hospital.Eg.addressComponents) }}
                </small>
              </ion-label>
              <ion-badge slot="end">
                {{ calculateDistance(currentPosition!, { lat: hospital.Ng.lat(), lng: hospital.Ng.lng() }) }}km
              </ion-badge>
            </ion-item>
          </ion-list>
        </div>
      </ion-drawer>
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

  ion-drawer.hospital-drawer {
    ion-content {
      --background: white!important;
    }
  }
</style>