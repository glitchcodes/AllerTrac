<script setup lang="ts">
  import { ref, computed } from "vue";
  import {
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    modalController, isPlatform, SegmentCustomEvent
  } from "@ionic/vue";
  import { Share } from "@capacitor/share";
  import { arrowBack, bookmarkOutline, shareOutline } from "ionicons/icons";
  import MealIngredients from "@/components/meal/MealIngredients.vue";
  import MealHealth from "@/components/meal/MealHealth.vue";
  import type { EdamamLinks, EdamamRecipe } from "@/types/Edamam";

  const props = defineProps<{
    meal: EdamamRecipe,
    links: EdamamLinks
  }>();

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
    await Share.share({
      title: props.meal.label,
      url: props.meal.shareAs,
      dialogTitle: props.meal.label
    });
  }

  const handleImageLoaded = async () => isImageLoading.value = false;
  const dismissModal = () => modalController.dismiss(null , 'close');

</script>

<template>
  <ion-content class="ion-padding">
    <nav class="navbar flex items-center mb-4">
      <ion-button shape="round" @click="dismissModal">
        <ion-icon slot="icon-only" :icon="arrowBack" />
      </ion-button>
      <div class="flex-1"></div>
      <div class="flex gap-2">
        <ion-button shape="round">
          <ion-icon slot="icon-only" :icon="bookmarkOutline" />
        </ion-button>
        <ion-button shape="round" @click="handleShareMeal">
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

    ion-button {
      --background: #efeee9;
      --color: black;
    }
  }
</style>