<script setup lang="ts">
  import { ref } from "vue";
  import { IonChip, IonLabel } from "@ionic/vue";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useNetworkStore } from "@/store/network";
  import type { FactCategory } from "@/types/FactCategory";
  import AlertMessage from "@/components/AlertMessage.vue";

  const emit = defineEmits<{
    (e: 'openDrawer'): void
  }>()

  const networkStore = useNetworkStore();
  const categories = ref<FactCategory[]>([]);

  try {
    const response = await useFetchAPI({
      url: '/facts/category/random',
      method: 'GET'
    })

    categories.value = response.data.categories;
  } catch (error) {
    console.error(error);
  }
</script>

<template>
  <div>
    <AlertMessage v-if="!networkStore._isConnected && categories.length === 0" type="warning">
      You aren't connected to the internet
    </AlertMessage>

    <section v-if="categories.length > 0">
      <div class="rounded-md flex justify-between mt-5 mb-3">
        <h5 class="font-bold">
          Here are some facts!
        </h5>
        <h5 class="text-primary font-bold" @click="emit('openDrawer')">
          See all
        </h5>
      </div>

      <div class="overflow-x-auto scroll-smooth flex flex-nowrap space-x-2 no-scrollbar">
        <ion-chip v-for="category in categories" :key="category.id" :router-link="'/facts/' + category.id" class="overflow-visible m-0">
          <ion-label class="text-nowrap text-white">{{ category.name }}</ion-label>
        </ion-chip>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
  ion-chip {
    --background: #417776;
  }
</style>