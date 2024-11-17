<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { IonSpinner, IonIcon, IonText, useIonRouter } from "@ionic/vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import * as icons from "ionicons/icons" // THIS IS NOT GOOD
  import type { FactCategory } from "@/types/FactCategory";

  const emit = defineEmits<{
    (e: 'close'): void
  }>()

  const ionRouter = useIonRouter();

  const isFetching = ref(true);
  const categories = ref<FactCategory[]>([]);

  const fetchCategories = async () => {
    isFetching.value = true;

    try {
      const response = await useFetchAPI({
        url: '/facts/category/random',
        method: 'GET'
      })

      categories.value = response.data.categories;
    } catch (error) {
      console.error(error);
    } finally {
      isFetching.value = false;
    }
  }

  onMounted(async () => {
    await fetchCategories()
  });

  const navigateTo = (categoryId: number) => {
    ionRouter.navigate(`/pages/category/${ categoryId }`, 'forward', 'push');
    emit('close')
  }
</script>

<template>
  <div class="ion-padding mt-2">
    <ion-spinner v-if="isFetching" class="block mx-auto" />

    <template v-else>
      <div class="mb-8">
        <h1 class="text-2xl font-bold">
          Categories
        </h1>
        <ion-text>Learn something new</ion-text>
      </div>

      <div class="flex flex-col gap-4">
        <button v-for="category in categories" :key="category.id"
                class="bg-slate-100 rounded-lg shadow p-4 flex items-center gap-4 focus:shadow-md"
                @click="navigateTo(category.id)"
        >
          <ion-icon :icon="icons[category.icon as keyof typeof icons]"
                    class="size-6 p-2 rounded-lg shadow"
                    :style="{ backgroundColor: category.icon_color }"
          ></ion-icon>
          <span>{{ category.name }}</span>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>