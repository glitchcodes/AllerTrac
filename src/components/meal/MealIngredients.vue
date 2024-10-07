<script setup lang="ts">
  import type { EdamamIngredient } from "@/types/Edamam";
  import {capitalizeString} from "../../utils/helpers";
  import {helpOutline} from "ionicons/icons";

  const props = defineProps<{
    ingredients: EdamamIngredient[]
  }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-for="ingredient in props.ingredients"
         :key="ingredient.foodId"
         class="bg-white p-3 rounded-lg border-2 flex items-center gap-3">
      <!-- Ingredient Image -->
      <img v-if="ingredient.image" :src="ingredient.image" alt="ingredient.food" class="w-[40px] h-[40px] rounded-lg" />
      <div v-else class="bg-slate-200 w-[40px] h-[40px] rounded-lg flex items-center justify-center">
        <ion-icon :icon="helpOutline"></ion-icon>
      </div>
      <!-- END Ingredient Image -->
      <p>
        {{ capitalizeString(ingredient.food) }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>