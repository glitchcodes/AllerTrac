<script setup lang="ts">
  import {
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButtons,
    IonButton,
    isPlatform
  } from "@ionic/vue";
  import { chevronBack } from "ionicons/icons";
  import ConnectedAccounts from "@/components/profile/ConnectedAccounts.vue";
  import SkeletonConnectedAccounts from "@/components/skeleton/SkeletonConnectedAccounts.vue";
  import ChangePassword from "@/components/profile/ChangePassword.vue";
  import SkeletonChangePassword from "@/components/skeleton/SkeletonChangePassword.vue";
</script>

<template>
  <ion-page>
    <ion-header v-if="isPlatform('ios')">
      <ion-toolbar>
        <ion-title>
          Security
        </ion-title>
        <ion-buttons slot="start">
          <ion-button router-link="/pages/profile" router-direction="back">
            <ion-icon aria-label="Back" :icon="chevronBack" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <nav v-if="!isPlatform('ios')" class="navbar flex items-center mb-4 gap-3 relative">
        <ion-button color="tertiary" shape="round" router-link="/pages/profile" router-direction="back">
          <ion-icon slot="icon-only" :icon="chevronBack" />
        </ion-button>
        <p class="font-bold text-xl text-nowrap absolute left-1/2 transform -translate-x-1/2">
          Security
        </p>
      </nav>

      <div class="flex flex-col gap-8">
        <Suspense>
          <ChangePassword />

          <template #fallback>
            <SkeletonChangePassword />
          </template>
        </Suspense>

        <Suspense>
          <ConnectedAccounts />

          <template #fallback>
            <SkeletonConnectedAccounts />
          </template>
        </Suspense>
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>