import type { Allergen } from "@/types/Allergen";
import {useFetchAPI} from "@/composables/useFetchAPI";

export const useAllergenForm = () => {
  const updateAllergens = async (allergens: Allergen[] | undefined) => {
    if (allergens === undefined) return;

    const allergenIds = allergens.map((a) => a.id);

    const body = {
      allergens: allergenIds
    }

    return await useFetchAPI({
      url: '/user/update-allergens',
      method: 'PATCH',
      data: JSON.stringify(body)
    })
  }

  return { updateAllergens }
}