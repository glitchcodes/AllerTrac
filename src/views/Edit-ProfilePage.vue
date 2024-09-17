<script setup lang="ts">
import { IonButton, IonIcon, IonPage, IonContent } from '@ionic/vue';
import {fastFood, medkit, pencil, checkboxOutline, arrowBackOutline,} from 'ionicons/icons';
import SkeletonAllergens from "@/components/skeleton/SkeletonAllergens.vue";
import AllergenSelector from "@/components/AllergenSelector.vue";
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="flex justify-between mb-4">
        <ion-button class="active:shadow-lg active:scale-95 transition duration-200 ease-in-out items-center" color="primary" shape="round">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-button>
        <ion-button class="active:shadow-lg active:scale-95 transition duration-200 ease-in-out items-center" color="primary" shape="round">
          <ion-icon :icon="checkboxOutline"></ion-icon>
        </ion-button>
      </div>

      <h6 class="font-bold mb-4 text-2xl"><ion-icon :icon="pencil" class="mx-[12px]"></ion-icon>Edit Profile</h6>
      <div class="bg-white rounded-2xl shadow-xl p-4">
        <div class="flex items-center">
          <img class="w-[100px] mr-2" src="/pfp.png" alt="Food" />

      <!-- Start User Info Part-->
          <div>
            <ion-list class="p-0 m-0 bg-transparent">

              <ion-item class="text-primary text-sm mb-3">
                <ion-input type="text" label="First Name: " label-placement="stacked" :clear-input="true" placeholder="Juan"></ion-input>
              </ion-item>

              <ion-item class="text-primary text-sm mb-3">
                <ion-input type="text" label="Last Name: " label-placement="stacked" :clear-input="true" placeholder="Dela Cruz"></ion-input>
              </ion-item>

              <ion-item class="text-primary text-sm mb-3">
                <ion-input type="number" label="Phone Number: " label-placement="stacked" :clear-input="true"  placeholder="000"></ion-input>
              </ion-item>

              <ion-item class="text-primary text-sm mb-3">
                <ion-input label="Email Address: " type="email" label-placement="stacked" :clear-input="true"  placeholder="email@domain.com"></ion-input>
              </ion-item>

              <ion-item class="text-primary text-sm mb-3">
                <ion-input label="Birthday: " type="tel" label-placement="stacked" :clear-input="true"  placeholder="888-888-8888"></ion-input>
              </ion-item>
            </ion-list>
          </div>
     <!-- End User Info Part-->
        </div>
      </div>

      <!-- Start Allergens Part-->
      <div class="mt-5">
        <h6 class="font-bold mb-4 text-2xl"><ion-icon :icon="fastFood" class="mx-[12px]"></ion-icon>Food Allergies</h6>
        <div class="bg-primary rounded-2xl p-4">
          <Suspense>
            <AllergenSelector v-model="allergens" />

            <template #fallback>
              <SkeletonAllergens />
            </template>
          </Suspense>
        </div>
      </div>
      <!-- End Allergens Part-->

      <!-- Start Emergency Contacts Part-->
      <div class="mt-5">
        <h6 class="font-bold mb-4 text-2xl"><ion-icon :icon="medkit" class="mx-[12px]"></ion-icon>Emergency Contacts</h6>
        <div class="bg-white rounded-2xl p-4">
          <div class="flex items-center">
            <div>
                <ion-list class="p-0 m-0 bg-transparent">
                  <ion-item class="text-primary text-sm mb-3">
                    <ion-input type="text" label="Full Name: " label-placement="stacked" :clear-input="true" placeholder="Juana Dela Cruz"></ion-input>
                  </ion-item>

                  <ion-item class="text-primary text-sm mb-3">
                    <ion-input type="text" label="Relationship: " label-placement="stacked" :clear-input="true" placeholder="Wife"></ion-input>
                  </ion-item>

                  <ion-item class="text-primary text-sm mb-3">
                    <ion-input type="number" label="Phone Number: " label-placement="stacked" :clear-input="true"  placeholder="000"></ion-input>
                  </ion-item>

                  <ion-item class="text-primary text-sm mb-3">
                    <ion-input label="Email Address: " type="email" label-placement="stacked" :clear-input="true"  placeholder="email@domain.com"></ion-input>
                  </ion-item>
                </ion-list>
              <!-- End User Info Part-->
            </div>
          </div>
          <hr class="my-4 border-2 border-primary" />
          <div class="flex items-center">
            <div>
              <ion-list class="p-0 m-0 bg-transparent">
                <ion-item class="text-primary text-sm mb-3">
                  <ion-input type="text" label="Full Name: " label-placement="stacked" :clear-input="true" placeholder="Juanito Dela Cruz"></ion-input>
                </ion-item>

                <ion-item class="text-primary text-sm mb-3">
                  <ion-input type="text" label="Relationship: " label-placement="stacked" :clear-input="true" placeholder="Son"></ion-input>
                </ion-item>

                <ion-item class="text-primary text-sm mb-3">
                  <ion-input type="number" label="Phone Number: " label-placement="stacked" :clear-input="true"  placeholder="000"></ion-input>
                </ion-item>

                <ion-item class="text-primary text-sm mb-3">
                  <ion-input label="Email Address: " type="email" label-placement="stacked" :clear-input="true"  placeholder="email@domain.com"></ion-input>
                </ion-item>
              </ion-list>
            </div>
          </div>
        </div>
      </div>
  <!-- End Emergency Contact Part-->
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-item {
  --background: white;
}

ion-input{
  --margin:0px !important;
  --padding:0px !important;
}

</style>