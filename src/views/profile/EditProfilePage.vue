<script setup lang="ts">
  import { defineAsyncComponent, ref, computed, onMounted } from "vue";
  import {
    IonPage,
    IonToolbar,
    IonHeader,
    IonContent,
    IonTitle,
    IonDatetime,
    IonIcon,
    IonInput,
    IonButton,
    IonButtons,
    IonPopover,
    IonProgressBar,
    modalController,
    loadingController,
    actionSheetController,
    isPlatform,
    ActionSheetButton,
    DatetimeCustomEvent,
  } from '@ionic/vue';
  import { StatusBar } from "@capacitor/status-bar";
  import { checkmarkCircleOutline, chevronBack, createOutline } from "ionicons/icons";
  import { useAuthStore } from "@/store/auth";
  import { useNetworkStore } from "@/store/network"
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useAlertController } from "@/composables/useAlertController";
  import { useToastController } from "@/composables/useToastController";
  import { useAvatarUploader } from "@/composables/useAvatarUploader";
  import { blobToBase64, formatToFriendlyDate, phoneMaskOptions } from "@/utils/helpers";
  import FetchError from "@/utils/errors/FetchError";
  import type { User } from "@/types/User"
  import CropAvatarModal from "@/components/modal/CropAvatarModal.vue";
  import AlertMessage from "@/components/AlertMessage.vue";

  interface FormBody {
    first_name: string
    last_name: string
    phone_number: string
    birthday: string
    avatar?: string
  }

  // Stores
  const networkStore = useNetworkStore();
  const authStore = useAuthStore();

  // Composables
  const alertController = useAlertController();
  const toastController = useToastController();
  const avatarUploader = useAvatarUploader();

  // Lazy-load components
  const ProfileCard = defineAsyncComponent(() => import("@/components/profile/ProfileCard.vue"));

  // States
  const isLoading = ref<boolean>(true);

  const user = ref<User>();
  const originalUser = ref<User>();

  const inputErrors = ref<any>({});

  const hasChanges = computed(() => {
    return JSON.stringify(user.value) != JSON.stringify(originalUser.value)
  })

  const fetchUserDetails = async () => {
    try {
      const response = await useFetchAPI({
        url: '/auth/check',
        method: 'GET'
      });

      user.value = response.data.user;
      originalUser.value = JSON.parse(JSON.stringify(response.data.user)); // Return a new copy

      isLoading.value = false;
    } catch (error) {
      console.error(error);
    }
  }

  onMounted(async () => {
    // Fetch user details on mount lifecycle
    await fetchUserDetails();
  })


  const updateBirthday = (e: DatetimeCustomEvent) => {
    if (e.detail.value === undefined) return;
    user.value!.birthday = e.detail.value as string
  }

  const handleSaveChanges = async () => {
    // Show loading modal
    const isSubmitting = await loadingController.create({
      message: 'Saving changes...'
    })

    await isSubmitting.present();

    // Submit to the backend
    try {
      const body: FormBody = {
        first_name: user.value!.first_name,
        last_name: user.value!.last_name,
        phone_number: user.value!.phone_number,
        birthday: user.value!.birthday,
      }

      // Handle avatar upload
      if (user.value!.avatar != originalUser.value?.avatar) {
        if (user.value!.avatar.length > 0) {
          const blob = await fetch(user.value!.avatar).then(r => r.blob());
          body.avatar = await blobToBase64(blob) as string
        } else {
          body.avatar = '';
        }
      }

      const response = await useFetchAPI({
        url: '/user/update-details',
        method: 'PATCH',
        data: body
      });

      // Update auth store
      authStore.user = response.data.user;

      // Dismiss loading modal
      await isSubmitting.dismiss();

      // Show toast message
      await toastController.presentToast({
        message: 'Profile updated',
        position: 'bottom',
        positionAnchor: 'scan-food-button',
        duration: 3000,
        icon: checkmarkCircleOutline
      });
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

      // Dismiss loading modal
      await isSubmitting.dismiss();
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

  const openAvatarActions = async () => {
    const buttons: (string|ActionSheetButton<any>)[] = [
      {
        text: 'Upload avatar',
        data: {
          action: 'upload-avatar'
        }
      }
    ];

    // Show "Remove avatar" when the user has an avatar
    if (user.value!.avatar && user.value!.avatar.length > 0) {
      buttons.push({
        text: 'Remove avatar',
        role: 'destructive',
        data: {
          action: 'remove-avatar'
        }
      });
    }

    const actionSheet = await actionSheetController.create({
      header: 'Avatar',
      buttons: buttons
    })

    await actionSheet.present();

    // Handle dismiss event
    const dismissEvent = await actionSheet.onWillDismiss();

    if (dismissEvent.data !== undefined) {
      await handleDismissEvent(dismissEvent.data.action);
    }
  }

  const handleDismissEvent = async (action: string) => {
    const isAndroid = isPlatform('android');

    if (action === 'upload-avatar') {
      const image = await avatarUploader.pickImage();

      // Open avatar cropper
      const modal = await modalController.create({
        component: CropAvatarModal,
        componentProps: {
          image: image.webPath
        }
      });

      await modal.present()

      // Change status bar color to white
      if (isAndroid) {
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      }

      // Catch image through modal dismissal
      const dismissEvent = await modal.onDidDismiss()

      if (dismissEvent) {
        // Revert status bar color
        if (isAndroid) {
          await StatusBar.setBackgroundColor({ color: '#efeee9' });
        }

        if (dismissEvent.role === 'confirm') {
          user.value!.avatar = dismissEvent.data.image;
        }
      }
    }

    if (action === 'remove-avatar') {
      const blobUrl = user.value!.avatar;

      // Reset avatar into empty string
      user.value!.avatar = '';

      // Revoke blob url
      URL.revokeObjectURL(blobUrl);
    }
  }

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
          handler: async () => {
            await handleSaveChanges()
          }
        },
      ]
    })
  };
</script>

<template>
  <ion-page>
    <ion-header v-if="isPlatform('ios')">
      <ion-toolbar>
        <ion-title>
          Edit Profile
        </ion-title>
        <ion-buttons slot="start">
          <ion-button router-link="/pages/profile" router-direction="back">
            <ion-icon aria-label="Back" :icon="chevronBack" />
          </ion-button>
        </ion-buttons>
        <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <nav v-if="!isPlatform('ios')" class="navbar flex items-center mb-4 gap-3 relative">
        <ion-button color="tertiary" shape="round" router-link="/pages/profile" router-direction="back">
          <ion-icon slot="icon-only" :icon="chevronBack" />
        </ion-button>
        <p class="font-bold text-xl absolute left-1/2 transform -translate-x-1/2">
          Edit Profile
        </p>
      </nav>

      <template v-if="!isLoading && user">
        <ProfileCard :user="user" :edit-mode="true" class="mb-4" @open-avatar-action="openAvatarActions" />

        <AlertMessage v-if="!networkStore._isConnected" type="danger" class="mb-4">
          You cannot make changes to your profile because your device is not connected to the internet
        </AlertMessage>

        <div class="bg-white rounded-md shadow-md ion-padding mb-4">
          <h5 class="text-lg font-bold mb-4">
            Personal Information
          </h5>

          <div class="flex flex-col gap-4">
            <ion-input v-model="user.first_name"
                       mode="md"
                       label="First name"
                       label-placement="floating"
                       fill="outline"
                       placeholder="John"
                       :disabled="!networkStore._isConnected"
                       :class="{ 'ion-touched ion-invalid': inputErrors.first_name }"
                       :error-text="getErrorMessage('first_name')"
                       @ionInput="() => inputErrors.first_name = ''">
            </ion-input>

            <ion-input v-model="user.last_name"
                       mode="md"
                       label="Last name"
                       label-placement="floating"
                       fill="outline"
                       placeholder="Doe"
                       :disabled="!networkStore._isConnected"
                       :class="{ 'ion-touched ion-invalid': inputErrors.last_name }"
                       :error-text="getErrorMessage('last_name')"
                       @ionInput="() => inputErrors.last_name = ''">
            </ion-input>

            <ion-input v-model="user.phone_number"
                       v-maskito="phoneMaskOptions"
                       mode="md"
                       type="tel"
                       label="Phone"
                       label-placement="floating"
                       fill="outline"
                       placeholder="+639XX XXX XXXX"
                       :disabled="!networkStore._isConnected"
                       :class="{ 'ion-touched ion-invalid': inputErrors.phone_number }"
                       :error-text="getErrorMessage('phone_number')"
                       @ionInput="() => inputErrors.phone_number = ''">
            </ion-input>

            <div>
              <ion-input id="birthday-input"
                         mode="md"
                         label="Birthday"
                         label-placement="floating"
                         fill="outline"
                         :value="formatToFriendlyDate(user.birthday)"
                         readonly
                         :disabled="!networkStore._isConnected"
                         :class="{ 'ion-touched ion-invalid': inputErrors.birthday }"
                         :error-text="getErrorMessage('birthday')"
                         @ionInput="() => inputErrors.birthday = ''">
                <ion-icon slot="end" :icon="createOutline" aria-hidden="true"></ion-icon>
              </ion-input>

              <ion-popover trigger="birthday-input" :keep-contents-mounted="true">
                <ion-datetime presentation="date"
                              :show-default-title="true"
                              @ionChange="updateBirthday">
                  <span slot="title">Select your birthday</span>
                </ion-datetime>
              </ion-popover>
            </div>

          </div>
        </div>

        <ion-button class="submit-btn"
                    expand="block"
                    :disabled="!hasChanges || !networkStore._isConnected"
                    @click="saveChanges"
        >
          Save changes
        </ion-button>
      </template>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-input, ion-item, ion-list {
    --background: white;
  }

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

  ion-list {
    padding: 0;
  }

  ion-popover {
    &::part(content) {
      min-width: 290px;
    }
  }
</style>