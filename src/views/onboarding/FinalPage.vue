<script setup lang="ts">
import {IonButton, IonContent, IonPage} from "@ionic/vue";
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col h-full items-center justify-center gap-4">
          <!-- <LogoComponent /> -->

          <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

            <div class="mb-4">
              <h5 class="text-primary text-2xl font-bold text-center">
                Take a picture
              </h5>

              <p class="mt-4 text-center">
                Snap a pic of your meal to uncover the secret ingredients before digging in!
              </p>

              <img class="w-[60px] mx-auto my-4" src="/images/onboarding-final-1.png" alt="Camera"/>
            </div>

            <div class="my-4">
              <h5 class="text-primary text-2xl font-bold text-center">
                Search your meal
              </h5>

              <p class="mt-4 text-center">
                Search your plate to unveil the mysterious cast of characters in your meal!
              </p>

              <img class="w-[60px] mx-auto my-4" src="/images/onboarding-final-2.png" alt="Search"/>
            </div>

            <div class="my-4">
              <h5 class="text-primary text-2xl font-bold text-center">
                Nearest hospital
              </h5>

              <p class="mt-4 text-center">
                Find the nearest hospital just a hop, skip, and a jump away (within a 5-10km radius).
              </p>

              <img class="w-[60px] mx-auto my-4" src="/images/onboarding-final-3.png" alt="Hospital"/>
            </div>

            <div class="flex mt-6">
              <ion-button router-link="/o/allergies" router-direction="back" fill="outline" shape="round" class="w-full">
                Back
              </ion-button>
              <ion-button router-link="/pages/home" router-direction="root" shape="round" class="w-full">
                Next
              </ion-button>
            </div>

          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-content {
    --ion-background-color: transparent;
    background-image: url("/images/auth-bg.png");
    background-size: cover;
  }
</style>