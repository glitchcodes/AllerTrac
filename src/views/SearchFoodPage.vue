<script setup lang="ts">
import { IonPage, IonContent, IonSearchbar } from "@ionic/vue";
import { useAuthStore } from "@/store/auth";
import WarningAlert from "@/components/alert/WarningAlert.vue";

const authStore = useAuthStore();
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <div class="bg-primary rounded-lg shadow-lg w-full text-left mb-6 p-5">

        <div class="flex justify-between items-center">
          <div>
            <h6 class="text-xl text-white font-bold mb-3">
              Discover Allergens easily with us!
            </h6>
            <h6 class="text-[11px] text-black">
              Please search for your meal <br> to see its ingredients.
            </h6>
          </div>
            <img class="w-[130px]" src="/images/searchpic.png" alt="search icon">
        </div>
      </div>

      <div class="flex flex-col items-center justify-center bg-white/50 rounded-2xl shadow-2xl p-4 gap-6">

        <WarningAlert v-if="!authStore._isLoggedIn"
                      class="shadow"
                      text="Sending ingredients are only available to registered users"
        />
        <ion-searchbar></ion-searchbar>

      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.custom-flex {
  height: calc(100% - 16px - 64px - 24px);
}
</style>