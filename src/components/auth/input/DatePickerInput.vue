<script setup lang="ts">
  import { computed, ref } from "vue";
  import {
    isPlatform,
    IonInput,
    IonDatetime,
    IonModal,
    IonContent,
    IonIcon,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonButtons,
    IonButton,
    DatetimeCustomEvent
  } from "@ionic/vue";
  import { checkmarkOutline, closeOutline } from "ionicons/icons";

  const props = defineProps<{
    placeholder: string,
    dataCy?: string
    errors?: Array<string>
  }>()

  const model = defineModel();
  const birthdayModal = ref<InstanceType<typeof IonModal>>();
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

  const updateBirthday = (e: DatetimeCustomEvent) => {
    if (typeof e.detail.value === "string") {
      inputValue.value = e.detail.value;
    }
  }

  const confirmModal = () => {
    model.value = inputValue.value;

    birthdayModal.value!.$el.dismiss();
  }

  const dismissModal = () => {
    // Reset value
    model.value = "";
    inputValue.value = "";

    // Dismiss the modal
    birthdayModal.value!.$el.dismiss();
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

    <ion-modal ref="birthdayModal" :trigger="pickerId" :initial-breakpoint="0.75" :breakpoints="[0.5, 0.75]" :backdrop-dismiss="false">
      <ion-header :class="{ 'ion-no-border': !isPlatform('ios') }">
        <ion-toolbar class="relative">
          <ion-buttons slot="start">
            <ion-button @click="dismissModal">
              <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>

          <ion-title class="text-center">
            Birthday
          </ion-title>

          <ion-buttons slot="end">
            <ion-button @click="confirmModal">
              <ion-icon slot="icon-only" :icon="checkmarkOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-datetime presentation="date"
                      size="cover"
                      :show-default-title="true"
                      @ionChange="updateBirthday">
          <span slot="title">Select your birthday</span>
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

  ion-datetime {
    border-radius: 0.5rem;
  }

  :slotted(ion-icon) {
    font-size: 24px;
    position: relative;
    top: 1px;
  }

  ion-modal {
    --width: 100%;
  }
</style>