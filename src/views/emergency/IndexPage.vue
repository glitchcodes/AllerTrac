<script setup lang="ts">
  import { IonPage, IonContent, IonButton } from "@ionic/vue";
  import { useAuthStore } from "@/store/auth";
  import { useEmergencyStore } from "@/store/emergency";

  import AlertButton from "@/components/AlertButton.vue";
  import WarningAlert from "@/components/alert/WarningAlert.vue";

  const authStore = useAuthStore();
  const emergencyStore = useEmergencyStore();

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
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="bg-white/50 rounded-lg shadow-lg w-full text-center p-4 mb-6">
        <h1 class="text-2xl font-bold text-[#eb0c1b] ion-text-uppercase">
          Emergency
        </h1>
      </div>

      <div class="flex flex-col items-center justify-center bg-white/50 rounded-2xl shadow-2xl p-4 gap-6 custom-flex"
           :class="{ 'border-2 border-[#eb0c1b]': emergencyStore.isAlertActivated }">

        <transition-group name="fade" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
          <WarningAlert v-if="!authStore._isLoggedIn"
                        class="shadow"
                        text="Sending alerts to emergency contacts are only available to registered users"
          />

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

          <div class="border-t-[1px] border-gray-300 w-1/2 my-5" :key="'border'"></div>

          <ion-button shape="round" :key="'button'">
            Locate nearby hospitals
          </ion-button>
        </transition-group>

      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  .custom-flex {
    height: calc(100% - 16px - 64px - 24px);
  }
</style>