<script setup lang="ts">
import { ref } from "vue";
import { useFetchAPI } from "@/composables/useFetchAPI";
import Card from "@/components/Card.vue";
import type { Fact } from "@/types/Fact";
import { IonButton } from "@ionic/vue";

const facts = ref<Fact[]>();

try {
  const response = await useFetchAPI({
    url: '/facts/category/1',
    method: 'GET'
  });

  facts.value = response.data.facts;
} catch (error) {
  console.error(error)
}
</script>

<template>
  <div class="mt-4 overflow-x-auto scroll-smooth flex flex-nowrap snap-mandatory snap-x">
    <template v-for="fact in facts" :key="fact.id">
      <Card :fact="fact" ></Card>
    </template>

    <div class="rounded-2xl shadow-xl mx-2 p-4 bg-cover bg-center min-h-96 min-w-80 max-h-80 max-w-80 overflow-hidden snap-center flex flex-col-reverse space-y-4 space-y-reverse" style="background-image: url('/images/allergies/allergies.jpg');">
      <ion-button router-link="/allergens" class="bottom-4 left-4 w-full p-4 bg-[#417776] rounded-lg opacity-90">
        <h3 class="font-bold text-lg text-[#F4EDEF]">See All</h3>
      </ion-button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>