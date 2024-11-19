<script setup lang="ts">
  import { ref, computed, onMounted, defineAsyncComponent } from "vue";
  import {
    IonPage,
    IonHeader,
    IonContent,
    IonIcon,
    IonButton,
    isPlatform,
    IonToolbar,
    IonButtons,
    IonTitle,
    useIonRouter
  } from '@ionic/vue';
  import { ellipsisHorizontal, fastFood, logIn,  menu } from "ionicons/icons";
  import { useAuthStore } from "@/store/auth";
  import { useMenuNav } from "@/composables/useMenuNav";

  import { CupertinoPane } from "cupertino-pane";
  import FactCarousel from "@/components/facts/FactCarousel.vue";
  import FactCategorySlider from "@/components/facts/FactCategorySlider.vue";
  import WarningAlert from "@/components/alert/WarningAlert.vue";

  const FactCategories = defineAsyncComponent(() => import('@/components/facts/FactCategories.vue'));

  const ionRouter = useIonRouter()
  const authStore = useAuthStore();
  const { openUserMenu } = useMenuNav();

  // Drawer
  const drawer = ref();
  const isCategoriesMounted = ref<boolean>(false);

  onMounted(() => {
    drawer.value = new CupertinoPane('ion-drawer#fact-categories', {
      backdrop: true,
      bottomOffset: 48,
      bottomClose: true,
      touchMoveStopPropagation: true,
      ionContentScroll: true,
      breaks: {
        top: { // Topper point that pane can reach
          enabled: true, // Enable or disable breakpoint
          height: window.screen.height - (135 * 0.35) - 54 - 100, // Pane breakpoint height
          bounce: true // Bounce pane on transition
        },
      }
    });

    drawer.value.on('onDidPresent', () => {
      isCategoriesMounted.value = true;
    })
  })

  const greetingMessage = computed(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!"
    }
  });

  const navigateTo = async (categoryId: number) => {
    await drawer.value.hide();

    ionRouter.navigate(`/pages/category/${ categoryId }`, 'forward', 'push');
  }
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar v-if="isPlatform('ios')">
        <ion-buttons slot="primary">
          <ion-button v-if="authStore._isLoggedIn" @click="openUserMenu">
            <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
          </ion-button>
          <ion-button v-else router-link="/u/login" shape="round">
            <ion-icon slot="icon-only" aria-label="Login Button" :icon="logIn"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <div class="flex items-center">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <ion-icon class="text-2xl primary" aria-hidden="true" :icon="fastFood" />
            <h5 class="font-bold ms-2 mt-1">
              About to eat?
            </h5>
          </div>
          <h1 class="text-3xl font-bold mt-2">
            {{ greetingMessage }}
          </h1>
        </div>
        <div v-if="!isPlatform('ios')">
          <ion-button v-if="!authStore._isLoggedIn" color="tertiary" router-link="/u/login" shape="round">
            <ion-icon slot="icon-only" aria-label="Login Button" :icon="logIn"></ion-icon>
          </ion-button>

          <ion-button v-else shape="round" color="tertiary" @click="openUserMenu">
            <ion-icon slot="icon-only" aria-label="User Menu" :icon="menu"></ion-icon>
          </ion-button>
        </div>
      </div>

      <WarningAlert v-if="!authStore._isLoggedIn" class="mt-4 mb-5 shadow">
        Some features are only available to registered users.
      </WarningAlert>

      <div class="bg-white rounded-2xl shadow-xl p-5 my-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl text-primary font-bold mb-3">
              Feeling better!
            </h2>
            <p class="text-[11px]">
              Scan your preferred food to view the ingredients and ensure it's safe for any allergies you might have!
            </p>
          </div>
          <img class="w-[130px]" src="/food1.png" alt="Food" />
        </div>
      </div>

      <FactCategorySlider class="mt-2 mb-4" @open-drawer="() => drawer.present({ animate: true })" />

      <FactCarousel />

      <ion-drawer id="fact-categories">
        <FactCategories v-if="isCategoriesMounted" @navigate="navigateTo($event)" />
      </ion-drawer>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-chip {
  --background: #417776;
}
</style>
