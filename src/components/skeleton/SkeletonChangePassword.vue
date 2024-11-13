<script setup lang="ts">
  import { IonButton, IonInput, IonSpinner } from "@ionic/vue";
</script>

<template>
  <section class="bg-white p-4 rounded-lg">
    <div class="flex items-center mb-4">
      <h5 class="text-lg font-bold flex-1">
        Change Password
      </h5>
      <ion-spinner class="size-5"></ion-spinner>
    </div>

    <div class="flex flex-col gap-4">
      <ion-input mode="md"
                 type="password"
                 label="Current Password"
                 label-placement="floating"
                 fill="outline"
                 placeholder="*******"
                 disabled
      >
      </ion-input>

      <ion-input mode="md"
                 type="password"
                 label="New Password"
                 label-placement="floating"
                 fill="outline"
                 placeholder="*******"
                 disabled
      >
      </ion-input>

      <ion-input mode="md"
                 type="password"
                 label="Confirm Password"
                 label-placement="floating"
                 fill="outline"
                 placeholder="*******"
                 disabled
      >
      </ion-input>
      <ion-button class="submit-btn" expand="block" disabled>
        Save changes
      </ion-button>
    </div>
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