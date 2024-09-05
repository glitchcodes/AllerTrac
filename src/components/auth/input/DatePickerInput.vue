<script setup lang="ts">
  import {computed, ref} from "vue";
  import { IonInput, IonDatetime, IonModal, IonContent, DatetimeCustomEvent } from "@ionic/vue";

  const props = defineProps<{
    placeholder: string,
    dataCy?: string
    errors?: Array<string>
  }>()

  const model = defineModel();
  const inputValue = ref<string>('');

  const pickerId = computed(() => {
    const id = Math.floor(Math.random() * 9999);

    return `date-picker-${id}`
  });

  const friendlyDate = computed(() => {
    if (inputValue.value.length === 0) return;

    const date = new Date(inputValue.value);
    const formattedDate = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return formattedDate.format(date);
  })

  const updateModel = (e: DatetimeCustomEvent) => {
    model.value = e.detail.value;

    if (typeof e.detail.value === "string") {
      inputValue.value = e.detail.value;
    }
  }

  const isInvalid = computed(() => props.errors && props.errors.length > 0)
</script>

<template>
  <div class="flex items-center border-4 rounded-full gap-3"
       :class="{ 'border-rose-400': isInvalid, 'border-[#43727a]': !isInvalid }">
    <div class="rounded-l-full px-4 py-3 pr-3 flex items-center relative scale-105"
         :class="{ 'bg-rose-400 text-white': isInvalid, 'bg-primary': !isInvalid }">
      <slot name="icon"></slot>
    </div>

    <ion-input :id="pickerId" :placeholder="placeholder" :value="friendlyDate" readonly></ion-input>

    <ion-modal :trigger="pickerId" :initial-breakpoint="0.5" :breakpoints="[0, 0.25, 0.5, 0.75]">
      <ion-content>
<!--        <h1>Balls</h1>-->
        <ion-datetime presentation="date"
                      size="cover"
                      :show-default-buttons="true"
                      @ionChange="updateModel">
        </ion-datetime>
      </ion-content>
    </ion-modal>
  </div>

  <div class="relative -top-[1rem]" v-if="isInvalid">
    <p v-for="(error, index) in errors" :key="index" class="text-rose-400 mt-1">
      {{ error }}
    </p>
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