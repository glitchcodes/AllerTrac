import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useFetchAPI } from "@/composables/useFetchAPI";
// import { useNetworkStore } from "@/store/network";
import type { Allergen } from "@/types/Allergen";
import {Preferences} from "@capacitor/preferences";

export const useAllergenStore = defineStore('allergen', () => {
  const allergens = ref<Allergen[]>([]);
  const _allergens = computed(() => allergens.value);

  // const networkStore = useNetworkStore();

  /**
   * Get allergens when the app is offline
   *
   * *MUST* be only be called whenever the app is offline and the allergens hasn't been fetched yet
   */
  const getAllergensOffline = async () => {
    if (allergens.value.length > 0) return;

    const { value } = await Preferences.get({ key: 'allergens' });

    allergens.value = value ? JSON.parse(value) : [];

    return;
  }

  const getAllergens = async () => {
    try {
      const response = await useFetchAPI({
        url: '/user/allergens',
        method: 'GET'
      });

      // Store locally
      await Preferences.set({
        key: 'allergens',
        value: JSON.stringify(response.data.allergens)
      })

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

    // Store locally
    await Preferences.set({
      key: 'allergens',
      value: JSON.stringify(response.data.allergens)
    })

    // Update state
    allergens.value = response.data.allergens;

    return response;
  }

  const reset = async () => {
    await Preferences.remove({ key: 'allergens' })
    allergens.value = [];
  }

  return { _allergens, getAllergens, getAllergensOffline, updateAllergens, reset }
})