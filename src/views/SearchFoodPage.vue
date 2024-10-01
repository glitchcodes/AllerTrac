<script setup lang="ts">
  import { computed } from "vue";
  import { IonPage, IonContent, IonSearchbar, IonIcon, IonButtons, IonButton, isPlatform } from "@ionic/vue";
  import { cafeOutline, ellipsisHorizontal, logIn } from "ionicons/icons";

  import { useAuthStore } from "@/store/auth";
  import { useMenuNav } from "@/composables/useMenuNav";

  import WarningAlert from "@/components/alert/WarningAlert.vue";

  const authStore = useAuthStore();
  const { openUserMenu } = useMenuNav();

  const randomMeal = computed(() => {
    const placeholders = [
      'Spaghetti Carbonara',
      'Chicken Alfredo',
      'Beef Tacos',
      'Grilled Salmon',
      'Veggie Stir-fry',
      'Margherita Pizza',
      'Chicken Biryani',
      'Beef Stroganoff',
      'Shrimp Scampi',
      'Vegetable Curry'
    ];

    const i = Math.floor(Math.random() * placeholders.length);

    return placeholders[i];
  })
</script>

<template>
  <ion-page>
    <ion-header>
      <!-- Main Toolbar -->
      <ion-toolbar v-if="isPlatform('ios')">
        <ion-title>Find Meal</ion-title>

        <ion-buttons slot="primary">
          <ion-button v-if="authStore._isLoggedIn" @click="openUserMenu">
            <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
          </ion-button>
          <ion-button v-else router-link="/u/login" shape="round">
            <ion-icon slot="icon-only" aria-label="Login Button" :icon="logIn"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <!-- END Main Toolbar -->

      <!-- Search bar -->
      <ion-toolbar v-if="isPlatform('ios')">
        <ion-searchbar :animated="true" :placeholder="randomMeal" :disabled="!authStore._isLoggedIn" />
      </ion-toolbar>
      <!-- END Search bar -->
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">

      <div class="mb-4">
        <div class="flex items-center">
          <ion-icon class="text-2xl primary" aria-hidden="true" :icon="cafeOutline" />
          <h5 v-if="authStore._isLoggedIn && authStore._user" class="font-bold text-gray-600 ms-2">
            Hello, {{ authStore._user.first_name }}
          </h5>
          <h5 v-else class="font-bold text-gray-600 ms-2">
            Hello, traveller
          </h5>
        </div>
        <h1 class="text-xl font-bold mt-1">
          What are you craving today?
        </h1>
      </div>

      <!-- Search bar ANDROID -->
      <div v-if="!isPlatform('ios')" class="mb-4">
        <ion-searchbar class="search-input"
                       :animated="true"
                       :placeholder="randomMeal"
                       :disabled="!authStore._isLoggedIn"
        />
      </div>
      <!-- END Search bar ANDROID -->

      <!-- Warning: Non-registered users -->
      <WarningAlert v-if="!authStore._isLoggedIn" class="shadow mb-4">
        Finding meals are only available to registered users
      </WarningAlert>
      <!-- END Warning: Non-registered users -->

      <div class="bg-white rounded-2xl shadow-md w-full text-left mb-6 px-5 py-3">

        <div class="flex justify-between items-center">
          <div>
            <h6 class="text-primary text-xl font-bold mb-3">
              Know your meals!
            </h6>
            <h6 class="text-[12px]">
              Please search for your meal to see its ingredients.
            </h6>
          </div>
            <img class="w-[110px]" src="/images/searchpic.png" alt="search icon">
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.custom-flex {
  height: calc(100% - 16px - 64px - 24px);
}

ion-searchbar.search-input {
  --background: white;
  --border-radius: 0.5rem;
  --box-shadow: var(--tw-ring-offset-shadow, ), var(--tw-ring-shadow, 0 0 #0000), 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 0;
}
</style>