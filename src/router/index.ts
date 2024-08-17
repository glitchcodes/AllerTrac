import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import DefaultLayout from '@/views/layouts/DefaultLayout.vue';

import HomePage from "@/views/HomePage.vue";
import ScanFood from "@/views/ScanFoodPage.vue";
import ScanResult from "@/views/ScanResultPage.vue";
import OnboardingLayout from "@/views/layouts/OnboardingLayout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/u/login'
  },
  {
    path: '/u/',
    component: OnboardingLayout,
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
        path: 'password/forget',
        name: 'forget-password',
        component: () => import('@/views/auth/ForgetPasswordPage.vue')
      },
      {
        path: 'password/verify',
        name: 'verify-password-reset',
        component: () => import('@/views/auth/ResetVerificationPage.vue')
      },
      {
        path: 'password/reset',
        name: 'reset-password',
        component: () => import('@/views/auth/ResetPasswordPage.vue')
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
        component: HomePage
      },
      {
        path: 'scan-food',
        component: ScanFood
      },
      {
        path: 'scan-results',
        component: () => ScanResult
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
