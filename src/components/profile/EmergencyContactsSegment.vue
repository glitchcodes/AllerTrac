<script setup lang="ts">
  import {
    IonButton,
    IonIcon,
    isPlatform,
    modalController
  } from "@ionic/vue";

  import { medkit, add } from "ionicons/icons";
  import CreateContactModal from "@/components/modal/CreateContactModal.vue";
  import EmergencyContactsList from "@/components/EmergencyContactsList.vue";
  import SkeletonContacts from "@/components/skeleton/SkeletonContacts.vue";
  import { StatusBar } from "@capacitor/status-bar";

  const openCreateModal = async () => {
    const modal = await modalController.create({
      component: CreateContactModal
    });

    await modal.present();

    // Show status bar on present
    if (isPlatform('android')) {
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    }

    // Change status bar to transparent on dismiss
    const dismissEvent = await modal.onWillDismiss();

    if (dismissEvent.role == 'confirm' || dismissEvent.role == 'cancel') {
      if (!isPlatform('android')) return;

      await StatusBar.setBackgroundColor({ color: '#efeee9' });
    }
  }
</script>

<template>
  <div class="bg-white shadow-md p-4 rounded-lg">
    <div class="flex flex-grow items-center text-xl gap-2 mb-4">
      <ion-icon :icon="medkit" class="card-icon" />
      <h6 class="font-bold flex-grow">
        Emergency Contacts
      </h6>

      <ion-button v-if="isPlatform('ios')" fill="outline" @click="openCreateModal">
        <ion-icon slot="icon-only" aria-label="New contact" :icon="add"></ion-icon>
      </ion-button>

      <ion-button v-else fill="outline" shape="round" @click="openCreateModal">
        <ion-icon slot="start" aria-label="New contact" :icon="add"></ion-icon>
        <span class="ms-1">New</span>
      </ion-button>
    </div>

    <Suspense>
      <EmergencyContactsList />

      <template #fallback>
        <SkeletonContacts />
      </template>
    </Suspense>

  </div>
</template>

<style scoped lang="scss">
  ion-icon.card-icon {
    min-width: 24px;
    width: 24px;
    height: 24px;
  }
</style>