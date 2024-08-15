<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="flex items-center mb-2">
        <ion-icon class="text-2xl primary" aria-hidden="true" :icon="fastFood" />
        <h5 class="font-bold ms-2 mt-1">
          About to eat?
        </h5>
      </div>
      <h1 class="text-4xl font-bold">
        Juan Dela Cruz
      </h1>

      <div class="bg-white rounded-2xl shadow-xl p-5 mt-6">
        <div class="flex items-center">
          <div>
            <h2 class="text-2xl text-primary font-bold mb-3">
              Feeling better!
            </h2>
            <p>
              Scan your preferred food to view the ingredients and ensure it's safe for any allergies you might have!
            </p>
          </div>
          <img class="w-[130px]" src="/food1.png" alt="Food" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { IonPage, IonContent, IonIcon } from '@ionic/vue';
  import { fastFood } from "ionicons/icons";
</script>

<style scoped lang="scss">

</style>
