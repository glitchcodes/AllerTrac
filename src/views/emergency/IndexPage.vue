<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonButtons,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    isPlatform, SelectCustomEvent
  } from "@ionic/vue";
  import { ellipsisHorizontal, logIn, navigateOutline } from "ionicons/icons";

  import { useAuthStore } from "@/store/auth";
  import { useNetworkStore } from "@/store/network";
  import { useEmergencyStore } from "@/store/emergency";
  import { useMenuNav } from "@/composables/useMenuNav";

  import AlertButton from "@/components/AlertButton.vue";
  import AlertMessage from "@/components/AlertMessage.vue";

  const authStore = useAuthStore();
  const networkStore = useNetworkStore();
  const emergencyStore = useEmergencyStore();
  const { openUserMenu } = useMenuNav();

  const ringtone = ref<string>('');

  onMounted(async () => {
    await emergencyStore.getSelectedRingtone()

    ringtone.value = emergencyStore.ringtone;
  });

  const handleUpdateRingtone = async (e: SelectCustomEvent) => {
    ringtone.value = e.detail.value;

    await emergencyStore.updateSelectedRingtone(ringtone.value)
  }

  // Animations
  const onBeforeEnter = (el: any) => {
    el.style.opacity = 0;
  }

  const onEnter = (el: any, done: any) => {
    el.offsetHeight;
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = 1;

    done();
  }

  const onLeave = (el: any, done: any) => {
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = 0;
    done();
  }
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="isPlatform('ios')">
        <ion-title>Emergency</ion-title>

        <ion-buttons slot="primary">
          <ion-button v-if="authStore._isLoggedIn" @click="openUserMenu">
            <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
          </ion-button>
          <ion-button v-else router-link="/u/login" shape="round">
            <ion-icon slot="icon-only" aria-label="Login Button" :icon="logIn"></ion-icon>
          </ion-button>
        </ion-buttons>

      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <div v-if="!isPlatform('ios')" class="bg-white rounded-lg shadow-lg w-full text-center p-4 mb-6">
        <h1 class="text-2xl font-bold text-[#eb0c1b] ion-text-uppercase">
          Emergency
        </h1>
      </div>

      <AlertMessage v-if="!authStore._isLoggedIn" type="warning" class="shadow mb-4">
        Sending alerts to emergency contacts are only available to registered users
      </AlertMessage>

      <div class="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md px-4 py-8 gap-6 mb-4"
           :class="{ 'border-2 border-[#eb0c1b]': emergencyStore.isAlertActivated }">

        <transition-group name="fade" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">

          <h1 v-if="!emergencyStore.isAlertActivated" class="text-2xl font-bold text-primary text-center" :key="'text-1'">
            Having an Allergic Reaction?
          </h1>

          <AlertButton :key="'alert-button'" />

          <div v-if="emergencyStore.isAlertActivated" class="text-center" :key="'text-2'">
            <h1 class="text-2xl font-bold text-[#eb0c1b] mb-2">
              Alarm has been triggered
            </h1>

            <p>
              An alert has been activated, notifying individuals in your vicinity. Your emergency contacts have also been informed.
            </p>
          </div>

          <div v-else class="text-center" :key="'text-3'">
            <h1 class="text-2xl font-bold text-[#eb0c1b] mb-2">
              Press and Hold
            </h1>

            <p>to alert people around you and your emergency contacts</p>
          </div>
        </transition-group>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-4 mb-4">
        <div class="flex items-center">
          <p class="flex-1">Locate Nearby Hospitals</p>
          <ion-button shape="round"
                      router-link="/pages/emergency/hospitals"
                      router-direction="forward"
                      :disabled="!networkStore._isConnected"
          >
            <ion-icon slot="icon-only" aria-label="Navigate" :icon="navigateOutline" />
          </ion-button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-md">
        <h5 class="text-xl font-bold mb-2">
          Settings
        </h5>

        <ion-list lines="none">
          <ion-item>
            <ion-select label="Ringtone" label-placement="fixed" placeholder="Sound" :value="ringtone" @ionChange="handleUpdateRingtone">
              <ion-select-option value="siren-alert">
                Siren
              </ion-select-option>
              <ion-select-option value="beep-alert">
                Beep
              </ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  //.custom-flex {
  //  height: calc(100% - 16px - 64px - 24px);
  //}

  ion-list {
    background: white;
    padding: 0;
  }

  ion-item {
    --background: white;
    --padding-start: 0;
    --inner-padding-end: 0;
  }
</style>