<script setup lang="ts">
  import { computed } from "vue";
  import { IonAvatar, IonIcon } from "@ionic/vue";
  import { brush } from "ionicons/icons";
  import type { User } from "@/types/User";

  const emit = defineEmits<{
    (e: 'openAvatarAction'): void
  }>()

  const props = withDefaults(defineProps<{
    user: User
    editMode?: boolean
  }>(),{
    editMode: false
  });

  const full_name = computed(() => {
    return `${props.user.first_name || 'John' } ${props.user.last_name || 'Doe' }`
  });

  const avatar = computed(() => {
    return props.user.avatar && props.user.avatar.length > 0 ? props.user.avatar : '/pfp.png';
  })

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
      <div class="relative" @click="emit('openAvatarAction')">
        <ion-avatar>
          <img :src="avatar" width="80" height="80" alt="Food" />
        </ion-avatar>
        <span v-if="props.editMode" class="bg-slate-200 rounded-full px-[6px] py-[6px] flex items-center absolute top-0 right-0">
          <ion-icon aria-label="Edit profile picture" :icon="brush" class="text-[13px]"  />
        </span>
      </div>
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