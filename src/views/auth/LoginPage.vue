<script setup lang="ts">
  import { ref } from "vue";

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/InputComponent.vue";

  import { key, mailOutline } from "ionicons/icons";
  import { IonPage, IonContent, IonIcon, IonButton } from "@ionic/vue";

  const email = ref<string>();
  const password = ref<string>();
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="h-full px-4">
        <div class="flex flex-col h-full items-center justify-center gap-4">
          <LogoComponent />

          <div class="bg-secondary rounded-2xl shadow-xl p-6 w-full">

            <h5 class="text-primary text-2xl font-bold text-center">
              Sign In
            </h5>

            <form class="mt-8 mb-10">
              <div class="flex flex-col gap-4 text-left">
                <!-- Email Address -->
                <InputComponent v-model="email" placeholder="Email Address" type="email">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="mailOutline" />
                  </template>
                </InputComponent>
                <!-- END Email Address -->

                <!-- Password -->
                <InputComponent v-model="password" placeholder="Password" type="password">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Password -->
              </div>

              <div class="flex my-6">
                <div class="flex-1"></div> <!-- This is stupid -->

                <router-link :to="{ name: 'forget-password' }" class="hover:underline">
                  Forgot Password?
                </router-link>
              </div>

              <ion-button expand="block" shape="round">
                Login
              </ion-button>
            </form>

            <!-- OAuth Providers -->
            <div class="border-t-[1px] border-gray-300"></div>

            <p class="inline-block bg-white relative text-center left-1/2 -top-[13px] -translate-x-1/2 px-2">
              Or login with
            </p>

            <div class="mt-4 mb-6">
              <ion-button class="oauth" expand="block" shape="round" fill="outline">
                <img src="/icons/google-logo.svg" alt="Google Logo" />
                <span class="ml-3">
                Continue with Google
              </span>
              </ion-button>
            </div>
            <!-- END OAuth Providers -->

            <p class="text-center">
              New around here? <router-link :to="{ name: 'register' }" class="font-bold hover:underline">Sign up</router-link>
            </p>
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

  ion-button.oauth {
    --padding-top: 0.25rem;
    --padding-bottom: 0.25rem;
    img {
      width: 30px;
      height: 30px;
    }
  }
</style>