import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useFetchAPI } from "@/composables/useFetchAPI";
import type { Allergen } from "@/types/Allergen";

export const useAllergenStore = defineStore('allergen', () => {
  const allergens = ref<Allergen[]>([]);

  const _allergens = computed(() => allergens.value);

  const getAllergens = async () => {
    try {
      const response = await useFetchAPI({
        url: '/user/allergens',
        method: 'GET'
      });

      allergens.value = response.data.allergens;
    } catch (error) {
      console.error(error)
    }
  }

  const updateAllergens = async (data: Allergen[] | undefined) => {
    if (data === undefined) return;

    const allergenIds = data.map((a) => a.id);

    const body = {
      allergens: allergenIds
    }

    const response = await useFetchAPI({
      url: '/user/update-allergens',
      method: 'PATCH',
      data: JSON.stringify(body)
    });

    // Update state
    allergens.value = response.data.allergens;

    return response;
  }

  const reset = () => {
    allergens.value = [];
  }

  return { _allergens, getAllergens, updateAllergens, reset }
})