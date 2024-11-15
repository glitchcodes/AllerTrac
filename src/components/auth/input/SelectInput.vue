<script setup lang="ts">
import { computed } from "vue";
import { IonSelect, IonSelectOption } from "@ionic/vue";
import { capitalizeString } from "../../../utils/helpers";

const props = withDefaults(defineProps<{
  label: string,
  options: string[]
  disabled?: boolean
  dataCy?: string
  errors?: Array<string>
}>(), {
  disabled: false
})

const model = defineModel();

const updateModel = (e: Event) => {
  const target = e.target as HTMLSelectElement
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
      <ion-select :aria-label="props.label" :value="model!" @ionChange="updateModel">
        <ion-select-option v-for="(option, index) in props.options" :value="option" :key="index">
          {{ capitalizeString(option) }}
        </ion-select-option>
      </ion-select>
    </div>

    <div v-if="isInvalid">
      <p v-for="(error, index) in errors" :key="index" class="text-rose-400 mt-1">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
ion-select {
  --padding-bottom: 0px;
  --padding-end: 0px;
  --padding-start: 0px;
  --padding-top: 0px;
  --highlight-color-focused: none;

  //&:deep(.select-wrapper-inner) {
  //  justify-content: space-between;
  //}

  &::part(label) {
    color: white;
    //justify-content: space-between;
  }
}

:slotted(ion-icon) {
  font-size: 24px;
  position: relative;
  top: 1px;
}
</style>