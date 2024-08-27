<script setup lang="ts">
  import { ref } from "vue";

  import {IonIcon, IonPage, IonContent, IonButton } from '@ionic/vue';
  import { key } from "ionicons/icons";

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/InputComponent.vue";

  const password = ref<string>('');
  const confirmPassword = ref<string>('');
</script>


<template>
  <ion-page>
    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col h-full items-center justify-center gap-4">
          <LogoComponent />

          <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

            <h5 class="text-primary text-2xl font-bold text-center">
              Reset Password
            </h5>

            <p class="mt-4 text-center">
              Enter your new password
            </p>

            <form class="mt-8">
              <div class="flex flex-col gap-4 text-left mb-8">
                <!-- Password -->
                <InputComponent v-model="password" placeholder="Password" type="password" data-cy="password">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Password -->

                <!-- Confirm Password -->
                <InputComponent v-model="confirmPassword" placeholder="Confirm password" type="password" data-cy="confirm-password">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Confirm Password -->
              </div>

              <ion-button expand="block" shape="round" type="submit" data-cy="submit-button">
                Confirm
              </ion-button>
            </form>

          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-content {
  --ion-background-color: transparent;
  background-image: url("/images/auth-bg.png");
  background-size: cover;
}
</style>