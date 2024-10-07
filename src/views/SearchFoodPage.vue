<script setup lang="ts">
  import { computed, ref } from "vue";
  import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    IonSkeletonText,
    isPlatform,
    SearchbarCustomEvent
  } from "@ionic/vue";
  import { cafeOutline, ellipsisHorizontal, logIn } from "ionicons/icons";

  import { useAuthStore } from "@/store/auth";
  import { useNetworkStore } from "@/store/network";
  import { useAllergenStore } from "@/store/allergen";
  import { useMenuNav } from "@/composables/useMenuNav";
  import { randomString } from "@/utils/helpers";

  import WarningAlert from "@/components/alert/WarningAlert.vue";
  import MealResults from "@/components/meal/MealResults.vue";

  const authStore = useAuthStore();
  const networkStore = useNetworkStore();
  const allergenStore = useAllergenStore();
  const { openUserMenu } = useMenuNav();

  const componentId = ref<string>('');
  const searchQuery = ref<string>('');
  const hasSearchedOnce = ref<boolean>(false);

  if (networkStore._isConnected) {
    allergenStore.getAllergens();
  }

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
  });

  const isSearchDisabled = computed(() => {
    return !authStore._isLoggedIn || !networkStore._isConnected;
  });

  const handleSearchChange = async (e: SearchbarCustomEvent) => {
    // Hide the banner message after the first search
    if (hasSearchedOnce.value === false) {
      hasSearchedOnce.value = true;
    }

    const query = e.detail.value as string;

    if (query.length <= 1) return;

    searchQuery.value = query;

    // Change component id to refresh it
    componentId.value = randomString(10);
  }
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
        <ion-searchbar :animated="true"
                       :debounce="1000"
                       :placeholder="randomMeal"
                       :disabled="isSearchDisabled"
                       @ionInput="handleSearchChange($event)" />
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
                       :debounce="1000"
                       :placeholder="randomMeal"
                       :disabled="isSearchDisabled"
                       @ionInput="handleSearchChange($event)"
        />
      </div>
      <!-- END Search bar ANDROID -->

      <!-- Warning: Non-registered users -->
      <WarningAlert v-if="!authStore._isLoggedIn" class="shadow mb-4">
        Finding meals are only available to registered users
      </WarningAlert>
      <!-- END Warning: Non-registered users -->

      <!-- Warning: No connection -->
      <WarningAlert v-if="!networkStore._isConnected" class="shadow mb-4">
        You are not connected into the internet. Please check your settings
      </WarningAlert>
      <!-- END Warning: No connection -->

      <div v-if="!hasSearchedOnce" class="bg-white rounded-2xl shadow-md w-full text-left mb-6 px-5 py-3">
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

      <Suspense :timeout="0">
        <MealResults :key="componentId" :query="searchQuery" />

        <template #fallback>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-neutral-300 p-4 rounded-2xl min-h-60 relative">
              <div class="absolute bottom-0 left-0 z-20 w-full p-4">
                <h1 class="text-white font-bold">
                  <ion-skeleton-text :animated="true" class="rounded" style="height: 1rem;" />
                </h1>
              </div>
            </div>
            <div class="bg-neutral-300 p-4 rounded-2xl min-h-60 relative">
              <div class="absolute bottom-0 left-0 z-20 w-full p-4">
                <h1 class="text-white font-bold">
                  <ion-skeleton-text :animated="true" class="rounded" style="height: 1rem;" />
                </h1>
              </div>
            </div>
            <div class="bg-neutral-300 p-4 rounded-2xl min-h-60 relative">
              <div class="absolute bottom-0 left-0 z-20 w-full p-4">
                <h1 class="text-white font-bold">
                  <ion-skeleton-text :animated="true" class="rounded" style="height: 1rem;" />
                </h1>
              </div>
            </div>
            <div class="bg-neutral-300 p-4 rounded-2xl min-h-60 relative">
              <div class="absolute bottom-0 left-0 z-20 w-full p-4">
                <h1 class="text-white font-bold">
                  <ion-skeleton-text :animated="true" class="rounded" style="height: 1rem;" />
                </h1>
              </div>
            </div>
            <div class="bg-neutral-300 p-4 rounded-2xl min-h-60 relative">
              <div class="absolute bottom-0 left-0 z-20 w-full p-4">
                <h1 class="text-white font-bold">
                  <ion-skeleton-text :animated="true" class="rounded" style="height: 1rem;" />
                </h1>
              </div>
            </div>
            <div class="bg-neutral-300 p-4 rounded-2xl min-h-60 relative">
              <div class="absolute bottom-0 left-0 z-20 w-full p-4">
                <h1 class="text-white font-bold">
                  <ion-skeleton-text :animated="true" class="rounded" style="height: 1rem;" />
                </h1>
              </div>
            </div>
          </div>
        </template>
      </Suspense>

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