<script setup lang="ts">
import { useRouter } from "vue-router";
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonIcon, popoverController } from "@ionic/vue";
import { logOut } from "ionicons/icons";
import type { User } from "@/types/User";
import {computed} from "vue";

const router = useRouter();

const props = defineProps<{
  user: User
}>();

const avatar = computed(() => {
  return props.user.avatar && props.user.avatar.length > 0 ? props.user.avatar : '/pfp.png';
})

const logoutUser = async () => {
  // Redirect to log out page
  await router.push({ name: 'logout' });

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
      <ion-item button @click="logoutUser">
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