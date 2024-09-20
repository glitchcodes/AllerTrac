<script setup lang="ts">
  import { computed } from "vue";
  import { IonAvatar } from "@ionic/vue";
  import type { User } from "@/types/User";

  const props = defineProps<{
    user: User
  }>();

  const full_name = computed(() => {
    return `${props.user.first_name || 'John' } ${props.user.last_name || 'Doe' }`
  });

  const friendlyDate = computed(() => {
    if (props.user.birthday.length === 0) return;

    const date = new Date(props.user.birthday);
    const formattedDate = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return formattedDate.format(date);
  });
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
          {{ full_name }}
        </h2>

        <ul class="text-sm">
          <li class="text-[12px]">
            <span class="text-primary font-bold">Phone Number:</span>
            {{ props.user.phone_number }}
          </li>
          <li class="text-[12px]">
            <span class="text-primary font-bold">Email Address:</span>
            {{ props.user.email }}
          </li>
          <li class="text-[12px]">
            <span class="text-primary font-bold">Birthday:</span>
            {{ friendlyDate }}
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