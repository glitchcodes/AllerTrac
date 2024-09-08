<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { createOutline, logOutOutline, addOutline } from 'ionicons/icons';
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="flex justify-between mb-4">
        <ion-button color="primary" shape="round">
          <ion-icon :icon="createOutline"></ion-icon>
        </ion-button>
        <ion-button color="primary" shape="round">
          <ion-icon :icon="logOutOutline"></ion-icon>
        </ion-button>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-4">
        <div class="flex items-center">
          <img class="w-[130px] mr-2" src="/pfp.png" alt="Food" />
          <div>
            <h6 class="font-bold">Welcome!</h6>
            <h2 class="text-2xl text-primary font-bold mb-1">
              Juan Dela Cruz
            </h2>
            <ul class="text-primary text-sm mb-3">
              <li>Phone Number:</li>
              <li>Email Address:</li>
              <li>Birthday:</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <h6 class="font-bold mb-4">Food Allergies</h6>
        <div class="bg-primary rounded-2xl p-4">
          <div class="flex items-center">
              <h6 class="bg-white rounded-full px-4 p-1 text-primary font-bold mr-4">Tree Nuts</h6>
              <h6 class="bg-white rounded-full px-4 p-1 text-primary font-bold mr-4">Shellfish</h6>
              <h6 class="bg-white rounded-full px-4 p-1 text-primary font-bold mr-4">Dairy</h6>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <h6 class="font-bold mb-4">Emergency Contacts</h6>
        <div class="bg-white rounded-2xl p-4">
          <div class="flex items-center">
            <div>
              <h2 class="text-2xl text-primary font-bold">
                Juana Dela Cruz
              </h2>
              <ul class="text-primary text-sm mb-3">
                <li>Relationship:</li>
                <li>Phone Number:</li>
                <li>Email Address:</li>
              </ul>
            </div>
          </div>
          <hr class="my-4 border-2 border-primary" />
          <div class="flex items-center">
            <div>
              <h2 class="text-2xl text-primary font-bold">
                Juanito Dela Cruz
              </h2>
              <ul class="text-primary text-sm mb-3">
                <li>Relationship:</li>
                <li>Phone Number:</li>
                <li>Email Address:</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <div class="flex items-center mb-4 justify-between">
          <h6 class="font-bold">Alarms</h6>
          <div class="flex">
            <ion-button color="primary" shape="round">
              <ion-icon :icon="addOutline"></ion-icon>
            </ion-button>
            <ion-button color="primary" shape="round">
              <ion-icon :icon="createOutline"></ion-icon>
            </ion-button>
          </div>
        </div>
        <div class="bg-primary rounded-2xl p-4 flex items-center justify-center">
          <div class="flex items-center justify-between w-full">
            <div class="bg-white rounded-2xl p-6 text-primary font-bold flex items-center w-full justify-between">
              <h2 class="text-2xl text-primary font-bold">
                9:00PM
              </h2>
              <label class="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>