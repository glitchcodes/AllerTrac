<script setup lang="ts">
  import { reactive, ref, watch, onMounted } from "vue";
  import { IonChip, IonLabel } from "@ionic/vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useNetworkStore } from "@/store/network";
  import AlertMessage from "@/components/AlertMessage.vue";
  import FetchError from "@/utils/errors/FetchError";
  import SkeletonChipSlider from "@/components/skeleton/SkeletonChipSlider.vue";
  import type { FactCategory } from "@/types/FactCategory";

  const emit = defineEmits<{
    (e: 'openDrawer'): void
  }>()

  const networkStore = useNetworkStore();

  const isFetching = ref<boolean>(false);
  const categories = ref<FactCategory[]>([]);
  const error = reactive({
    statusCode: 0,
    message: ''
  })

  onMounted(async () => {
    if (networkStore._isConnected) {
      await fetchCategories()
    }
  })

  watch(() => networkStore._isConnected, async (isConnected) => {
    if (isConnected) {
      await fetchCategories()
    }
  }, { immediate: true })

  const fetchCategories = async () => {
    try {
      isFetching.value = true;

      categories.value = [];

      const response = await useFetchAPI({
        url: '/facts/category/all',
        method: 'GET'
      })

      categories.value = response.data.categories;
    } catch (errorResponse) {
      if (errorResponse instanceof FetchError) {
        error.statusCode = errorResponse.statusCode;
        error.message = errorResponse.message;
      } else {
        error.statusCode = 500;
        error.message = 'Something went wrong'
      }

      console.error(error);
    } finally {
      isFetching.value = false;
    }
  }
</script>

<template>
  <div>
    <AlertMessage v-if="!networkStore._isConnected && categories.length === 0" type="warning" class="shadow">
      Unable to fetch facts because your device is not connected to the internet
    </AlertMessage>

    <AlertMessage v-if="networkStore._isConnected && error.statusCode > 0" type="danger" class="shadow">
      {{ error.message }}
    </AlertMessage>

    <section v-if="!isFetching && categories.length > 0">
      <div class="rounded-md flex justify-between mt-5 mb-3">
        <h5 class="font-bold">
          Here are some facts!
        </h5>
        <h5 class="text-primary font-bold" @click="emit('openDrawer')">
          See all
        </h5>
      </div>

      <div class="overflow-x-auto scroll-smooth flex flex-nowrap space-x-2 no-scrollbar">
        <ion-chip v-for="category in categories" :key="category.id" :router-link="'/pages/category/' + category.id" class="overflow-visible m-0">
          <ion-label class="text-nowrap text-white">{{ category.name }}</ion-label>
        </ion-chip>
      </div>
    </section>

    <SkeletonChipSlider v-if="isFetching && networkStore._isConnected" class="mt-2 mb-4" />
  </div>
</template>

<style scoped lang="scss">
  ion-chip {
    --background: #417776;
  }
</style>