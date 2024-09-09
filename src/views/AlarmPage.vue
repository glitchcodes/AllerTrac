<script lang="ts">
import {IonContent, IonDatetime, IonPage, IonToggle} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonDatetime, IonToggle, IonPage, IonContent },
});
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <img class="w-[130px] mx-auto d-block" src="/images/logo.png" alt="Food" />
      <div class="mt-5">
        <div class="bg-primary rounded-2xl p-4 flex items-center justify-center">
          <h1 class="text-4xl font-bold">Alarm</h1>
        </div>
      </div>
      <div class="mt-5">
        <div class="bg-white rounded-2xl p-4">
          <div class="flex justify-center text-center">
            <ion-datetime presentation="time" size="cover"></ion-datetime>
          </div>
          <ul class="text-primary mt-4">
            <li class="py-1"><h1 class="text-2xl font-bold">Repeat</h1></li>
            <li class="py-1"><h1 class="text-2xl font-bold">Label</h1></li>
            <li class="py-1"><h1 class="text-2xl font-bold">Sound</h1></li>
            <li class="py-1">
              <div class="flex justify-between">
                <h1 class="text-2xl font-bold">Snooze</h1>
                <ion-toggle aria-label="Success toggle" color="success" :checked="true"></ion-toggle>
              </div>
            </li>
          </ul>
        </div>
        <div class="mt-4 flex justify-center">
          <ion-button class="mr-2" shape="round" fill="outline">Cancel</ion-button>
          <ion-button class="px-4" shape="round">Save</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>