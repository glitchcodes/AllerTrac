<script setup lang="ts">
  import { reactive } from "vue";
  import { useRouter } from "vue-router"
  import type { Fact } from "@/types/Fact";

  const props = defineProps<{
    fact: Fact
  }>();

  const router = useRouter();

  const coverImage = reactive({
    background: `url('${ props.fact.cover_image }')`,
    backgroundSize: 'cover'
  });
</script>

<template>
  <div class="rounded-2xl shadow-xl mx-2 p-4 bg-cover bg-center min-h-96 min-w-80 max-h-96 max-w-80 overflow-hidden snap-center flex flex-col-reverse space-y-4 space-y-reverse"
       :style="coverImage"
       @click="router.push(`/pages/facts/${ props.fact.id }`)"
  >
    <div class="p-4 bg-[#417776] rounded-lg opacity-90">
      <h3 class="font-bold text-lg text-[#F4EDEF] mb-2">
        {{ props.fact.title }}
      </h3>
      <p class="text-sm text-[#F4EDEF] line-clamp-3">
        {{ props.fact.brief_description }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>