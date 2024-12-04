<script setup lang="ts">
  import { reactive, ref } from "vue";
  import { arrowBack, save } from "ionicons/icons";
  import {
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    modalController,
    loadingController
  } from "@ionic/vue";
  import { useContactStore } from "@/store/contact";
  import { useNetworkStore } from "@/store/network";
  import { useAlertController } from "@/composables/useAlertController";
  import { default as EmergencyContactComponent } from "@/components/EmergencyContact.vue"
  import AlertMessage from "@/components/AlertMessage.vue";

  import { phoneMaskOptions } from "@/utils/helpers";
  import FetchError from "@/utils/errors/FetchError";
  import type { EmergencyContact } from "@/types/EmergencyContact";

  const networkStore = useNetworkStore();
  const contactStore = useContactStore();
  const alertController = useAlertController();

  const props = defineProps<{
    user: EmergencyContact
  }>()

  const form = reactive<EmergencyContact>(props.user);

  const inputErrors = ref<any>({});

  // ion-input only show errors in one line, leading to undesired display of errors
  // As a workaround, show only return one error
  const getErrorMessage = (type: string) => {
    const errors = inputErrors.value;
    const errorTypes = ["full_name", "relationship", "relationship_specific", "phone_number", "email"];

    if (errorTypes.includes(type)) {
      return errors[type]?.[0] || "";
    }
  }

  const handleSaveChanges = async () => {
    // Show loading modal
    const isSubmitting = await loadingController.create({
      message: 'Updating contact...'
    });

    await isSubmitting.present();

    // Submit to the backend
    try {
      await contactStore.editContact(props.user.id!,{
        ...form,
        phone_number: form.phone_number.replace(/\s/g,'')
      })

      // Dismiss the loading modal
      await isSubmitting.dismiss()

      // Dismiss the modal
      await modalController.dismiss(null, 'confirm')
    } catch (error) {
      // Dismiss loading modal
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
      }
      // Dismiss the loading modal
      await isSubmitting.dismiss()
    }
  }

  const dismissModal = () => {
    modalController.dismiss(null, 'cancel');
  }

  const saveChanges = async () => {
    // Show alert to confirm changes
    await alertController.presentAlert({
      header: "Save changes?",
      message: "Are you sure you want to make changes to this contact?",
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
  }

</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Edit Contact
      </ion-title>
      <ion-buttons slot="start">
        <ion-button @click="dismissModal">
          <ion-icon aria-label="Back" :icon="arrowBack" />
        </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button :strong="true" :disabled="!networkStore._isConnected" @click="saveChanges">
          <ion-icon aria-label="Confirm" :icon="save" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

    <AlertMessage v-if="!networkStore._isConnected" type="warning" class="shadow-md mb-5">
      A working internet connection is required to make changes.
    </AlertMessage>

    <EmergencyContactComponent :contact="form" :can-edit="false" />

    <div class="bg-white rounded-md shadow-md ion-padding my-4">
      <h5 class="text-lg font-bold mb-4">
        Contact Information
      </h5>

      <div class="flex flex-col gap-4">
        <ion-input v-model="form.full_name"
                   mode="md"
                   label="Full name"
                   label-placement="floating"
                   fill="outline"
                   placeholder="John Doe"
                   :class="{ 'ion-touched ion-invalid': inputErrors.full_name }"
                   :error-text="getErrorMessage('full_name')"
                   @ionInput="() => inputErrors.full_name = ''">
        </ion-input>

        <ion-input v-model="form.phone_number"
                   v-maskito="phoneMaskOptions"
                   mode="md"
                   label="Phone"
                   label-placement="floating"
                   fill="outline"
                   placeholder="+639XXXXXXXXX"
                   :class="{ 'ion-touched ion-invalid': inputErrors.phone_number }"
                   :error-text="getErrorMessage('phone_number')"
                   @ionInput="() => inputErrors.phone_number = ''">
        </ion-input>

        <ion-input v-model="form.email"
                   label="Email"
                   label-placement="floating"
                   mode="md"
                   fill="outline"
                   placeholder="email@domain.com"
                   :class="{ 'ion-touched ion-invalid': inputErrors.email }"
                   :error-text="getErrorMessage('email')"
                   @ionInput="() => inputErrors.email = ''">
        </ion-input>
      </div>
    </div>

    <div class="bg-white rounded-md shadow-md ion-padding mt-5 relationship-card">
      <ion-list lines="none">
        <ion-item class="ion-no-padding">
          <ion-select v-model="form.relationship" :value="form.relationship" label="Relationship" label-placement="fixed">
            <ion-select-option value="parent">
              Parent
            </ion-select-option>
            <ion-select-option value="spouse">
              Spouse
            </ion-select-option>
            <ion-select-option value="sibling">
              Sibling
            </ion-select-option>
            <ion-select-option value="child">
              Child
            </ion-select-option>
            <ion-select-option value="other">
              Other
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item v-if="form.relationship === 'other'" class="ion-no-padding">
          <ion-input v-model="form.relationship_specific"
                     label="Specify"
                     label-placement="fixed"
                     placeholder="e.g. Relative"
                     :class="{ 'ion-touched ion-invalid': inputErrors.relationship_specific }"
                     :error-text="getErrorMessage('relationship_specific')"
                     @ionInput="() => inputErrors.relationship_specific = ''">
          </ion-input>
        </ion-item>
      </ion-list>
    </div>

    <AlertMessage type="warning" class="shadow-md mt-5">
      Any emergency contacts you've added will be automatically contacted when you activate the emergency alarm
    </AlertMessage>

  </ion-content>
</template>

<style scoped lang="scss">
  ion-input, ion-item, ion-list {
    --background: white;
  }

  ion-item {
    --inner-padding-end: 0;
  }

  ion-input {
    &.input-fill-outline:deep(.label-text-wrapper.sc-ion-input-md) {
      -webkit-transform: translateY(65%) scale(1);
      transform: translateY(65%) scale(1);
    }
  }

  .relationship-card ion-input {
    &:deep(.label-text) {
      color: var(--ion-color-primary);
    }
    &:deep(.native-input) {
      text-align: right;
    }
  }

  ion-select {
    &::part(label) {
      color: var(--ion-color-primary);
      //font-weight: bold;
    }
  }

  ion-list {
    padding: 0;
  }
</style>