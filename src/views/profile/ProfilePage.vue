<script setup lang="ts">
  import { defineAsyncComponent, ref } from "vue";
  import {
    IonButton,
    IonIcon,
    IonHeader,
    IonPage,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonSpinner,
    isPlatform,
    SegmentCustomEvent
  } from '@ionic/vue';
  import { createOutline, logOutOutline } from 'ionicons/icons';
  import { useRouter } from 'vue-router'
  import { useAuthStore } from "@/store/auth";
  import { useAlertController } from "@/composables/useAlertController";

  // Load immediately
  import AllergensSegment from "@/components/profile/AllergensSegment.vue";
  import EmergencyContactsSegment from "@/components/profile/EmergencyContactsSegment.vue";
  import AlarmsSegment from "@/components/profile/AlarmsSegment.vue";

  // Lazy-load
  const ProfileCard = defineAsyncComponent(() => import("@/components/profile/ProfileCard.vue"));

  const router = useRouter();
  const authStore = useAuthStore();
  const alertController = useAlertController();

  const segments: any = {
    AllergensSegment,
    EmergencyContactsSegment,
    AlarmsSegment
  }

  const currentSegment = ref<string>("AllergensSegment");

  const handleSegmentChange = (e: SegmentCustomEvent) => {
    if (typeof e.detail.value === "string") {
      currentSegment.value = e.detail.value
    }
  }

  const handleLogout = async () => {
    // Show alert to confirm changes
    await alertController.presentAlert({
      header: "Logout",
      message: "You will lose to several features until you login again",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: async () => {
            await router.push({ name: 'logout' })
          }
        },
      ]
    })
  }
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="isPlatform('ios')">
        <ion-buttons slot="secondary">
          <ion-button router-link="/pages/profile/edit" router-direction="forward">
            <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button @click="handleLogout">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">

      <nav v-if="!isPlatform('ios')" class="flex items-center justify-between mb-4">
        <ion-button color="tertiary" shape="round" router-link="/pages/profile/edit" router-direction="forward">
          <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
        </ion-button>
        <p class="font-bold text-xl absolute left-1/2 transform -translate-x-1/2">
          Profile
        </p>
        <ion-button color="tertiary" shape="round" @click="handleLogout">
          <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
        </ion-button>
      </nav>

      <ProfileCard :user="authStore._user!" class="mb-4" />

      <div class="bg-white overflow-hidden shadow rounded-lg" :class="{ 'p-2': isPlatform('ios') }">
        <ion-segment :value="currentSegment" color="primary" @ionChange="handleSegmentChange">
          <ion-segment-button value="AllergensSegment">
            <ion-label>Allergies</ion-label>
          </ion-segment-button>
          <ion-segment-button value="EmergencyContactsSegment">
            <ion-label>Contacts</ion-label>
          </ion-segment-button>
          <ion-segment-button value="AlarmsSegment">
            <ion-label>Alarms</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <transition enter-active-class="animate__animated animate__slideInLeft"
                  leave-active-class="animate__animated animate__slideOutRight"
                  mode="out-in">
        <keep-alive>
          <suspense>
            <component :is="segments[currentSegment]" class="my-4"></component>

            <template #fallback>
              <div class="bg-white shadow-md p-4 rounded-lg h-[250px] my-4">
                <div class="flex h-full items-center justify-center">
                  <ion-spinner name="dots"></ion-spinner>
                </div>
              </div>
            </template>
          </suspense>
        </keep-alive>
      </transition>

    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>