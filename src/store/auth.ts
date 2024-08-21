import { ref } from "vue";

import { defineStore } from "pinia";

import { Preferences } from "@capacitor/preferences";
import type { User } from "@/types/User";

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

  return { user, bearerToken, getBearerToken, setBearerToken }
})