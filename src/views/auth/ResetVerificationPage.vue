<script setup lang="ts">
  import { ref } from "vue";
  import { IonIcon, IonPage, IonContent, IonButton, useIonRouter } from '@ionic/vue';
  import { arrowBack } from "ionicons/icons";
  import VOtpInput from "vue3-otp-input"

  import LogoComponent from "@/components/auth/LogoComponent.vue";

  const ionRouter = useIonRouter()

  const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
  const otp = ref("");

 const verifyOTP = async () => {
   // TESTING
   if (otp.value === '1111') {
     ionRouter.push({ name: 'reset-password' })
   }
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
              Verification Code
            </h5>

            <p class="mt-4 text-center">
              Please check your inbox for the verification code sent to the provided email address.
            </p>

            <form class="mt-8 mb-10" @submit.prevent>
              <div class="flex items-center justify-center mb-4">
                <v-otp-input ref="otpInput"
                             input-classes="w-14 h-14 mx-2 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-slate-400 hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                             input-type="number"
                             :num-inputs="4"
                             v-model:value="otp">
                </v-otp-input>
              </div>

              <p class="text-center mb-10">
                Didn't receive a code? <a class="font-bold hover:underline cursor-pointer">Resend</a>
              </p>

              <ion-button expand="block" shape="round" @click="verifyOTP">
                Next
              </ion-button>
            </form>

            <router-link :to="{ name: 'forget-password' }"
                         router-direction="back"
                         class="flex items-center justify-center">
              <ion-icon aria-hidden="true" :icon="arrowBack" />
              <span class="ml-2">
                Return to forget password screen
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