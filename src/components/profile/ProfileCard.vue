<script setup lang="ts">
  import { IonAvatar } from "@ionic/vue";
  import { useAuthStore } from "@/store/auth";
  import { storeToRefs } from "pinia";

  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore)
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex items-center gap-3">
      <ion-avatar>
        <img src="/pfp.png" alt="Food" />
      </ion-avatar>
      <div>
        <h6 class="font-bold">Welcome!</h6>
        <h2 class="text-xl text-primary font-bold mb-3">
          {{ user!.full_name }}
        </h2>

        <ul class="text-sm">
          <li class="text-[12px]">
            <span class="text-primary font-bold">Phone Number:</span>
            {{ user!.phone_number }}
          </li>
          <li class="text-[12px]">
            <span class="text-primary font-bold">Email Address:</span>
            {{ user!.email }}
          </li>
          <li class="text-[12px]">
            <span class="text-primary font-bold">Birthday:</span>
            {{ user!.birthday }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  ion-avatar {
    width: 80px;
    height: 80px;
  }
</style>