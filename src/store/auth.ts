import { computed, ref } from "vue";

import { defineStore } from "pinia";

import { Preferences } from "@capacitor/preferences";
import { useFetchAPI } from "@/composables/useFetchAPI";
import type { User } from "@/types/User";

import NotAllowedError from "@/utils/errors/NotAllowedError";
import FetchError from "@/utils/errors/FetchError";

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>();
  const bearerToken = ref<string | null>();

  const _isLoggedIn = computed(() => {
    if (!bearerToken.value || !user.value) return false;

    return bearerToken.value.length > 0 && user.value;
  })
  const _user = computed(() => user.value)

  const getBearerToken = async () => {
    const token = await Preferences.get({ key: 'access_token' });
    bearerToken.value = token.value
  }

  const setBearerToken = async (token: string) => {
    await Preferences.set({
      key: 'access_token',
      value: token
    });

    // Store in memory
    bearerToken.value = token;

    // Validate session
    await validateToken()
  }

  const removeBearerToken = async () => {
    await Preferences.remove({
      key: 'access_token'
    });

    // Remove token from memory
    bearerToken.value = "";

    // Remove user state
    user.value = null;
  }

  const validateToken = async () => {
    try {
      const response = await useFetchAPI({ url: '/auth/check', method: 'GET' });

      // Update the user state
      user.value = response.data.user;
    } catch (error) {

      if (error instanceof FetchError) {
        throw new NotAllowedError(error.data)
      } else {
        throw new Error("Unknown error")
      }
    }
  }

  return { user, _user, bearerToken, _isLoggedIn, getBearerToken, setBearerToken, removeBearerToken, validateToken }
})