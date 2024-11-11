<script setup lang="ts">
import { IonIcon, IonButton, IonRippleEffect, isPlatform } from "@ionic/vue";
import { addSharp, alarm } from "ionicons/icons";
  import InfoAlert from "@/components/alert/InfoAlert.vue";
</script>

<template>
  <div class="bg-white shadow-md p-4 rounded-lg">
    <div class="flex items-center justify-between">

      <div class="flex flex-grow items-center text-2xl gap-2">
        <ion-icon :icon="alarm" />
        <h6 class="text-xl font-bold flex-grow">
          Alarms
        </h6>

        <ion-button v-if="isPlatform('ios')" fill="outline" router-link="/pages/alarms/create" router-direction="forward">
          <ion-icon slot="icon-only" aria-label="Save" :icon="addSharp"></ion-icon>
        </ion-button>

        <ion-button v-else fill="outline" shape="round" router-link="/pages/alarms/create" router-direction="forward">
          <ion-icon slot="start" aria-label="Save" :icon="addSharp"></ion-icon>
          <span>New</span>
        </ion-button>
      </div>

    </div>

    <InfoAlert class="my-4">
      Tap on an alarm to edit it
    </InfoAlert>

    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between w-full ion-activatable ripple-parent">
        <ion-ripple-effect></ion-ripple-effect>
        <div class="bg-neutral-100 rounded-2xl p-6 text-primary font-bold flex items-center w-full justify-between border-2 shadow-md">
          <h2 class="text-2xl text-primary font-bold">
            9:00PM
          </h2>
          <label class="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" />
            <span class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></span>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between w-full ion-activatable ripple-parent overflow-hidden">
        <ion-ripple-effect></ion-ripple-effect>
        <div class="bg-neutral-100 rounded-2xl p-6 text-primary font-bold flex items-center w-full justify-between border-2 shadow-md">
          <h2 class="text-2xl text-primary font-bold">
            10:00PM
          </h2>
          <label class="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" />
            <span class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></span>
          </label>
        </div>
      </div>
    </div>

<!--    <div class="bg-primary rounded-2xl p-4 flex items-center justify-center">-->
<!--      -->
<!--    </div>-->
  </div>
</template>

<style scoped lang="scss">

</style>