<script setup lang="ts">
import { ref } from "vue";
import { IonButton } from "@ionic/vue";
import { useFetchAPI } from "@/composables/useFetchAPI";
import Card from "@/components/Card.vue";
import type { Fact } from "@/types/Fact";

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
  <div class="mt-4 overflow-x-auto scroll-smooth flex flex-nowrap snap-mandatory snap-x no-scrollbar">
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
</template>

<style scoped lang="scss">

</style>