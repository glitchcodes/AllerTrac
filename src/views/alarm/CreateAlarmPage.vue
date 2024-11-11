<script setup lang="ts">
  import { ref, reactive } from "vue";
  import {
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonInput,
    IonButtons,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonDatetime,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    isPlatform
  } from "@ionic/vue";
  import { chevronBack, save } from "ionicons/icons";

  const form = reactive({
    label: '',
    repeatDays: [0,2],
    sound: 'default'
  });

  const inputErrors = ref<any>({});

  const getErrorMessage = (type: string) => {
    const errors = inputErrors.value;
    switch (type) {
      case "label":
        if (!errors.label || errors.label.length === null) return "";
        return errors.label[0];
    }
  }


</script>

<template>
  <ion-page>
    <ion-header v-if="isPlatform('ios')">
      <ion-toolbar>
        <ion-title>
          Create Alarm
        </ion-title>
        <ion-buttons slot="start">
          <ion-button router-link="/pages/profile" router-direction="back">
            <ion-icon aria-label="Back" :icon="chevronBack" />
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon aria-label="Save" :icon="save" />
          </ion-button>
        </ion-buttons>
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="!isPlatform('ios')" class="ion-padding">
        <nav class="navbar flex items-center mb-4 gap-3 relative">
          <ion-button color="tertiary" shape="round" router-link="/pages/profile" router-direction="back">
            <ion-icon slot="icon-only" :icon="chevronBack" />
          </ion-button>
          <p class="font-bold text-xl absolute left-1/2 transform -translate-x-1/2">
            Create Alarm
          </p>
        </nav>
      </div>

      <div class="border-[#efeee9] h-[1px] w-full border-b-[2px] relative -bottom-[1px] z-20" />
      <ion-datetime presentation="time" :prefer-wheel="true" size="cover" class="z-10"></ion-datetime>
      <div class="border-[#efeee9] h-[1px] w-full border-t-[2px] relative -top-[1px] z-20" />


      <section class="ion-padding mt-4">
        <div class="bg-white rounded-lg" :class="{ 'py-1': isPlatform('ios') }">
          <ion-list :inset="true">
            <ion-item lines="none">
              <ion-input v-model="form.label"
                         label="Name"
                         placeholder="Medication"
                         :class="{ 'ion-touched ion-invalid': inputErrors.label }"
                         :error-text="getErrorMessage('label')"
                         @ionInput="() => inputErrors.label = ''">
              </ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-select
                  label="Repeat every"
                  aria-label="Repeat every"
                  justify="space-between"
                  :multiple="true"
                  :value="form.repeatDays"
              >
                <ion-select-option :value="0">Sunday</ion-select-option>
                <ion-select-option :value="1">Monday</ion-select-option>
                <ion-select-option :value="2">Tuesday</ion-select-option>
                <ion-select-option :value="3">Wednesday</ion-select-option>
                <ion-select-option :value="4">Thursday</ion-select-option>
                <ion-select-option :value="5">Friday</ion-select-option>
                <ion-select-option :value="6">Saturday</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item lines="none">
              <ion-select
                  label="Sound"
                  aria-label="Sound"
                  justify="space-between"
                  :value="form.sound"
              >
                <ion-select-option value="default">Default</ion-select-option>
                <ion-select-option value="bird">Bird</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
  ion-input {
    &.input-fill-outline:deep(.label-text-wrapper.sc-ion-input-md) {
      -webkit-transform: translateY(65%) scale(1);
      transform: translateY(65%) scale(1);
    }
  }

  ion-list {
    --ion-item-background: white;
    margin-inline-start: 0.5rem!important;
    margin-inline-end: 0.5rem!important;
  }
</style>