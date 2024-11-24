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
    useIonRouter,
    RadioGroupCustomEvent,
  } from "@ionic/vue";
  import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

  import { arrowBack, locateOutline, optionsOutline } from "ionicons/icons";
  import { Geolocation } from "@capacitor/geolocation";
  import { GoogleMap } from "@capacitor/google-maps";
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
  import { Capacitor } from "@capacitor/core";

  import { Loader } from "@googlemaps/js-api-loader";
  import { CupertinoPane } from "cupertino-pane";

  import AlertMessage from "@/components/AlertMessage.vue";
  import { useAlertController } from "@/composables/useAlertController";
  import { buildAddressString, calculateDistance } from "@/utils/helpers";
  import type { MapPlace } from "@/types/Map";
  import type { LatLng } from "@capacitor/google-maps/dist/typings/definitions";


  // Status Bar
  const statusBarHeight = ref<number>();

  // Composables
  const ionRouter = useIonRouter();
  const alertController = useAlertController();

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
  const currentPosition = ref<LatLng>({} as LatLng);

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
    // Instantiate cupertino pane
    drawer.value = new CupertinoPane('ion-drawer#hospital-drawer', {
      // parentElement: '#hospital-locator',
      buttonDestroy: false,
      bottomOffset: isPlatform('ios') ? 50 : 56,
      touchMoveStopPropagation: true,
      breaks: {
        top: { // Topper point that pane can reach
          enabled: true, // Enable or disable breakpoint
          height: window.screen.height - (135 * 0.35) - 54 - 100, // Pane breakpoint height
          bounce: true // Bounce pane on transition
        },
      }
    });

    // Check permissions
    try {
      let permissions = await Geolocation.checkPermissions();

      if (permissions.location === 'prompt' || permissions.location === 'prompt-with-rationale') {
        permissions = await Geolocation.requestPermissions({permissions: ['location']});
      }

      if (permissions.location === 'denied') {
        await alertController.presentAlert({
          header: 'Precise location permissions needed',
          message: 'To accurately provide you hospital locations, we need your permission to use precise location.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                ionRouter.navigate('/pages/emergency', 'back', 'pop');
              },
            },
            {
              text: 'Ok',
              handler: async () => {
                ionRouter.navigate('/pages/emergency', 'back', 'pop');

                await NativeSettings.open({
                  optionAndroid: AndroidSettings.ApplicationDetails,
                  optionIOS: IOSSettings.App
                })
              }
            }
          ],
        })
      } else if (permissions.location === 'granted') {
        await initMap()
      }
    } catch (e) {
      console.error(e)
    } finally {
      await dismissLoading();
    }

  });

  onIonViewWillLeave(() => {
    // Remove markers
    removeMarkers()

    // Destroy map
    if (map) {
      map.destroy();
    }

    // Destroy sheet modal
    if (drawer.value) {
      drawer.value.destroy({ animate: false });
    }
  });
  
  const initMap = async () => {
    // Show loading controller
    await showLoading()

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
    await moveCamera({
      lat: currentPosition.value.lat,
      lng: currentPosition.value.lng,
    }, 15);
  }

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
  const moveCamera = async (coords: LatLng, zoom: number) => {
    await map.setCamera({
      coordinate: {
        lat: coords.lat,
        lng: coords.lng
      },
      zoom: zoom,
      animate: true
    })
  }

  // Remove markers
  const removeMarkers = () => {
    if (markers.value.length > 0) {
      markers.value.forEach(async (marker) => {
        await map.removeMarker(marker)
      })

      markers.value = [];
    }
  }

  const locateHospitals = async () => {
    // Remove any markers on the map
    removeMarkers();

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

    const hospitalsWithDistance = await Promise.all(places.map(async (place: any) => {
      const distance = calculateDistance(currentPosition.value, {
        lat: place.Ng.lat(),
        lng: place.Ng.lng()
      });

      return {
        ...place,
        distance
      }
    }));

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

    return hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
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

      <div>
        <ion-drawer id="hospital-drawer">
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

            <AlertMessage type="warning" class="mb-4">
              Not every hospital has the capability to treat food allergens
            </AlertMessage>

            <ion-list v-if="hospitals.length > 0" lines="none" hide-on-bottom>
              <ion-item v-for="hospital in hospitals"
                        :key="hospital.id"
                        color="light"
                        class="rounded-lg shadow mb-3"
                        button
                        @click="async () => await moveCamera({ lat: hospital.Ng.lat(), lng: hospital.Ng.lng() }, 18)"
              >
                <ion-icon slot="start" icon="/icons/building-office.svg" aria-label="Navigate Icon" />
                <ion-label>
                  <h2 class="font-bold">
                    {{ hospital.Eg.displayName }}
                  </h2>
                  <p class="text-xs leading-tight !text-black/75">
                    {{ buildAddressString(hospital.Eg.addressComponents) }}
                  </p>
                </ion-label>
                <ion-badge slot="end">
                  {{ hospital.distance }}km
                </ion-badge>
              </ion-item>
            </ion-list>
          </div>
        </ion-drawer>
      </div>
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

  ion-list {
    background-color: transparent;
  }

  ion-icon.location-on {
    color: #FEEC37;
  }

  ion-drawer#hospital-drawer {
    ion-content {
      --background: white!important;
    }
  }
</style>