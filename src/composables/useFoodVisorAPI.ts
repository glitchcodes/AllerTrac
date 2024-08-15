import {createFetch} from "@vueuse/core";

export const useFoodVisorAPI = createFetch({
  // baseUrl: 'https://vision.foodvisor.io/api/1.0/en',
  options: {
    beforeFetch({ options }) {
      const ApiKey = import.meta.env.VITE_FOODVISOR_KEY;

      options.headers = {
        ...options.headers,
        "Authorization": `Api-Key ${ApiKey}`
      }
    }
  }
})