<script setup lang="ts">
  import { computed } from "vue";
  import { IonInput, IonInputPasswordToggle } from "@ionic/vue";
  import { phoneMaskOptions } from "@/utils/helpers";

  type InputTypeAttribute = "text" | "password" | "email" | "number" | "search" | "tel" | "url"

  const props = withDefaults(defineProps<{
    placeholder: string,
    type: InputTypeAttribute,
    disabled?: boolean
    dataCy?: string
    errors?: Array<string>
  }>(), {
    disabled: false
  })

  const model = defineModel();

  const updateModel = (e: Event) => {
    const target = e.target as HTMLInputElement
    model.value = target.value;
  }

  const isInvalid = computed(() => props.errors && props.errors.length > 0)
</script>

<template>
  <div>
    <div class="flex items-center border-4 rounded-full gap-3"
         :class="{ 'border-rose-400': isInvalid, 'border-[#43727a]': !isInvalid }">
      <div class="rounded-l-full px-4 py-3 pr-3 flex items-center relative scale-105"
           :class="{ 'bg-rose-400 text-white': isInvalid, 'bg-primary': !isInvalid }">
        <slot name="icon"></slot>
      </div>
      <ion-input v-if="props.type !== 'tel'"
                 class="px-4 py-3"
                 :data-cy="dataCy"
                 :placeholder="props.placeholder"
                 :type="props.type"
                 :disabled="props.disabled"
                 :value="modelValue"
                 @ionInput="updateModel">
        <ion-input-password-toggle v-if="type === 'password'" slot="end"></ion-input-password-toggle>
      </ion-input>
      <ion-input v-else
                 v-maskito="phoneMaskOptions"
                 class="px-4 py-3"
                 :data-cy="dataCy"
                 :placeholder="props.placeholder"
                 :type="props.type"
                 :disabled="props.disabled"
                 :value="modelValue"
                 @ionInput="updateModel">
      </ion-input>
    </div>

    <div v-if="isInvalid">
      <p v-for="(error, index) in errors" :key="index" class="text-rose-400 mt-1">
        {{ error }}
      </p>
    </div>
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