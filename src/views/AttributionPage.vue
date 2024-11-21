<script setup lang="ts">
  import {
    IonPage,
    IonContent,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    isPlatform,
    useIonRouter
  } from "@ionic/vue";
  import { chevronBack } from "ionicons/icons";

  const ionRouter = useIonRouter();

  const handleBackButton = () => {
    ionRouter.back();
  }
</script>

<template>
  <ion-page>
    <ion-header v-if="isPlatform('ios')">
      <ion-toolbar>
        <ion-title>
          Attributions
        </ion-title>
        <ion-buttons slot="start">
          <ion-button @click="handleBackButton">
            <ion-icon aria-label="Back" :icon="chevronBack" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <nav v-if="!isPlatform('ios')" class="navbar flex items-center mb-4 gap-3 relative">
        <ion-button color="tertiary" shape="round" @click="handleBackButton">
          <ion-icon slot="icon-only" :icon="chevronBack" />
        </ion-button>
        <p class="font-bold text-xl text-nowrap absolute left-1/2 transform -translate-x-1/2">
          Attributions
        </p>
      </nav>

      <div class="bg-white rounded-lg p-4">
        <p class="text-center mb-4">AllerTrac wouldn't be possible without these APIs and resources.</p>

        <ion-list lines="full">
          <ion-item>
            <ion-label>
              <div>
                FoodVisor Vision
              </div>
              <ion-note>
                <a href="https://foodvisor.io" target="_blank">
                  foodvisor.io
                </a>
              </ion-note>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <div>
                Recipes API
              </div>
              <ion-note>
                <a href="https://developer.edamam.com" target="_blank">
                  developer.edamam.com
                </a>
              </ion-note>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <div>
                Food Allergy Information
              </div>
              <ion-note>
                <a href="https://foodallergy.org" target="_blank">
                  foodallergy.org
                </a>
              </ion-note>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <div>
                Notification (positive)
              </div>
              <ion-note>
                Sound Effect by <a href="https://pixabay.com/users/ribhavagrawal-39286533/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=230572" target="_blank">Ribhav Agrawal</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=230572" target="_blank">Pixabay</a>
              </ion-note>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <div>
                Siren Emergency Alarm (Alarm2.wav)
              </div>
              <ion-note>
                <a href="https://freesound.org/people/JomelleJager/sounds/256655/" target="_blank">Alarm 2.wav</a> by <a href="https://freesound.org/people/JomelleJager/" target="_blank">JomelleJager</a> | License: <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">Attribution 3.0</a>
              </ion-note>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <div>
                Beep Emergency Alarm (1 alarm short e.wav)
              </div>
              <ion-note>
                <a href="https://freesound.org/people/jobro/sounds/33732/" target="_blank">1 alarm short e.wav</a> by <a href="https://freesound.org/people/jobro/" target="_blank">jobro</a> | License: <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">Attribution 3.0</a>
              </ion-note>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-list {
    background-color: transparent;
  }

  ion-item {
    --background: white;
  }
</style>