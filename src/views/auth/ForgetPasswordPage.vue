<script setup lang="ts">
  import { ref } from "vue";

  import { IonIcon, IonPage, IonContent, IonButton, useIonRouter } from '@ionic/vue';
  import { arrowBack, mailOutline } from "ionicons/icons";

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/InputComponent.vue";

  const ionRouter = useIonRouter();
  const email = ref<string>('');

  const submitResetRequest = async () => {
    if (email.value.length <= 0) return;

    // TODO: Implement password reset request
    ionRouter.push({ name: 'verify-password-reset' })
  }
</script>


<template>
  <ion-page>
    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col h-full items-center justify-center gap-4">
          <LogoComponent />

          <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

            <h5 class="text-primary text-2xl font-bold text-center">
              Forgot Password
            </h5>

            <p class="mt-4 text-center">
              We need your email address to send a verification code.
            </p>

            <form class="mt-8 mb-10" @submit.prevent="submitResetRequest">

              <div class="text-left mb-8">
                <!-- Email Address -->
                <InputComponent v-model="email" placeholder="Email Address" type="email" data-cy="email">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="mailOutline" />
                  </template>
                </InputComponent>
                <!-- END Email Address -->
              </div>

              <ion-button expand="block" shape="round" type="submit">
                Confirm
              </ion-button>
            </form>

            <router-link :to="{ name: 'login' }" class="flex items-center justify-center">
              <ion-icon aria-hidden="true" :icon="arrowBack" />
              <span class="ml-2">
                Return to login screen
              </span>
            </router-link>

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