<script setup lang="ts">
  import { ref, reactive } from "vue";
  import { IonButton, IonInput } from "@ionic/vue";
  import { checkmarkCircleOutline } from "ionicons/icons";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useAlertController } from "@/composables/useAlertController";
  import { useToastController } from "@/composables/useToastController";
  import WarningAlert from "@/components/alert/WarningAlert.vue";
  import FetchError from "@/utils/errors/FetchError";

  const alertController = useAlertController();
  const toastController = useToastController();

  const hasPassword = ref<boolean>(true);
  const isSubmitting = ref<boolean>(false);

  const form = reactive({
    current_password: '',
    password: '',
    confirm_password: ''
  });

  const inputErrors = ref<any>({});

  try {
    const response = await useFetchAPI({
      url: '/user/check-password',
      method: 'GET'
    });

    hasPassword.value = response.data.has_password;
  } catch (error) {
    console.error(error)
  }

  const getErrorMessage = (type: string) => {
    const errors = inputErrors.value;
    switch (type) {
      case "current_password":
        if (!errors.current_password || errors.current_password.length === null) return "";
        return errors.current_password[0];
      case "password":
        if (!errors.password || errors.password.length === null) return "";
        return errors.password[0];
    }
  }

  const saveChanges = async () => {
    isSubmitting.value = true;

    try {
      const body: { current_password?: string, password: string, password_confirmation: string } = {
        password: form.password,
        password_confirmation: form.confirm_password
      }

      if (hasPassword.value) {
        body.current_password = form.current_password;
      }

      const response = await useFetchAPI({
        url: '/user/change-password',
        method: 'PATCH',
        data: JSON.stringify(body)
      });

      if (response.status === 200) {
        hasPassword.value = true;

        await toastController.presentToast({
          message: response.data.message,
          icon: checkmarkCircleOutline,
          position: 'bottom',
          positionAnchor: 'scan-food-button',
          duration: 3000
        })

        // Clear form
        form.current_password = '';
        form.password = '';
        form.confirm_password = '';
      }
    } catch (error) {
      if (error instanceof FetchError) {
        switch (error.data.code) {
          case "INPUT_INVALID":
            inputErrors.value = error.data.errors;
            break;
          default:
            // Show another alert error
            await alertController.presentAlert({
              header: "Something went wrong",
              message: error.data.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            })
        }
      }
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <section class="bg-white p-4 rounded-lg">
    <div class="flex items-center mb-4">
      <h5 class="text-lg font-bold flex-1">
        Change Password
      </h5>
      <ion-spinner v-if="isSubmitting" class="size-5"></ion-spinner>
    </div>

    <form @submit.prevent="saveChanges">
      <div class="flex flex-col gap-4">
        <WarningAlert v-if="!hasPassword">
          You have no password set. You should set your password now to secure your account.
        </WarningAlert>

        <ion-input v-model="form.current_password"
                   mode="md"
                   type="password"
                   label="Current Password"
                   label-placement="floating"
                   fill="outline"
                   placeholder="*******"
                   :disabled="!hasPassword || isSubmitting"
                   :class="{ 'ion-touched ion-invalid': inputErrors.current_password }"
                   :error-text="getErrorMessage('current_password')"
                   @ionInput="() => inputErrors.current_password = ''">
        </ion-input>

        <ion-input v-model="form.password"
                   mode="md"
                   type="password"
                   label="New Password"
                   label-placement="floating"
                   fill="outline"
                   placeholder="*******"
                   :disabled="isSubmitting"
                   :class="{ 'ion-touched ion-invalid': inputErrors.password }"
                   :error-text="getErrorMessage('password')"
                   @ionInput="() => inputErrors.password = ''">
        </ion-input>

        <ion-input v-model="form.confirm_password"
                   mode="md"
                   type="password"
                   label="Confirm Password"
                   label-placement="floating"
                   fill="outline"
                   placeholder="*******"
                   :disabled="isSubmitting"
                   :class="{ 'ion-touched ion-invalid': inputErrors.password }"
                   @ionInput="() => inputErrors.password = ''">
        </ion-input>

        <ion-button type="submit" class="submit-btn" expand="block" :disabled="isSubmitting">
          Save changes
        </ion-button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
  ion-input {
    &.input-fill-outline:deep(.label-text-wrapper.sc-ion-input-md) {
      -webkit-transform: translateY(65%) scale(1);
      transform: translateY(65%) scale(1);
    }
  }

  ion-button.submit-btn {
    --padding-top: 1rem;
    --padding-bottom: 1rem;
  }
</style>