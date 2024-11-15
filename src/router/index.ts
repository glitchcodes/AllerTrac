import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { Preferences } from "@capacitor/preferences";

import { useAlertController } from "@/composables/useAlertController";
import { useAuthStore } from "@/store/auth";

import DefaultLayout from '@/views/layouts/DefaultLayout.vue';

import HomePage from "@/views/HomePage.vue";
import ScanFoodPage from "@/views/ScanFoodPage.vue";
import ScanResultPage from "@/views/ScanResultPage.vue";
import SearchFoodPage from "@/views/SearchFoodPage.vue";
import OnboardingLayout from "@/views/layouts/OnboardingLayout.vue";
import LogoutPage from "@/views/auth/LogoutPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/pages/home'
  },
  {
    path: '/u/',
    component: OnboardingLayout,
    meta: {
      requiresNoAuth: true
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/RegisterPage.vue')
      },
      {
        path: 'register/verify',
        name: 'verify-registration',
        component: () => import('@/views/auth/OTPVerificationPage.vue')
      },
      {
        path: 'password/forget',
        name: 'forget-password',
        component: () => import('@/views/auth/ForgetPasswordPage.vue')
      },
      {
        path: 'password/verify',
        name: 'verify-password-reset',
        component: () => import('@/views/auth/OTPVerificationPage.vue')
      },
      {
        path: 'password/reset',
        name: 'reset-password',
        component: () => import('@/views/auth/ResetPasswordPage.vue')
      }
    ]
  },
  {
    path: '/o/',
    component: OnboardingLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'welcome',
        name: 'onboarding-welcome',
        component: () => import('@/views/onboarding/WelcomePage.vue')
      },
      {
        path: 'allergies',
        name: 'onboarding-allergens',
        component: () => import('@/views/onboarding/AllergensPage.vue')
      },
      {
        path: 'contacts',
        name: 'onboarding-contacts',
        component: () => import('@/views/onboarding/EmergencyPage.vue')
      },
      {
        path: 'congrats',
        name: 'onboarding-final',
        component: () => import('@/views/onboarding/FinalPage.vue')
      }
    ]
  },
  {
    path: '/pages/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: '/pages/home'
      },
      {
        path: 'home',
        name: 'home',
        component: HomePage
      },
      {
        path: 'scan-food',
        name: 'scan-food',
        component: ScanFoodPage
      },
      {
        path: 'scan-results',
        name: 'scan-results',
        component: ScanResultPage
      },
      {
        path: 'search',
        name: 'meal-search',
        component: SearchFoodPage
      },
      {
        path: 'emergency',
        name: 'emergency-index',
        component: () => import('@/views/emergency/IndexPage.vue')
      },
      {
        path: 'emergency/hospitals',
        name: 'emergency-locator',
        component: () => import('@/views/emergency/LocatorPage.vue')
      },
      {
        path: 'alarm',
        name: 'user-alarms',
        component: () => import('@/views/profile/AlarmPage.vue')
      },
      {
        path: 'profile',
        name: 'view-profile',
        meta: {
          requiresAuth: true
        },
        component: () => import('@/views/profile/ProfilePage.vue')
      },
      {
        path: 'profile/edit',
        name: 'edit-profile',
        meta: {
          requiresAuth: true
        },
        component: () => import('@/views/profile/EditProfilePage.vue')
      },
      {
        path: 'profile/security',
        name: 'oauth-profile',
        meta: {
          requiresAuth: true
        },
        component: () => import('@/views/profile/SecurityPage.vue')
      },
      {
        path: '/pages/alarms/create',
        name: 'alarms-create',
        component: () => import('@/views/alarm/CreateAlarmPage.vue')
      },
      {
        path: '/pages/alarms/:id',
        name: 'alarms-edit',
        component: () => import('@/views/alarm/EditAlarmPage.vue')
      },
      {
        path: '/pages/attributions',
        name: 'attributions',
        component: () => import('@/views/AttributionPage.vue')
      }
    ]
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guards
router.beforeEach(async (to, from) => {
  const alertController = useAlertController();
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresNoAuth)) {
    const hasBearerToken = await Preferences.get({ key: 'access_token' });

    if (hasBearerToken.value && hasBearerToken.value.length > 0) {
      return { name: 'home' }
    }

    return true;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If not authenticated, return false
    try {
      await authStore.validateToken();
    } catch (error) {
      // Remove the access token from the Preferences
      await Preferences.remove({ key: 'access_token' })

      // Log the error
      console.error(error);

      if (from.name === undefined) {
        return { name: 'login' }
      } else {
        // Show an alert
        await alertController.presentAlert({
          header: "Unauthorized",
          message: "This page is only for logged-in users",
          buttons: [
            {
              text: "Okay",
              role: 'cancel'
            }
          ]
        })

        return false;
      }
    }
  }
})

export default router
