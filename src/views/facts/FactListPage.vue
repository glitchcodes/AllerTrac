<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonProgressBar,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    isPlatform
  } from "@ionic/vue";
  import { useRoute } from "vue-router";
  import { chevronBack } from "ionicons/icons";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import type { Fact } from "@/types/Fact";

  const route= useRoute();
  const categoryId = route.params.id;
  const isLoading = ref<boolean>(true);

  const categoryName = ref<string>('...');
  const facts = ref<Fact[]>([]);

  const error = ref<any>()
  const errorMessage = ref<string>('');

  onMounted(async () => {
    isLoading.value = true;

    try {
      const response = await useFetchAPI({
        url: `/facts/category/${categoryId}`,
        method: 'GET',
      });

      categoryName.value = response.data.name;
      facts.value = response.data.facts;
    } catch (errorObj) {
      error.value = errorObj;
      errorMessage.value = 'Something went wrong'
    } finally {
      isLoading.value = false;
    }
  })
</script>

<template>
  <ion-page>
    <ion-header v-if="isPlatform('ios')">
      <ion-toolbar>
        <ion-title>
          {{ categoryName }}
        </ion-title>
        <ion-buttons slot="start">
          <ion-button router-link="/pages/home" router-direction="back">
            <ion-icon aria-label="Back" :icon="chevronBack" />
          </ion-button>
        </ion-buttons>
        <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <nav v-if="!isPlatform('ios')" class="navbar flex items-center mb-4 gap-3 relative">
        <ion-button color="tertiary" shape="round" router-link="/pages/home" router-direction="back">
          <ion-icon slot="icon-only" :icon="chevronBack" />
        </ion-button>
        <p class="font-bold text-xl absolute left-1/2 transform -translate-x-1/2 text-nowrap">
          {{ categoryName }}
        </p>
      </nav>

      <ion-spinner v-if="isLoading && isPlatform('android')" class="block mx-auto" />

      <div v-if="!isLoading && facts.length > 0">
        <ion-card v-for="fact in facts" :key="fact.id" :router-link="`/pages/facts/${fact.id}`" router-direction="forward">
          <img v-if="fact.cover_image.length > 0" :src="fact.cover_image" :alt="fact.title" />
          <ion-card-header>
            <ion-card-title>
              {{ fact.title }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            {{ fact.brief_description }}
          </ion-card-content>
        </ion-card>
      </div>

      <p v-if="!isLoading && facts.length === 0" class="ion-text-center">
        There are no facts under this category
      </p>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-card {
    --background: white;
  }
</style>