<script setup lang="ts">
  import { ref, computed } from "vue";
  import { vIntersectionObserver } from "@vueuse/components";
  import { useScannerStore } from "@/store/useScannerStore";
  import { useAllergenStore } from "@/store/allergen";
  import {
    IonPage,
    IonContent,
    IonToolbar,
    IonTitle,
    IonProgressBar,
    IonItem,
    IonLabel,
    IonAccordionGroup,
    IonAccordion,
    IonChip,
    IonIcon,
    onIonViewWillLeave,
    onIonViewWillEnter,
    isPlatform
  } from "@ionic/vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { Capacitor } from "@capacitor/core";
  import { StatusBar } from "@capacitor/status-bar";
  import { alertCircleOutline } from "ionicons/icons";

  import WarningAlert from "@/components/alert/WarningAlert.vue";
  import InfoAlert from "@/components/alert/InfoAlert.vue";

  const scannerStore = useScannerStore();
  const allergenStore = useAllergenStore();

  const isFetching = ref(true);
  const isToolbarVisible = ref(false);

  const imageURL = ref("");
  const capturedImage = ref();

  const ingredients = ref();

  const scanImage = async () => {
    try {
      isFetching.value = true;

      const body = {
        image: scannerStore.capturedImage
      }

      // const response = await useFetchAPI({
      //   url: 'http://localhost:8100/dummy.json',
      //   method: 'GET'
      // })

      const response = await useFetchAPI({
        url: '/meal/scan',
        method: 'POST',
        data: body
      });

      if (response.status === 200) {
        ingredients.value = response.data.payload.items;
      }
    } catch (error) {
      console.error(error)
    } finally {
      isFetching.value = false;
    }
  }

  onIonViewWillEnter(async () => {
    capturedImage.value = scannerStore.capturedImageBlob;
    imageURL.value = scannerStore.capturedImage;

    // Analyze the image through FoodVisor
    if (capturedImage.value) {
      await scanImage()
    }

    // Make the status bar transparent
    const isAndroid = isPlatform('android');

    if (Capacitor.isNativePlatform()) {
      if (isAndroid) {
        await StatusBar.setOverlaysWebView({ overlay: true });
      }
    }
  });

  onIonViewWillLeave(() => {
    // imageURL.value = "";
    scannerStore.resetCapturedImage();
  });

  const confidenceChipLevel = (value: number) => {
    const confidence = value * 100;
    let chipClass: string

    if (confidence > 90) {
      chipClass = 'success';
    } else if (confidence > 70) {
      chipClass = 'warning';
    } else {
      chipClass = 'danger';
    }

    return chipClass;
  }

  const onIntersection = async ([{ isIntersecting }]: IntersectionObserverEntry[]) => {
    isToolbarVisible.value = !isIntersecting;

    if (isIntersecting) {
      await StatusBar.setOverlaysWebView({ overlay: true });
    } else {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: '#ffffff' })
    }
  }

  // Generate colors for annotation
  const getRandomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
  }

  const annotationColors = computed(() => {
    const array = [];
    
    for (let i = 0; i < ingredients.value.length; i++) {
      const color = getRandomColor();
      const rgbaColor = (color: string, alpha: number): string =>
          color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);

      array.push({
        borderColor: rgbaColor(color, 0.4),
        backgroundColor: rgbaColor(color, 0.2),
        textBgColor: rgbaColor(color, 0.5)
      });
    }
    
    return array;
  });

  const isAllergic = (allergen: string) => {
    const allergens = allergenStore._allergens;

    return allergens.some(item => item.name.includes(allergen));
  }

  const showDangerIcon = (allergens: any[]) => {
    const detected: string[] = [];
    const userAllergens = allergenStore._allergens;
    
    allergens.forEach(allergens => {
      if (userAllergens.some(item => item.name.includes(allergens.name))) {
        detected.push(allergens)
      }
    })
    
    return detected;
  }

</script>

<template>
  <ion-page>
    <ion-toolbar v-if="!isFetching && isToolbarVisible">
      <ion-title>Identifiable Foods</ion-title>
    </ion-toolbar>

    <ion-content>
      <div v-if="isFetching" class="flex items-center justify-center h-full">
        <div class="w-1/4">
          <p class="text-center mb-2">Analyzing...</p>
          <ion-progress-bar type="indeterminate" />
        </div>
      </div>

      <div v-if="!isFetching" class="">
        <div class="relative">
          <img :src="imageURL" alt="Captured Food" />

          <div v-if="ingredients && ingredients.length > 0">
            <div v-for="(item, index) in ingredients"
                 :key="'item-' + index"
                 class="absolute border-[4px] rounded-xl flex flex-col items-center justify-center"
                 :style="{
                 height: `${item.position.height * 100}%`,
                 width: `${item.position.width * 100}%`,
                 top: `${item.position.y * 100}%`,
                 left: `${item.position.x * 100}%`,
                 borderColor: annotationColors[index].borderColor,
                 backgroundColor: annotationColors[index].backgroundColor
               }">
              <p class="font-bold text-white px-2 py-1 rounded-md" :style="{ backgroundColor: annotationColors[index].textBgColor }">
                {{ item.food[0].food_info.display_name }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-secondary p-2 -mt-3 rounded-xl relative">
          <div class="bg-primary ion-padding rounded-lg" v-intersection-observer="onIntersection">
            <h5 class="text-2xl font-bold">
              Identifiable Foods
            </h5>
          </div>

          <div v-if="ingredients && ingredients.length > 0">
            <WarningAlert class="my-4">
              These results may not be accurate. Always double-check for correct information.
            </WarningAlert>

            <ion-accordion-group ref="accordionGroup" :multiple="true">
              <ion-accordion v-for="(item, index) in ingredients" :value="'food-' + index" :key="'food-' + index">
                <ion-item slot="header" color="light">
                  <ion-label>
                    <div class="flex items-center gap-3">
                      <ion-chip :color="confidenceChipLevel(item.food[0].confidence)" class="shadow">
                        <small>
                          {{ (item.food[0].confidence * 100).toFixed(2) }}%
                        </small>
                      </ion-chip>
                      <h3 class="flex-1">
                        {{ item.food[0].food_info.display_name }}
                      </h3>
                      <ion-icon v-if="showDangerIcon(item.food[0].food_info.allergens).length > 0"
                                :icon="alertCircleOutline"
                                color="danger" />
                    </div>
                  </ion-label>
                </ion-item>
                <div class="ion-padding" slot="content">
                  <div v-if="item.food[0].food_info.allergens && item.food[0].food_info.allergens.length > 0">
                    <p class="text-sm mb-2">
                      This food may contain the following:
                    </p>

                    <ion-chip v-for="(allergen, index) in item.food[0].food_info.allergens"
                              :key="index" :color="isAllergic(allergen.name) ? 'danger' : 'primary'">
                      <ion-icon v-if="isAllergic(allergen.name)" :icon="alertCircleOutline"></ion-icon>
                      <ion-label>{{ allergen.name }}</ion-label>
                    </ion-chip>
                  </div>
                  <p v-else class="text-sm">
                    No allergens were found for this ingredient
                  </p>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </div>

          <InfoAlert v-else class="my-4">
            There were no ingredients found on the image. Make sure the image is very clear and is in clear light for
            proper detection
          </InfoAlert>
        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-accordion {
    border-radius: 8px;
    margin-bottom: 1rem;

    &:deep(ion-chip) {
      margin: auto 0;
    }
  }

  .canvas-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    width: 100%;
    height: 100%
  }
</style>