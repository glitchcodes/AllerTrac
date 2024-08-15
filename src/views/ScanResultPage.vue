<script setup lang="ts">
  import { ref } from "vue";
  import { useScannerStore } from "@/store/useScannerStore";
  import { IonPage, IonContent, IonProgressBar, IonList, IonItem, IonLabel, onIonViewWillLeave, onIonViewWillEnter } from "@ionic/vue";
  import { useFoodVisorAPI } from "@/composables/useFoodVisorAPI";
  import {useFetch} from "@vueuse/core";

  const scannerStore = useScannerStore();

  const imageURL = ref("");
  const capturedImage = ref();

  const payload = new FormData()
  payload.append('scopes[]', 'multiple_items');
  payload.append('scopes[]', 'position');

  // const { isFetching, error, data, execute } = useFetch("/dummy.json").get().json()

  const { isFetching, error, data, execute } = useFoodVisorAPI(
      'https://proxy.cors.sh/https://vision.foodvisor.io/api/1.0/en/analysis/',
      {
      beforeFetch({ options }) {
        options.headers = {
          ...options.headers,
        }
      },
      immediate: false
    }).post(payload).json();

  onIonViewWillEnter(() => {
    capturedImage.value = scannerStore.capturedImageBlob;
    payload.append('image', capturedImage.value);

    // Analyze the image through FoodVisor
    if (capturedImage.value) {
      execute();

      if (data.value) {
        imageURL.value = scannerStore.capturedImage;
        console.log(scannerStore.capturedImage);
      }
    }
  })

  onIonViewWillLeave(() => {
    imageURL.value = "";
    scannerStore.resetCapturedImage();
  })
</script>

<template>
  <ion-page>
    <ion-content>
      <div v-if="isFetching" class="flex items-center justify-center h-full">
        <div class="w-1/4">
          <p class="text-center mb-2">Analyzing...</p>
          <ion-progress-bar type="indeterminate" />
        </div>
      </div>

      <div v-if="!isFetching && data" class="">
        <img :src="imageURL" />

        <div class="bg-primary p-5">
          <h5 class="text-2xl font-bold">
            Identifiable Food
          </h5>
        </div>

        <div class="py-5" v-for="item in data.items">
          <h5 class="font-bold px-4">Ingredient 1</h5>
          <ion-list>
            <ion-item v-for="food in item.food">
              <ion-label>
                <p>{{ food.food_info.display_name }}</p>
                <p>{{ food.confidence * 100 }}%</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>