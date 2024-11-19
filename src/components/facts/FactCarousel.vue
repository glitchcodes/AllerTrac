<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import { IonButton } from "@ionic/vue";
import { useNetworkStore } from "@/store/network";
import { useFetchAPI } from "@/composables/useFetchAPI";
import Card from "@/components/Card.vue";
import type { Fact } from "@/types/Fact";
import FetchError from "@/utils/errors/FetchError";
import AlertMessage from "@/components/AlertMessage.vue";
import SkeletonCard from "@/components/skeleton/SkeletonCard.vue";

const networkStore = useNetworkStore();

const isFetching = ref<boolean>(true);
const facts = ref<Fact[]>([]);
const error = reactive({
  statusCode: 0,
  message: ''
})

watch(() => networkStore._isConnected, async (isConnected) => {
  if (isConnected && facts.value.length === 0) {
    await fetchFacts()
  }
}, { immediate: true })

const fetchFacts = async () => {
  try {
    isFetching.value = true;

    facts.value = [];

    const response = await useFetchAPI({
      url: '/facts/category/1',
      method: 'GET'
    });

    facts.value = response.data.facts;
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
    <AlertMessage v-if="networkStore._isConnected && error.statusCode > 0" type="danger">
      {{ error.message }}
    </AlertMessage>

    <div v-if="!isFetching && facts.length > 0" class="mt-4 overflow-x-auto scroll-smooth flex flex-nowrap snap-mandatory snap-x no-scrollbar">
      <template v-for="fact in facts" :key="fact.id">
        <Card :fact="fact" ></Card>
      </template>

      <div class="rounded-2xl shadow-xl mx-2 p-4 bg-cover bg-center min-h-96 min-w-80 max-h-80 max-w-80 overflow-hidden snap-center flex flex-col-reverse space-y-4 space-y-reverse" style="background-image: url('/images/allergies/allergies.jpg');">
        <ion-button class="bottom-4 left-4 w-full bg-[#417776] rounded-lg opacity-90 font-bold text-lg text-white"
                    router-link="/pages/category/1"
                    router-direction="forward"
        >
          See all
        </ion-button>
      </div>
    </div>

    <div v-if="isFetching && networkStore._isConnected" class="mt-4 overflow-x-auto scroll-smooth flex flex-nowrap snap-mandatory snap-x no-scrollbar">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>