<script setup lang="ts">
  import { IonIcon } from "@ionic/vue";
  import { medkit } from "ionicons/icons";
</script>

<template>
  <div class="bg-white shadow-md p-4 rounded-lg">
    <div class="flex flex-grow items-center text-2xl gap-2 mb-4 min-h-[44px]">
      <ion-icon :icon="medkit" />
      <h6 class="font-bold text-xl">
        Emergency Contacts
      </h6>
    </div>

    <div class="flex flex-col items-center gap-4">
      <div class="bg-neutral-100 rounded-xl px-6 py-4 border-2 shadow w-full">
        <h2 class="text-2xl text-primary font-bold mb-2">
          Juana Dela Cruz
        </h2>
        <ul class="text-primary text-sm">
          <li class="text-[12px]">Relationship:</li>
          <li class="text-[12px]">Phone Number:</li>
          <li class="text-[12px]">Email Address:</li>
        </ul>
      </div>

      <div class="bg-neutral-100 rounded-xl px-6 py-4 border-2 shadow w-full">
        <h2 class="text-2xl text-primary font-bold mb-2">
          Juana Dela Cruz
        </h2>
        <ul class="text-primary text-sm">
          <li class="text-[12px]">Relationship:</li>
          <li class="text-[12px]">Phone Number:</li>
          <li class="text-[12px]">Email Address:</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">

</style>