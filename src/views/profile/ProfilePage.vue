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
    SegmentCustomEvent, isPlatform
  } from '@ionic/vue';
  import { createOutline, logOutOutline } from 'ionicons/icons';
  import ProfileCard from "@/components/profile/ProfileCard.vue";
  import AllergensSegment from "@/components/profile/AllergensSegment.vue";
  import EmergencyContactsSegment from "@/components/profile/EmergencyContactsSegment.vue";
  import AlarmsSegment from "@/components/profile/AlarmsSegment.vue";

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
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="isPlatform('ios')">
        <ion-buttons slot="secondary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">

      <div v-if="!isPlatform('ios')" class="flex justify-between mb-4">
        <ion-button class="active:shadow-lg active:scale-95 transition duration-200 ease-in-out items-center" color="primary" shape="round">
          <ion-icon :icon="createOutline"></ion-icon>
        </ion-button>
        <ion-button class="active:shadow-lg active:scale-95 transition duration-200 ease-in-out items-center" color="primary" shape="round">
          <ion-icon :icon="logOutOutline"></ion-icon>
        </ion-button>
      </div>

      <ProfileCard class="mb-4" />

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
          <component :is="segments[currentSegment]" class="my-4"></component>
        </keep-alive>
      </transition>

    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>