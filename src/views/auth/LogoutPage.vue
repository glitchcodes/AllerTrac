<script setup lang="ts">
  import { ref } from "vue";
  import { IonPage, IonContent, IonSpinner, IonButton, onIonViewDidEnter } from '@ionic/vue';
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/store/auth";
  import { useAllergenStore } from "@/store/allergen";
  import { useBookmarkStore } from "@/store/bookmark";
  import { useContactStore } from "@/store/contact";
  import { useAlarmStore } from "@/store/alarm";
  import { useFetchAPI } from "@/composables/useFetchAPI";

  const router = useRouter();
  const authStore = useAuthStore();
  const contactStore = useContactStore();
  const allergenStore = useAllergenStore();
  const alarmStore = useAlarmStore();
  const bookmarkStore = useBookmarkStore();
  const hasErrors = ref<boolean>(false);

  onIonViewDidEnter(async () => {
    await handleLogout()
  })

  const handleLogout = async () => {
    hasErrors.value = false;

    try {
      await useFetchAPI({
        url: '/auth/logout',
        method: 'POST'
      });

      // Remove access token from preferences
      await authStore.removeBearerToken()

      // Remove all cached data
      await allergenStore.reset();
      await contactStore.reset();
      await alarmStore.reset();
      bookmarkStore.reset();

      // Redirect to homepage
      await router.replace({ name: 'home' })
    } catch (error) {
      // Show error message
      hasErrors.value = true;

      // Log the error into the console
      console.error(error)
    }
  }
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="flex flex-col items-center justify-center h-full">
        <div class="bg-zinc-300 shadow-xl rounded-xl px-10 py-8 text-center">
          <template v-if="!hasErrors">
            <p class="mb-4">Logging out</p>
            <ion-spinner></ion-spinner>
          </template>

          <template v-else>
            <p class="mb-4">Something went wrong while logging out</p>
            <ion-button shape="round" @click="handleLogout">
              Try again
            </ion-button>
          </template>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">

</style>