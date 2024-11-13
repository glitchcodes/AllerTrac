<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  import {
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    modalController,
    loadingController,
    isPlatform,
    SegmentCustomEvent,
    useBackButton
  } from "@ionic/vue";
  import { Capacitor } from "@capacitor/core";
  import { Share } from "@capacitor/share";
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
  import {
    alertCircle,
    arrowBack,
    bookmark,
    bookmarkOutline,
    checkmarkCircleOutline,
    shareOutline
  } from "ionicons/icons";
  import { useBookmarkStore } from "@/store/bookmark";
  import { useToastController } from "@/composables/useToastController";
  import { convertToHttps } from "@/utils/helpers";

  import MealIngredients from "@/components/meal/MealIngredients.vue";
  import MealHealth from "@/components/meal/MealHealth.vue";

  import type { EdamamLinks, EdamamRecipe } from "@/types/Edamam";

  const bookmarkStore = useBookmarkStore();
  const toastController = useToastController();

  const props = defineProps<{
    meal: EdamamRecipe,
    links: EdamamLinks
  }>();

  const statusBarHeight = ref();

  onMounted(async () => {
    statusBarHeight.value = (await SafeArea.getStatusBarHeight()).height
  })

  const isBookmarked = computed(() => {
    return bookmarkStore._bookmarks.URIs.some(uri => uri.uri === props.meal.uri);
  })

  const isImageLoading = ref<boolean>(true);
  const currentSegment = ref<string>('MealIngredients');
  const segments: any = {
    MealIngredients,
    MealHealth
  };

  const currentProperties = computed(() => {
    return currentSegment.value === 'MealIngredients'
        ? { ingredients: props.meal.ingredients }
        : { healthLabels: props.meal.healthLabels };
  });

  const imageSrc = computed((): string => {
    let image = props.meal.images.REGULAR.url;

    if (props.meal.images.LARGE) {
      image = props.meal.images.LARGE.url;
    }

    return image;
  });

  const handleSegmentChange = (e: SegmentCustomEvent) => {
    if (typeof e.detail.value === "string") {
      currentSegment.value = e.detail.value
    }
  }

  const handleShareMeal =  async () => {
    // Convert link into https
    const secureUrl = convertToHttps(props.meal.shareAs)

    await Share.share({
      title: props.meal.label,
      url: secureUrl,
      dialogTitle: props.meal.label
    });
  }

  const handleBookmarkMeal = async () => {
    // Show loading modal
    const isSubmitting = await loadingController.create({
      message: 'Bookmarking...'
    });

    await isSubmitting.present();

    try {
      const response = await bookmarkStore.create(props.meal.uri);

      if (response.status === 201) {
        await toastController.presentToast({
          message: "Meal bookmarked",
          position: "bottom",
          duration: 3000,
          icon: checkmarkCircleOutline
        });
      }
    } catch (error) {
      console.error(error);

      await toastController.presentToast({
        message: "Something went wrong while trying to bookmark this meal",
        position: "bottom",
        duration: 3000,
        icon: alertCircle
      })
    }

    await isSubmitting.dismiss();
  }

  const handleRemoveBookmark = async () => {
    // Show loading modal
    const isSubmitting = await loadingController.create({
      message: 'Deleting bookmark...'
    });

    await isSubmitting.present();

    try {
      const response = await bookmarkStore.remove(props.meal.uri);

      if (response.status === 200) {
        await toastController.presentToast({
          message: "Bookmark removed",
          position: "bottom",
          duration: 3000,
          icon: checkmarkCircleOutline
        });
      }
    } catch (error) {
      console.error(error);
    }

    await isSubmitting.dismiss();
  }

  const handleImageLoaded = async () => isImageLoading.value = false;
  const dismissModal = () => modalController.dismiss(null , 'close');

  useBackButton(100, () => dismissModal())
</script>

<template>
  <ion-content class="ion-padding">
    <nav class="navbar flex items-center mb-4"
         :style="{ marginTop: Capacitor.isNativePlatform() && isPlatform('ios') ? statusBarHeight + 'px' : '0' }">
      <ion-button shape="round" @click="dismissModal">
        <ion-icon slot="icon-only" :icon="arrowBack" />
      </ion-button>
      <div class="flex-1"></div>
      <div class="flex gap-2">

        <ion-button v-if="isBookmarked" color="tertiary" shape="round" @click="handleRemoveBookmark">
          <ion-icon slot="icon-only" class="bookmarked" :icon="bookmark" />
        </ion-button>
        <ion-button v-else color="tertiary" shape="round" @click="handleBookmarkMeal">
          <ion-icon slot="icon-only" :icon="bookmarkOutline" />
        </ion-button>

        <ion-button shape="round" color="tertiary" @click="handleShareMeal">
          <ion-icon slot="icon-only" :icon="shareOutline" />
        </ion-button>
      </div>
    </nav>

    <div v-show="isImageLoading" class="bg-slate-100 rounded-2xl shadow-md min-h-80 flex items-center justify-center">
      <ion-spinner></ion-spinner>
    </div>

    <img v-show="!isImageLoading" class="rounded-2xl shadow-md mx-auto" :src="imageSrc" :alt="props.meal.label" @load="handleImageLoaded" />

    <h1 class="text-2xl font-bold text-center my-5">
      {{ props.meal.label }}
    </h1>

    <div class="bg-[#efeee9] ion-padding rounded-2xl shadow-md">
      <div class="bg-white overflow-hidden shadow rounded-lg mb-4" :class="{ 'p-2': isPlatform('ios') }">
        <ion-segment :value="currentSegment" @ionChange="handleSegmentChange">
          <ion-segment-button value="MealIngredients">
            <ion-label>Ingredients</ion-label>
          </ion-segment-button>
          <ion-segment-button value="MealHealth">
            <ion-label>Health Labels</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <transition enter-active-class="animate__animated animate__slideInLeft"
                  leave-active-class="animate__animated animate__slideOutRight"
                  mode="out-in">
        <component :is="segments[currentSegment]" v-bind="currentProperties"></component>
      </transition>

      <img src="/images/edamam-badge-white.svg" alt="Edamam Attribution" class="w-auto mt-4" />
    </div>
  </ion-content>
</template>

<style scoped lang="scss">
  ion-content {
    --background: #ffffff;
  }
  .navbar {
    .title {
      background-color: #efeee9;
    }
  }

  ion-icon.bookmarked {
    color: #ED6A5A;
  }
</style>