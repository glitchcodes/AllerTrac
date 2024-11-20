<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from "vue";
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
    IonBackButton,
    isPlatform
  } from "@ionic/vue";
  import { useRoute, useRouter } from "vue-router";
  import { chevronBack } from "ionicons/icons";
  import { useFetchAPI } from "@/composables/useFetchAPI";

  import sanitizeHtml from 'sanitize-html';

  import type { Fact } from "@/types/Fact";
  import type { Author } from "@/types/Author";

  const route = useRoute();
  const router = useRouter();

  const factId = route.params.id;
  const isLoading = ref<boolean>(true);
  const fact = reactive<Fact>({
    id: 0,
    title: "...",
    description: "",
    brief_description: "",
    cover_image: "",
    category: "",
    author: undefined as unknown as Author,
    references: ""
  });

  const sanitizedContent = computed(() => {
    return sanitizeHtml(fact.description)
  })

  const error = ref<any>()
  const errorMessage = ref<string>('');

  onMounted(async () => {
    isLoading.value = true;

    try {
      const response = await useFetchAPI({
        url: `/facts/${factId}`,
        method: 'GET',
      });

      const factResponse = response.data.fact;

      fact.id = factResponse.id;
      fact.title = factResponse.title;
      fact.description = factResponse.description;
      fact.brief_description = factResponse.brief_description;
      fact.cover_image = factResponse.cover_image;
      fact.category = factResponse.category;
      fact.author = factResponse.author;
      fact.references = factResponse.references;

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
          {{ fact.title }}
        </ion-title>
        <ion-buttons slot="start">
          <ion-back-button />
<!--          <ion-button router-link="/pages/home" router-direction="back">-->
<!--            <ion-icon aria-label="Back" :icon="chevronBack" />-->
<!--          </ion-button>-->
        </ion-buttons>
        <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <nav v-if="!isPlatform('ios')" class="navbar flex items-center mb-4 gap-3 relative">
        <ion-button color="tertiary" shape="round" @click="router.go(-1)">
          <ion-icon slot="icon-only" :icon="chevronBack" />
        </ion-button>
        <p class="font-bold text-xl absolute left-1/2 transform -translate-x-1/2 text-nowrap">
          {{ fact.title }}
        </p>
      </nav>

      <ion-spinner v-if="isLoading && isPlatform('android')" class="block mx-auto" />

      <div v-if="!isLoading" class="bg-white p-4 rounded-lg">
        <img v-if="fact.cover_image.length > 0" :src="fact.cover_image" :alt="fact.title" class="rounded-lg mb-5" />

        <div v-html="sanitizedContent"></div>
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-card {
    --background: white;
  }
</style>