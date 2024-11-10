<script setup lang="ts">
  import { ref, reactive, computed } from "vue";
  import { IonButton } from "@ionic/vue";
  import { checkmarkCircleOutline } from "ionicons/icons";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useGoogleAuth } from "@/composables/useGoogleAuth";
  import { useToastController } from "@/composables/useToastController";
  import { useAlertController } from "@/composables/useAlertController";
  import { capitalizeString } from "@/utils/helpers";

  import FetchError from "@/utils/errors/FetchError";
  import type { ConnectedAccount } from "@/types/ConnectedAccount";
  import type { OAuthProvider } from "@/types/OAuthProvider";

  const googleAuth = useGoogleAuth();
  const toastController = useToastController();
  const alertController = useAlertController();

  const accounts = ref<ConnectedAccount[]>([]);
  const loaders = reactive({
    google: false,
    facebook: false,
    twitter: false
  });

  const handleErrors = async (error: FetchError) => {
    await alertController.presentAlert({
      header: 'Error',
      message: error.data.message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    })
  }

  try {
    const response = await useFetchAPI({
      url: '/user/accounts',
      method: 'GET'
    });

    accounts.value = response.data.accounts;
  } catch (error) {
    handleErrors(error as FetchError)
  }

  const hasGoogleAccount = computed(() => {
    return accounts.value.some(account => account.provider === 'google')
  });

  const linkAccount = async (provider: OAuthProvider) => {
    loaders[provider] = true;

    if (provider === 'google') {
      await googleAuth.initialize();

      const data = await googleAuth.signIn();

      try {
        const response = await useFetchAPI({
          url: '/user/link-account',
          method: 'POST',
          data: data
        });

        if (response.status === 200) {
          await toastController.presentToast({
            message: 'Account linked',
            icon: checkmarkCircleOutline,
            duration: 3000,
            position: 'bottom',
            positionAnchor: 'scan-food-button'
          });

          accounts.value = response.data.accounts;
        }
      } catch (error) {
        await handleErrors(error as FetchError)
      } finally {
        loaders[provider] = false;
      }
    }
  }

  const unlinkAccount = async (provider: OAuthProvider) => {
    const unlink = async () => {
      try {
        loaders[provider] = true;

        const response = await useFetchAPI({
          url: '/user/unlink-account',
          method: 'PATCH',
          data: JSON.stringify({ provider: provider })
        });

        if (response.status === 200) {
          await toastController.presentToast({
            message: 'Account unlinked',
            icon: checkmarkCircleOutline,
            duration: 3000,
            position: 'bottom',
            positionAnchor: 'scan-food-button'
          })

          accounts.value = accounts.value.filter((account) => account.provider !== provider)
        }
      } catch (error) {
        await handleErrors(error as FetchError)
      } finally {
        loaders[provider] = false;
      }
    }

    await alertController.presentAlert({
      header: `Unlink ${ capitalizeString(provider) }?`,
      message: `You won't be able to login with this provider until you link it again.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            unlink()
          }
        }
      ]
    });
  }
</script>

<template>
  <section class="bg-white p-4 rounded-lg">
    <h5 class="text-lg font-bold mb-4">
      Connected Accounts
    </h5>

    <div class="flex items-center gap-3 px-4 py-3 border rounded-lg">
      <img src="/icons/google-logo.svg" alt="Google" class="size-8" />
      <div class="flex-1">
        <h1 class="text-lg font-bold">
          Google
        </h1>
        <p v-if="hasGoogleAccount" class="text-green-400">
          Linked
        </p>
        <p v-else class="text-red-400">
          Not linked
        </p>
      </div>
      <ion-button v-if="hasGoogleAccount" shape="round" color="danger" @click="unlinkAccount('google')">
        Unlink
      </ion-button>
      <ion-button v-else shape="round" @click="linkAccount('google')">
        Link
      </ion-button>
    </div>
  </section>
</template>

<style scoped lang="scss">

</style>