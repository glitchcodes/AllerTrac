<script setup lang="ts">
  import { ref } from "vue";
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
    IonPopover,
    IonListHeader,
    IonList,
    IonItem,
    isPlatform,
    SegmentCustomEvent,
    useIonRouter
  } from '@ionic/vue';
  import {
    createOutline,
    ellipsisHorizontal,
    keyOutline,
    logOut,
    menu,
    sparklesOutline
  } from 'ionicons/icons';
  import ProfileCard from "@/components/profile/ProfileCard.vue";
  import { useNetworkStore } from "@/store/network";
  import { useAuthStore } from "@/store/auth";
  import { useAlertController } from "@/composables/useAlertController";

  // Load immediately
  import AllergensSegment from "@/components/profile/AllergensSegment.vue";
  import EmergencyContactsSegment from "@/components/profile/EmergencyContactsSegment.vue";
  import AlarmsSegment from "@/components/profile/AlarmsSegment.vue";

  const ionRouter = useIonRouter();
  const networkStore = useNetworkStore();
  const authStore = useAuthStore();
  const alertController = useAlertController();

  const isMenuOpen = ref<boolean>(false);
  const popoverEvent = ref<Event|null>();

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

  const openMenu = (e: Event) => {
    isMenuOpen.value = true;
    popoverEvent.value = e;
  }

  const navigateToPage = (url: string) => {
    ionRouter.navigate(url, 'forward', 'push');

    isMenuOpen.value = false;
    popoverEvent.value = null;
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
          handler: () => {
            ionRouter.navigate('/logout', 'root', 'replace')
          }
        },
      ]
    })

    isMenuOpen.value = false;
    popoverEvent.value = null;
  }
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="isPlatform('ios')">
        <ion-buttons slot="primary">
          <ion-button @click="openMenu($event)">
            <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">

      <nav v-if="!isPlatform('ios')" class="flex items-center flex-end mb-4">
        <p class="font-bold text-xl absolute left-1/2 transform -translate-x-1/2">
          Profile
        </p>

        <ion-button color="tertiary" shape="round" @click="openMenu($event)">
          <ion-icon slot="icon-only" :icon="menu"></ion-icon>
        </ion-button>
      </nav>

      <template v-if="authStore._isLoggedIn">
        <ProfileCard :user="authStore._user!" class="mb-4"></ProfileCard>
      </template>

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

      <ion-popover
          :is-open="isMenuOpen"
          :event="popoverEvent"
          class="user-options"
          @didDismiss="isMenuOpen = false"
      >
        <ion-content>
          <ion-list class="ion-no-padding">
            <ion-list-header>
              <ion-label>Profile</ion-label>
            </ion-list-header>
            <ion-item button :disabled="!networkStore._isConnected" @click="navigateToPage('/pages/profile/edit')">
              <ion-icon aria-hidden="true" :icon="createOutline" slot="start"></ion-icon>
              <ion-label>Edit Profile</ion-label>
            </ion-item>
            <ion-item button :disabled="!networkStore._isConnected" @click="navigateToPage('/pages/profile/security')">
              <ion-icon aria-hidden="true" :icon="keyOutline" slot="start"></ion-icon>
              <ion-label>Security</ion-label>
            </ion-item>
          </ion-list>

          <ion-list class="ion-no-padding">
            <ion-list-header>
              <ion-label>Others</ion-label>
            </ion-list-header>
            <ion-item button @click="navigateToPage('/pages/attributions')">
              <ion-icon aria-hidden="true" :icon="sparklesOutline" slot="start"></ion-icon>
              <ion-label>Attributions</ion-label>
            </ion-item>
            <ion-item button :disabled="!networkStore._isConnected" @click="handleLogout">
              <ion-icon aria-hidden="true" :icon="logOut" slot="start"></ion-icon>
              <ion-label>Logout</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>
    </ion-content>
  </ion-page>
</template>

<style scoped>
  ion-popover.user-options {
    --min-width: 250px;
    ion-content {
      --ion-background-color: white;
    }
  }
</style>