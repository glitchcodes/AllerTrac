<script setup lang="ts">
  import { IonInput } from "@ionic/vue";

  type InputTypeAttribute = "text" | "password" | "email" | "number" | "search" | "tel" | "url"

  const props = withDefaults(defineProps<{
    placeholder: string,
    type: InputTypeAttribute,
    isInvalid?: boolean
  }>(), {
    isInvalid: false
  })

  const model = defineModel();

  const updateModel = (e: Event) => {
    const target = e.target as HTMLInputElement
    model.value = target.value;
  }
</script>

<template>
  <div class="flex items-center border-4 rounded-full gap-3"
       :class="{ 'border-rose-400': isInvalid, 'border-[#43727a]': !isInvalid }">
    <div class="rounded-l-full px-4 py-3 pr-3 flex items-center relative scale-105"
         :class="{ 'bg-rose-400 text-white': isInvalid, 'bg-primary': !isInvalid }">
      <slot name="icon"></slot>
    </div>
    <ion-input class="px-4 py-3"
               :placeholder="props.placeholder"
               :type="props.type"
               @ionInput="updateModel">
    </ion-input>
  </div>
</template>

<style scoped lang="scss">
  ion-input {
    --padding-bottom: 0px;
    --padding-end: 0px;
    --padding-start: 0px;
    --padding-top: 0px;
    --highlight-color-focused: none;
  }

  :slotted(ion-icon) {
    font-size: 24px;
    position: relative;
    top: 1px;
  }
</style>