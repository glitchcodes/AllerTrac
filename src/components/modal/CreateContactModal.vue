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
  import { useAlertController } from "@/composables/useAlertController";
  import { default as EmergencyContactComponent } from "@/components/EmergencyContact.vue"
  import { phoneMaskOptions } from "@/utils/helpers";
  import type { EmergencyContact } from "@/types/EmergencyContact";
  import WarningAlert from "@/components/alert/WarningAlert.vue";
  import FetchError from "@/utils/errors/FetchError";

  const contactStore = useContactStore();
  const alertController = useAlertController();

  const form = reactive<EmergencyContact>({
    full_name: '',
    relationship: 'parent',
    phone_number: '',
    email: '',
  });

  const inputErrors = ref<any>({});

  // ion-input only show errors in one line, leading to undesired display of errors
  // As a workaround, show only return one error
  const getErrorMessage = (type: string) => {
    const errors = inputErrors.value;
    switch (type) {
      case "full_name":
        if (!errors.full_name || errors.full_name.length === null) return "";
        return errors.full_name[0]
      case "relationship":
        if (!errors.relationship || errors.relationship.length === null) return "";
        return errors.relationship[0]
      case "phone_number":
        if (!errors.phone_number || errors.phone_number.length === null) return "";
        return errors.phone_number[0]
      case "email":
        if (!errors.email || errors.email.length === null) return "";
        return errors.email[0]
    }
  }

  const handleSaveChanges = async () => {
    // Show loading modal
    const isSubmitting = await loadingController.create({
      message: 'Adding contact...'
    });

    await isSubmitting.present();

    // Submit to the backend
    try {
      await contactStore.createContact({
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
      message: "Are you sure you want to add this contact?",
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
        New Contact
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

    <EmergencyContactComponent :contact="form" />

    <h5 class="text-lg font-bold mt-5">
      Contact Information
    </h5>

    <div class="bg-white rounded-md shadow-md ion-padding my-4">
      <ion-list lines="none">
        <ion-item class="ion-no-padding">
          <ion-input v-model="form.full_name"
                     label="Full name"
                     label-placement="fixed"
                     placeholder="John Doe"
                     :class="{ 'ion-touched ion-invalid': inputErrors.full_name }"
                     :error-text="getErrorMessage('full_name')"
                     @ionInput="() => inputErrors.full_name = ''">
          </ion-input>
        </ion-item>
        <ion-item class="ion-no-padding">
          <ion-input v-model="form.phone_number"
                     v-maskito="phoneMaskOptions"
                     label="Phone"
                     label-placement="fixed"
                     placeholder="09XX XXX XXXX"
                     :class="{ 'ion-touched ion-invalid': inputErrors.phone_number }"
                     :error-text="getErrorMessage('phone_number')"
                     @ionInput="() => inputErrors.phone_number = ''">
          </ion-input>
        </ion-item>
        <ion-item class="ion-no-padding">
          <ion-input v-model="form.email"
                     label="Email"
                     label-placement="fixed"
                     placeholder="email@domain.com"
                     :class="{ 'ion-touched ion-invalid': inputErrors.email }"
                     :error-text="getErrorMessage('email')"
                     @ionInput="() => inputErrors.email = ''">
          </ion-input>
        </ion-item>
      </ion-list>
    </div>

    <div class="bg-white rounded-md shadow-md ion-padding mt-5">
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
      </ion-list>
    </div>

    <WarningAlert class="shadow-md mt-5">
      Any emergency contacts you've added will be automatically contacted when you activate the emergency alarm
    </WarningAlert>

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
      //font-weight: bold;
    }
    &:not(.ion-invalid):deep(.input-wrapper) {
      border-bottom: 1px solid rgba(0,0,0,0.3);
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