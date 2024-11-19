<script setup lang="ts">
  import { ref } from "vue";
  import { IonChip, IonLabel } from "@ionic/vue";
  import { Preferences } from "@capacitor/preferences";
  import type { Allergen } from "@/types/Allergen";

  const allergens = ref<Allergen[]>([]);

  const { value } = await Preferences.get({ key: 'allergens' })
  allergens.value = value ? JSON.parse(value) : [];

</script>

<template>
  <div class="bg-[#43727a] p-4 rounded-lg text-white transition-all min-h-[310px]">
    <div class="mb-4">
      <h5 class="font-bold my-1">User's allergens</h5>
      <div v-if="allergens.length > 0">
        <transition-group name="fade">
          <ion-chip v-for="(allergen, index) in allergens" :key="index">
            <ion-label>{{ allergen.name }}</ion-label>
          </ion-chip>
        </transition-group>
      </div>
      <p v-else>
        Nothing selected yet
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
  ion-chip {
    --background: #fff
  }
</style>