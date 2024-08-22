import { ref } from "vue";

import { defineStore } from "pinia";

import { Preferences } from "@capacitor/preferences";
import { useFetchAPI } from "@/composables/useFetchAPI";
import type { User } from "@/types/User";

import NotAllowedError from "@/utils/errors/NotAllowedError";
import FetchError from "@/utils/errors/FetchError";

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>();
  const bearerToken = ref<string | null>();

  const getBearerToken = async () => {
    const token = await Preferences.get({ key: 'access_token' });
    bearerToken.value = token.value
  }

  const setBearerToken = async (token: string) => {
    await Preferences.set({
      key: 'access_token',
      value: token
    })
  }

  const validateToken = async () => {
    try {
      await useFetchAPI({ url: '/auth/check', method: 'GET' });
    } catch (error) {

      if (error instanceof FetchError) {
        throw new NotAllowedError(error.data)
      } else {
        throw new Error("Unknown error")

      }
    }
  }

  return { user, bearerToken, getBearerToken, setBearerToken, validateToken }
})