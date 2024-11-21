<script setup lang="ts">
  import { ref, onMounted } from "vue";
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
  import { SafeArea } from "@aashu-dubey/capacitor-statusbar-safe-area";
  import { useRouter } from "vue-router";
  import { useToastController } from "@/composables/useToastController";
  import { useGoogleAuth } from "@/composables/useGoogleAuth";
  import { useFetchAPI } from "@/composables/useFetchAPI";
  import { useAuthStore } from "@/store/auth";

  import LogoComponent from "@/components/auth/LogoComponent.vue";
  import InputComponent from "@/components/auth/input/TextInput.vue";
  import FetchError from "@/utils/errors/FetchError";

  const router = useRouter();
  const toast = useToastController();

  const auth = useAuthStore();
  const googleAuth = useGoogleAuth()

  const statusBarHeight = ref<number>(0);

  // Initialize Google Auth
  onMounted(async () => {
    await googleAuth.initialize();

    statusBarHeight.value = (await SafeArea.getStatusBarHeight()).height
  })

  // States
  const isSubmitting = ref<boolean>(false);
  const isLoggingInWithGoogle = ref<boolean>(false);

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
        await router.replace({ name: 'home' })
      } else if (redirectTo === 'verification') {
        await router.push({ name: 'verify-registration', query: { i: response.data.identifier } })
      }
    } catch (error) {
      await handleErrors(error);
    }

    // Hide loading indicator
    isSubmitting.value = false;
  }

  const handleGoogleAuth = async () => {
    // Show loading indicator
    isLoggingInWithGoogle.value = true;

    // Sign in with Google
    try {
      const data = await googleAuth.signIn();

      const result = await useFetchAPI({
        url: '/auth/login-oauth',
        method: 'POST',
        data: data
      });

      // Set bearer token
      await auth.setBearerToken(result.data.token);

      // Redirect to welcome screen if the user hasn't completed onboarding
      if (result.data.redirect_to === 'onboarding') {
        await router.push({ name: 'onboarding-welcome' })
      } else {
        await router.push({ name: 'home' })
      }
    } catch (error) {
      if (error instanceof FetchError) {
        await toast.presentToast({
          message: 'Error: ' + error.data.message,
          duration: 5000,
          icon: alertCircle
        })
      } else {
        console.error(error)

        await toast.presentToast({
          message: (error as Error).message,
          duration: 5000,
          icon: alertCircle
        })
      }
    }

    // Hide loading indicator
    isLoggingInWithGoogle.value = false;
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
    <ion-content class="ion-padding">
      <div class="flex flex-col items-center justify-center gap-4" :style="{ marginTop: `${statusBarHeight}px` }">
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
            <ion-button v-if="!isLoggingInWithGoogle" class="oauth" expand="block" shape="round" fill="outline" @click="handleGoogleAuth">
              <img src="/icons/google-logo.svg" alt="Google Logo" />
              <span class="ml-3">
                  Continue with Google
                </span>
            </ion-button>

            <ion-button v-else class="oauth" expand="block" shape="round" fill="outline" disabled>
              <img src="/icons/google-logo.svg" alt="Google Logo" />
              <span class="ml-3 mr-2">
                  Logging into Google...
                </span>
              <ion-spinner name="circular"></ion-spinner>
            </ion-button>
          </div>
          <!-- END OAuth Providers -->

          <p class="text-center">
            Already have an account? <router-link :to="{ name: 'login' }" class="font-bold hover:underline">Sign In</router-link>
          </p>
        </div>
      </div>

      <!-- TOS Agreement Modal -->
      <ion-modal ref="tosModal" trigger="open-tos-modal" @willPresent="showStatusBar" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-title>
              Terms & Conditions
            </ion-title>
            <ion-buttons slot="start">
              <ion-button @click="closeModal('tos')">
                <ion-icon aria-hidden="true" :icon="arrowBack" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding modal">
          <p><strong>ALLERTRAC</strong></p>
          <p><strong>TERMS AND CONDITIONS (VERSION 1)</strong></p>
          <p><strong>Effective Date:</strong> November 15, 2024</p>
          <p>Welcome to AllerTrac, a mobile application designed to support individuals with common food allergies by providing tools for allergen identification, emergency assistance, and medication management. Please read these Terms and Conditions carefully before using AllerTrac. By accessing or using AllerTrac, you agree to abide by these Terms. If you do not agree with any part of these Terms, please discontinue use of AllerTrac.</p>
          <h3 id="-1-eligibility-"><strong>1. Eligibility</strong></h3>
          <p>AllerTrac is intended for individuals aged 18 or older. By using AllerTrac, you confirm that you meet the age requirement or are supervised by a legal guardian who consents to these Terms.</p>
          <h3 id="-2-user-accounts-"><strong>2. User Accounts</strong></h3>
          <p>To access AllerTrac’s features, you must create an account. You are responsible for maintaining the confidentiality of your account details and for all activities under your account. Your session will expire after 90 days of inactivity.</p>
          <h3 id="-3-scope-of-services-"><strong>3. Scope of Services</strong></h3>
          <p><strong>AllerTrac provides:</strong></p>
          <ul>
            <li>Allergen identification in foods using a food scanning tool.</li>
            <li>Medication reminders and management.</li>
            <li>Emergency assistance tools, including an emergency alert and hospital locator.</li>
            <li>Educational resources on allergies based on credible sources.</li>
          </ul>
          <h3 id="-4-limitations-"><strong>4. Limitations</strong></h3>
          <ul>
            <li>Food Detection: AllerTrac’s food recognition tool depends on an external API, limiting the app to identify only recognizable ingredients.</li>
            <li>Accuracy Threshold: The tool will display results with 85% or greater confidence in allergen detection. Results below this threshold are not shown.</li>
            <li>Hospital Locator: The locator tool finds hospitals within a 10-kilometer radius but does not provide route directions.</li>
            <li>Internet Requirement: Certain features may require an active internet connection to function.</li>
            <li>No Professional Advice: AllerTrac does not replace medical advice, diagnosis, or treatment. For health-related issues, consult a healthcare provider.</li>
          </ul>
          <h3 id="-5-emergency-assistance-"><strong>5. Emergency Assistance</strong></h3>
          <p>AllerTrac includes an emergency button to notify contacts in case of an allergy emergency. However, AllerTrac does not guarantee emergency response and is not a substitute for professional emergency services.</p>
          <h3 id="-6-user-responsibilities-"><strong>6. User Responsibilities</strong></h3>
          <ul>
            <li>Users must verify that the food scanning results align with their known allergens.</li>
            <li>The medication management tool is intended only for personal use and should not be relied upon as a substitute for medical advice.</li>
          </ul>
          <h3 id="-7-privacy-and-data-use-"><strong>7. Privacy and Data Use</strong></h3>
          <p>AllerTrac collects and stores certain personal information to provide services such as allergen detection, emergency contact notification, and hospital locator. Please refer to our <strong>Privacy Policy</strong> for details on data collection, usage, and storage practices.</p>
          <h3 id="-8-intellectual-property-"><strong>8. Intellectual Property</strong></h3>
          <p>AllerTrac’s content, including its software, design, and proprietary materials, is owned by or licensed to AllerTrac and is protected under intellectual property laws. Educational information provided within AllerTrac is sourced from an external organization with expertise in allergy-related topics and is used with permission. Users are granted a limited, non-transferable license to use AllerTrac solely for personal, non-commercial purposes.</p>
          <h3 id="-9-limitation-of-liability-"><strong>9. Limitation of Liability</strong></h3>
          <p>AllerTrac is provided &quot;as is&quot; without warranties of any kind. AllerTrac is not responsible for:</p>
          <ul>
            <li>Any injury, loss, or damage resulting from reliance on food allergen detection results.</li>
            <li>Inaccuracies in data due to external factors such as lighting or image quality.</li>
            <li>Failures in the emergency alert system, emergency contact notifications, or medication reminders.</li>
          </ul>
          <h3 id="-10-modifications-to-the-terms-"><strong>10. Modifications to the Terms</strong></h3>
          <p>AllerTrac reserves the right to modify these Terms at any time. Any changes will be communicated to users, and continued use of AllerTrac constitutes acceptance of the modified Terms.</p>
        </ion-content>
      </ion-modal>
      <!-- END TOS Agreement Modal -->

      <!-- Privacy Agreement Modal -->
      <ion-modal ref="privacyModal" trigger="open-privacy-modal" @willPresent="showStatusBar" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-title>
              Privacy Policy
            </ion-title>
            <ion-buttons slot="start">
              <ion-button @click="closeModal('privacy')">
                <ion-icon aria-hidden="true" :icon="arrowBack" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding modal">
          <p><strong>ALLERTRAC</strong></p>
          <p><strong>PRIVACY POLICY (VERSION 1)</strong></p>
          <p><strong>Effective Date:</strong> November 15, 2024</p>
          <p>AllerTrac is committed to protecting the privacy of our users and ensuring the security of personal information. This Privacy Policy explains how we collect, use, store, and disclose your information when you use the AllerTrac mobile application.</p>
          <p>By using AllerTrac, you consent to the practices outlined in this Privacy Policy. If you do not agree with any part of this policy, please discontinue use of AllerTrac.</p>
          <p><strong>1. Information We Collect</strong></p>
          <p>We collect the following types of information to provide and improve AllerTrac’s services:</p>
          <p><strong>A. Personal Information</strong></p>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect personal details such as your name, email address, and any information you provide to set up your allergy profile.</li>
            <li><strong>Emergency Contacts:</strong> If you use the emergency contact feature, we collect and store the contact information you provide.</li>
          </ul>
          <p><strong>B. Usage Data</strong></p>
          <ul>
            <li><strong>Device Information:</strong> We collect information about the device you use to access AllerTrac, such as device model, operating system, IP address, and unique device identifiers.</li>
            <li><strong>Location Data:</strong> If you enable location services, we collect your location to provide hospital locator services. You can manage location permissions in your device settings.</li>
          </ul>
          <p><strong>C. Health and Allergy Information</strong></p>
          <ul>
            <li><strong>Allergy Profile:</strong> AllerTrac allows you to input information about your food allergies to tailor allergen detection and suggestions.</li>
            <li><strong>Food Scanning Data:</strong> Images you upload for food scanning may be temporarily processed to detect allergens, but we do not store these images after scanning.</li>
          </ul>
          <p><strong>2. How We Use Your Information</strong></p>
          <p>We use your information for the following purposes:</p>
          <ul>
            <li><strong>To Provide and Improve Services:</strong> We use allergy profile and account data to deliver accurate allergen detection, emergency contact notification, medication reminders, and hospital locator services.</li>
            <li><strong>To Personalize Your Experience:</strong> Allergy and health information enables AllerTrac to offer custom food suggestions and relevant educational content.</li>
            <li><strong>To Send Notifications:</strong> We use your contact information to send emergency notifications and allow you to manually set medication reminders on your profile page. You may create custom alarms and labels for your medications, enabling the application to provide reminders as specified by you.</li>
            <li><strong>For Analytics and Improvements:</strong> We may use de-identified data to improve AllerTrac’s performance, troubleshoot issues, and enhance user experience.</li>
          </ul>
          <p><strong>3. How We Share Your Information</strong></p>
          <p>We limit sharing of your information and only share it in the following cases:</p>
          <ul>
            <li><strong>With Your Consent:</strong> We share data with emergency contacts or other parties only when you explicitly request it, such as during an emergency notification.</li>
            <li><strong>Service Providers:</strong> We may work with third-party providers to assist in operating and improving AllerTrac, such as the food allergen recognition API.</li>
            <li><strong>Legal Compliance:</strong> We may disclose your information if required by law or to comply with a court order, regulatory request, or legal process.</li>
          </ul>
          <p><strong>4. Data Retention</strong></p>
          <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. You may delete your account and data at any time by contacting our support team.</p>
          <p><strong>5. Data Security</strong></p>
          <p>AllerTrac implements industry-standard security measures to protect your data. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          <p><strong>6. Your Privacy Rights</strong></p>
          <p>Depending on your location, you may have certain privacy rights regarding your personal information, including:</p>
          <ul>
            <li>Access: You may request access to your personal information that we hold.</li>
            <li>Correction: You may request that we update or correct your information.</li>
            <li>Deletion: You may request deletion of your account and personal information at any time.</li>
            <li>Data Portability: In certain jurisdictions, you may have the right to request a copy of your data.</li>
          </ul>
          <p>To exercise these rights, please contact us at <a href="mailto:&#x6c;&#117;&#105;&#115;&#x65;&#x6e;&#x72;&#x69;&#x63;&#x6f;&#46;&#x67;&#x72;&#x61;&#110;&#x61;&#100;&#x61;&#46;&#99;&#105;&#99;&#x73;&#x40;&#x75;&#x73;&#116;&#46;&#x65;&#x64;&#117;&#46;&#x70;&#104;">&#x6c;&#117;&#105;&#115;&#x65;&#x6e;&#x72;&#x69;&#x63;&#x6f;&#46;&#x67;&#x72;&#x61;&#110;&#x61;&#100;&#x61;&#46;&#99;&#105;&#99;&#x73;&#x40;&#x75;&#x73;&#116;&#46;&#x65;&#x64;&#117;&#46;&#x70;&#104;</a>; We may request verification of your identity before processing your request.</p>
          <p><strong>7. Children’s Privacy</strong></p>
          <p>AllerTrac is not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that a child under 13 has provided us with personal information, we will promptly delete it.</p>
          <p><strong>8. Changes to This Privacy Policy</strong></p>
          <p>We may update this Privacy Policy from time to time. When we make changes, we will notify you by updating the effective date above. Continued use of AllerTrac after changes are made indicates your acceptance of the revised policy.</p>
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

    h1, h2, h3, h4, h5, h6 {
      margin-bottom: 0.5rem;
    }

    p {
      margin-bottom: 1rem;
    }

    ul {
      list-style: initial;
      padding-inline-start: 40px;
      margin-bottom: 1rem;
      li {
        margin-bottom: 0.5rem;
      }
    }
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