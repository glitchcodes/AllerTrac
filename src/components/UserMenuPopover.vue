<script setup lang="ts">
import { computed } from "vue";
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonIcon, popoverController, useIonRouter } from "@ionic/vue";
import { logOut, sparklesOutline } from "ionicons/icons";
import { useNetworkStore } from "@/store/network";
import type { User } from "@/types/User";

const ionRouter = useIonRouter();
const networkStore = useNetworkStore();

const props = defineProps<{
  user: User
}>();

const avatar = computed(() => {
  return props.user.avatar && props.user.avatar.length > 0 ? props.user.avatar : '/pfp.png';
});

const navigateToPage = (url: string) => {
  ionRouter.navigate(url, 'forward', 'push');

  popoverController.dismiss()
}

const logoutUser = async () => {
  // Redirect to log out page
  ionRouter.navigate('/logout', 'root', 'replace');

  // Dismiss the popover
  await popoverController.dismiss()
}
</script>

<template>
  <ion-content>
    <ion-list class="ion-no-padding">
      <ion-item>
        <ion-avatar aria-hidden="true" slot="start">
          <img alt="Profile Picture" :src="avatar" />
        </ion-avatar>
        <ion-label>
          <h3>{{ props.user.full_name }}</h3>
          <p>{{ props.user.email }}</p>
        </ion-label>
      </ion-item>
      <ion-item button @click="navigateToPage('/pages/attributions')">
        <ion-icon aria-hidden="true" :icon="sparklesOutline" slot="start"></ion-icon>
        <ion-label>Attributions</ion-label>
      </ion-item>
      <ion-item button :disabled="!networkStore._isConnected" @click="logoutUser">
        <ion-icon aria-hidden="true" :icon="logOut" slot="start"></ion-icon>
        <ion-label>Logout</ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<style scoped lang="scss">
  ion-content {
    --background: white;
    border-radius: 0.5rem;
  }
</style>