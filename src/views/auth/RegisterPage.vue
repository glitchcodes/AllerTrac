<script setup lang="ts">
  import { ref } from "vue";
  import {
    IonPage,
    IonContent,
    IonIcon,
    IonButtons,
    IonButton,
    IonCheckbox,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    isPlatform,
    IonSpinner
  } from '@ionic/vue';
  import { alertCircle, arrowBack, key, mailOutline } from "ionicons/icons";
  import { OverlayEventDetail } from '@ionic/core/components';
  import { StatusBar, Style } from "@capacitor/status-bar";
  import { useRouter } from "vue-router";
  import { useToastController } from "@/composables/useToastController";
  import { useFetchAPI } from "@/composables/useFetchAPI";

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/InputComponent.vue";
  import FetchError from "@/utils/errors/FetchError";

  const router = useRouter();
  const toast = useToastController();

  // States
  const isSubmitting = ref<boolean>(false);

  const email = ref<string>('');
  const password = ref<string>('');
  const confirmPassword = ref<string>('');

  const tosAgreed = ref<boolean>(false);
  const privacyAgreed = ref<boolean>(false);

  const genericError = ref<string>('');
  const inputErrors = ref<any>({});

  const showStatusBar = async () => {
    if (!isPlatform('android')) return;

    await StatusBar.setStyle({ style: Style.Light })
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setOverlaysWebView({ overlay: false })
  }

  const hideStatusBar = async () => {
    if (!isPlatform('android')) return;

    await StatusBar.setOverlaysWebView({ overlay: true })
  }

  // Modals
  const tosModal = ref();
  const privacyModal = ref();

  const closeModal = (type: string) => {
    switch (type) {
      case 'tos':
        tosModal.value.$el.dismiss(null, 'tos-closed');
        break;
      case 'privacy':
        privacyModal.value.$el.dismiss(null, 'privacy-closed');
        break;
    }
  }

  const onWillDismiss = async (ev: CustomEvent<OverlayEventDetail>) => {
    if (ev.detail.role === 'tos-closed') {
      tosAgreed.value = !tosAgreed.value
    }

    if (ev.detail.role === 'privacy-closed') {
      privacyAgreed.value = !privacyAgreed.value
    }

    await hideStatusBar()
  }

  // Actions
  const submitForm = async () => {
    // Show error message if terms and conditions checkbox is not checked
    if (!tosAgreed.value) {
      await toast.presentToast({
        message: "You must agree to our Terms and Conditions",
        duration: 3000,
        icon: alertCircle
      })

      return;
    }

    // Show error message if privacy policy checkbox is not checked
    if (!privacyAgreed.value) {
      await toast.presentToast({
        message: "You must agree to our Privacy Policy",
        duration: 3000,
        icon: alertCircle
      })

      return;
    }

    // Show loading indicator
    isSubmitting.value = true;

    // Reset errors
    genericError.value = "";
    inputErrors.value = {};

    const body = {
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value
    }

    try {
      const response = await useFetchAPI({
        url: '/auth/register',
        method: 'POST',
        data: JSON.stringify(body)
      })

      const redirectTo = response.data.redirect_to

      if (redirectTo === 'onboarding') {
        await router.push({ name: 'home' })
      } else if (redirectTo === 'verification') {
        await router.push({ name: 'verify-registration', query: { i: response.data.identifier } })
      }
    } catch (error) {
      await handleErrors(error);
    }

    // Hide loading indicator
    isSubmitting.value = false;
  }

  const handleErrors = async (error: any) => {
    if (error instanceof FetchError) {
      switch (error.data.code) {
        case "INPUT_INVALID":
          inputErrors.value = error.data.errors;
          break;
        default:
          await toast.presentToast({
            message: 'Error: ' + error.data.message,
            duration: 5000,
            icon: alertCircle
          })
      }
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
              Sign Up
            </h5>

            <form class="mt-8 mb-10" @submit.prevent="submitForm">
              <div class="flex flex-col gap-4 text-left">
                <!-- Email Address -->
                <InputComponent v-model="email" placeholder="Email Address" type="email" data-cy="email" :errors="inputErrors.email">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="mailOutline" />
                  </template>
                </InputComponent>
                <!-- END Email Address -->

                <!-- Password -->
                <InputComponent v-model="password" placeholder="Password" type="password" data-cy="password" :errors="inputErrors.password">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Password -->

                <!-- Password -->
                <InputComponent v-model="confirmPassword" placeholder="Confirm password" type="password" data-cy="confirm-password" :errors="inputErrors.password_confirmation">
                  <template v-slot:icon>
                    <ion-icon aria-hidden="true" :icon="key" />
                  </template>
                </InputComponent>
                <!-- END Password -->

                <ion-checkbox v-model="tosAgreed" label-placement="end" justify="start" data-cy="tos-checkbox">
                  <p class="ion-text-wrap">
                    I agree to AllerTrac's <a @click="$event.stopPropagation()" id="open-tos-modal">Terms & Conditions</a>
                  </p>
                </ion-checkbox>

                <ion-checkbox v-model="privacyAgreed" label-placement="end" justify="start" data-cy="privacy-checkbox">
                  <p class="ion-text-wrap">
                    I agree to AllerTrac's <a id="open-privacy-modal" @click.stop>Privacy Policy</a>
                  </p>
                </ion-checkbox>
              </div>

              <ion-button v-if="!isSubmitting" class="mt-4" expand="block" shape="round" type="submit" data-cy="submit">
                Sign up
              </ion-button>

              <ion-button v-if="isSubmitting" class="mt-4" expand="block" shape="round" disabled>
                <span class="mr-2">
                  Please wait...
                </span>
                <ion-spinner name="circular"></ion-spinner>
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
              Already have an account? <router-link :to="{ name: 'login' }" class="font-bold hover:underline">Sign In</router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- TOS Agreement Modal -->
      <ion-modal ref="tosModal" trigger="open-tos-modal" @willPresent="showStatusBar" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="closeModal('tos')">
                <ion-icon aria-hidden="true" :icon="arrowBack" />
              </ion-button>
              <ion-title>
                Terms & Conditions
              </ion-title>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding modal">
          <p class="ion-margin-bottom">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rhoncus, ex id lacinia laoreet, odio massa tincidunt lectus, a tristique tortor urna at velit. Mauris ut elit sed justo porta dignissim. Cras varius turpis sit amet felis venenatis, pellentesque laoreet velit tincidunt. Proin sit amet condimentum mauris, eleifend aliquam nisi. Maecenas semper purus purus, at ullamcorper felis porta a. Phasellus tincidunt mollis ante eget consectetur. Vestibulum tempor id eros sed ultrices. Sed ut dapibus magna, vel rutrum magna. Morbi blandit turpis at tortor tempor, vel facilisis lorem egestas.
          </p>
          <p class="ion-margin-bottom">
            Maecenas gravida commodo justo at varius. Sed vel tempus magna. Integer at risus viverra, dapibus justo eu, efficitur massa. Aliquam erat volutpat. Aenean eleifend auctor diam ac venenatis. Nulla sit amet finibus turpis. Sed blandit accumsan porttitor. Maecenas fringilla convallis nulla vel convallis.
          </p>
          <p class="ion-margin-bottom">
            Donec eget tortor posuere, hendrerit orci vitae, rhoncus diam. Maecenas id nisl semper purus dignissim convallis sit amet porttitor magna. In urna ante, interdum sed vestibulum in, tempus eu tortor. Morbi sed feugiat nunc. Ut ac lorem non odio vestibulum fermentum ut et mi. Suspendisse libero urna, faucibus sit amet elit et, feugiat fermentum augue. Cras maximus aliquam malesuada. Integer vel laoreet sapien, at posuere leo. Etiam aliquam egestas odio, et accumsan ex faucibus quis. Pellentesque vehicula nulla velit, quis lobortis turpis pulvinar ac. Duis eget turpis in purus scelerisque posuere. Duis egestas dui at risus auctor blandit. Nam dignissim, risus sit amet gravida dapibus, elit turpis cursus erat, a luctus orci nunc non est. Vestibulum massa dui, ultricies sed eros ac, laoreet posuere lacus.
          </p>
        </ion-content>
      </ion-modal>
      <!-- END TOS Agreement Modal -->

      <!-- Privacy Agreement Modal -->
      <ion-modal ref="privacyModal" trigger="open-privacy-modal" @willPresent="showStatusBar" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="closeModal('privacy')">
                <ion-icon aria-hidden="true" :icon="arrowBack" />
              </ion-button>
              <ion-title>
                Privacy Policy
              </ion-title>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding modal">
          <p class="ion-margin-bottom">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer rhoncus, ex id lacinia laoreet, odio massa tincidunt lectus, a tristique tortor urna at velit. Mauris ut elit sed justo porta dignissim. Cras varius turpis sit amet felis venenatis, pellentesque laoreet velit tincidunt. Proin sit amet condimentum mauris, eleifend aliquam nisi. Maecenas semper purus purus, at ullamcorper felis porta a. Phasellus tincidunt mollis ante eget consectetur. Vestibulum tempor id eros sed ultrices. Sed ut dapibus magna, vel rutrum magna. Morbi blandit turpis at tortor tempor, vel facilisis lorem egestas.
          </p>
          <p class="ion-margin-bottom">
            Maecenas gravida commodo justo at varius. Sed vel tempus magna. Integer at risus viverra, dapibus justo eu, efficitur massa. Aliquam erat volutpat. Aenean eleifend auctor diam ac venenatis. Nulla sit amet finibus turpis. Sed blandit accumsan porttitor. Maecenas fringilla convallis nulla vel convallis.
          </p>
          <p class="ion-margin-bottom">
            Donec eget tortor posuere, hendrerit orci vitae, rhoncus diam. Maecenas id nisl semper purus dignissim convallis sit amet porttitor magna. In urna ante, interdum sed vestibulum in, tempus eu tortor. Morbi sed feugiat nunc. Ut ac lorem non odio vestibulum fermentum ut et mi. Suspendisse libero urna, faucibus sit amet elit et, feugiat fermentum augue. Cras maximus aliquam malesuada. Integer vel laoreet sapien, at posuere leo. Etiam aliquam egestas odio, et accumsan ex faucibus quis. Pellentesque vehicula nulla velit, quis lobortis turpis pulvinar ac. Duis eget turpis in purus scelerisque posuere. Duis egestas dui at risus auctor blandit. Nam dignissim, risus sit amet gravida dapibus, elit turpis cursus erat, a luctus orci nunc non est. Vestibulum massa dui, ultricies sed eros ac, laoreet posuere lacus.
          </p>
        </ion-content>
      </ion-modal>
      <!-- END TOS Agreement Modal -->

    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-content {
    --ion-background-color: transparent;
    background-image: url("/images/auth-bg.png");
    background-size: cover;
  }

  ion-content.modal {
    --ion-background-color: #fbfdfe;
    background-image: none;
    background-size: initial;
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