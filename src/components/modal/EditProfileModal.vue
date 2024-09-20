<script setup lang="ts">
  import { computed, defineAsyncComponent, reactive, ref } from "vue";
  import { arrowBack, createOutline, save } from "ionicons/icons";
  import {
    DatetimeCustomEvent,
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar,
    IonPopover,
    modalController, loadingController
  } from "@ionic/vue";
  import { useAlertController } from "@/composables/useAlertController";
  import { useAuthStore } from "@/store/auth";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import FetchError from "@/utils/errors/FetchError";
  import type { User } from "@/types/User";

  // Lazy-load components
  const ProfileCard = defineAsyncComponent(() => import("@/components/profile/ProfileCard.vue"));

  // Controllers
  const alertController = useAlertController();

  // Stores
  const authStore = useAuthStore();

  // States
  const props = defineProps<{
    user: User
  }>();

  const inputErrors = ref<any>({});
  const profile = reactive(props.user);

  const friendlyDate = computed(() => {
    if (profile.birthday.length === 0) return;

    const date = new Date(profile.birthday);
    const formattedDate = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return formattedDate.format(date);
  });

  // Masking
  const phoneOptions = {
    mask: ['0', '9', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/],
    elementPredicate: (el: HTMLIonInputElement) => {
      return new Promise((resolve) => {
        requestAnimationFrame(async () => {
          const input = await el.getInputElement();
          resolve(input);
        })
      })
    }
  }

  const updateBirthday = (e: DatetimeCustomEvent) => {
    if (e.detail.value === undefined) return;
    profile.birthday = e.detail.value as string
  }

  const handleSaveChanges = async () => {
    // Show loading modal
    const isSubmitting = await loadingController.create({
      message: 'Saving changes...'
    })

    await isSubmitting.present();

    // Submit to the backend
    try {
      const body = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        birthday: profile.birthday
      }

      const response = await useFetchAPI({
        url: '/user/update-details',
        method: 'PATCH',
        data: JSON.stringify(body)
      });

      // Update auth store
      authStore.user = response.data.user;

      // Dismiss loading modal
      await isSubmitting.dismiss();

      // Close the edit modal
      await modalController.dismiss(null, 'confirm')
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
              message: error.data.message
            })
        }

        // Dismiss loading modal
        await isSubmitting.dismiss();
      }
    }
  }

  // ion-input only show errors in one line, leading to undesired display of errors
  // As a workaround, show only return one error
  const getErrorMessage = (type: string) => {
    const errors = inputErrors.value;
    switch (type) {
      case "first_name":
        if (!errors.first_name || errors.first_name.length === null) return "";
        return errors.first_name[0]
      case "last_name":
        if (!errors.last_name || errors.last_name.length === null) return "";
        return errors.last_name[0]
      case "phone_number":
        if (!errors.phone_number || errors.phone_number.length === null) return "";
        return errors.phone_number[0]
      case "birthday":
        if (!errors.birthday || errors.birthday.length === null) return "";
        return errors.birthday[0]
    }
  }

  const dismissModal = () => modalController.dismiss(null, 'cancel');
  const saveChanges = async () => {
    // Show alert to confirm changes
    await alertController.presentAlert({
      header: "Save changes?",
      message: "Are you sure you want to make these changes?",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            handleSaveChanges()
          }
        },
      ]
    })
  };
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Edit Profile
      </ion-title>
      <ion-buttons slot="start">
        <ion-button @click="dismissModal">
          <ion-icon aria-label="Back" :icon="arrowBack" />
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button :strong="true" @click="saveChanges">
          <ion-icon aria-label="Confirm" :icon="save" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ProfileCard :user="profile" class="mb-4"></ProfileCard>

    <div class="bg-white rounded-md shadow-md ion-padding">
      <h5 class="text-lg font-bold mb-2">
        Personal Information
      </h5>

      <ion-list lines="none">
        <ion-item class="ion-no-padding">
          <ion-input v-model="profile.first_name"
                     label="First name"
                     label-placement="fixed"
                     placeholder="John"
                     :class="{ 'ion-touched ion-invalid': inputErrors.first_name }"
                     :error-text="getErrorMessage('first_name')"
                     @ionInput="() => inputErrors.first_name = ''">
          </ion-input>
        </ion-item>
        <ion-item class="ion-no-padding">
          <ion-input v-model="profile.last_name"
                     label="Last name"
                     label-placement="fixed"
                     placeholder="Doe"
                     :class="{ 'ion-touched ion-invalid': inputErrors.last_name }"
                     :error-text="getErrorMessage('last_name')"
                     @ionInput="() => inputErrors.last_name = ''">
          </ion-input>
        </ion-item>
        <ion-item class="ion-no-padding">
          <ion-input v-model="profile.phone_number"
                     v-maskito="phoneOptions"
                     type="tel"
                     label="Phone"
                     label-placement="fixed"
                     placeholder="09XX XXX XXXX"
                     :class="{ 'ion-touched ion-invalid': inputErrors.phone_number }"
                     :error-text="getErrorMessage('phone_number')"
                     @ionInput="() => inputErrors.phone_number = ''">
          </ion-input>
        </ion-item>
        <ion-item button class="ion-no-padding" :detail="false">
          <ion-input id="birthday-input" label="Birthday"
                     label-placement="fixed"
                     :value="friendlyDate"
                     readonly
                     :class="{ 'ion-touched ion-invalid': inputErrors.birthday }"
                     :error-text="getErrorMessage('birthday')"
                     @ionInput="() => inputErrors.birthday = ''">
            <ion-icon slot="end" :icon="createOutline" aria-hidden="true"></ion-icon>
          </ion-input>
        </ion-item>
      </ion-list>
    </div>

    <ion-popover trigger="birthday-input" :keep-contents-mounted="true">
      <ion-datetime presentation="date"
                    :show-default-title="true"
                    @ionChange="updateBirthday">
        <span slot="title">Select your birthday</span>
      </ion-datetime>
    </ion-popover>
  </ion-content>
</template>

<style scoped lang="scss">
  ion-input, ion-item, ion-list {
    --background: white;
  }

  ion-input {
    --highlight-color-focused: var(--ion-color-primary);
    &:deep(.input-bottom) {
      padding-bottom: 5px;
    }
    &:deep(.label-text) {
      color: var(--ion-color-primary);
      font-weight: bold;
    }
    &:not(.ion-invalid):deep(.input-wrapper) {
      border-bottom: 1px solid rgba(0,0,0,0.3);
    }
  }

  ion-list {
    padding: 0;
  }

  ion-popover {
    &::part(content) {
      min-width: 290px;
    }
  }
</style>