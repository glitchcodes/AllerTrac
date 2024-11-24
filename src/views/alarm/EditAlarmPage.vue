<script setup lang="ts">
  import { reactive, onMounted, computed } from "vue";
  import {
    DatetimeCustomEvent,
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    isPlatform,
    useIonRouter
  } from "@ionic/vue";
  import { useRoute } from "vue-router";
  import { useAlarmStore } from "@/store/alarm";
  import { chevronBack, closeCircleOutline, save } from "ionicons/icons";
  import { Weekday } from "@capacitor/local-notifications";
  import { useToastController } from "@/composables/useToastController";
  import type { AlarmProp } from "@/types/Alarm";

  const route = useRoute();
  const ionRouter = useIonRouter();
  const alarmStore = useAlarmStore();
  const toastController = useToastController();

  const routeAlarmId = parseInt(route.params.id as string);
  const alarm = alarmStore.getAlarm(routeAlarmId);

  // Redirect to alarm page
  if (alarm === null) {
    ionRouter.navigate('/pages/profile', 'back', 'pop');
  }

  const form = reactive<AlarmProp>({
    title: alarm!.title,
    message: alarm!.message,
    time: {
      hour: alarm!.time.hour,
      minute: alarm!.time.minute
    },
    repeatWeekly: alarm!.repeatWeekly,
    weekdays: alarm!.weekdays,
    sound: alarm!.sound
  });

  type FormErrors = {
    title: string[]
    message: string[]
  }

  const formErrors = reactive<FormErrors>({
    title: [],
    message: [],
  });

  onMounted(() => {
    // Get current hour and minute
    const date = new Date();

    form.time.hour = date.getHours();
    form.time.minute = date.getMinutes();
  });

  const ionTime = computed(() => {
    const d = new Date();

    d.setHours(alarm!.time.hour - d.getTimezoneOffset());
    d.setMinutes(alarm!.time.minute - d.getTimezoneOffset());

    return d.toISOString();
  })

  const getErrorMessage = (type: string) => {
    return formErrors[type as keyof FormErrors][0];
  }

  const handleTimeChange = (e: DatetimeCustomEvent) => {
    const datetime = new Date(e.detail.value as string)

    form.time.hour = datetime.getHours();
    form.time.minute = datetime.getMinutes();
  }

  const saveChanges = async () => {
    // Perform Validations
    if (form.title.length === 0) {
      formErrors.title.push('Required');
    }
    if (form.title.length > 30) {
      formErrors.title.push('Maximum of 30 characters');
    }
    if (form.message.length === 0) {
      formErrors.message.push('Required');
    }
    if (form.message.length > 50) {
      formErrors.message.push('Maximum of 50 characters');
    }

    // If any of the fields on formErrors has items, show an error
    if (formErrors.title.length > 0 || formErrors.message.length > 0) {
      // Show error message or handle the error
      await toastController.presentToast({
        message: 'You have errors in your alarm',
        icon: closeCircleOutline,
        duration: 3000,
        position: "bottom",
        positionAnchor: 'scan-food-button'
      })

      return;
    }

    try {
      // Save alarm locally
      await alarmStore.editAlarm(routeAlarmId, form);

      ionRouter.navigate('/pages/profile', 'back', 'pop');
    } catch (error) {
      console.error(error);

      await toastController.presentToast({
        message: 'Something went wrong while creating your alarm. Check the console for errors',
        icon: closeCircleOutline,
        duration: 3000,
        position: "bottom",
        positionAnchor: 'scan-food-button'
      })
    }
  }
</script>

<template>
  <ion-page>
    <ion-header v-if="isPlatform('ios')">
      <ion-toolbar>
        <ion-title>
          Edit Alarm
        </ion-title>
        <ion-buttons slot="start">
          <ion-button router-link="/pages/profile" router-direction="back">
            <ion-icon aria-label="Back" :icon="chevronBack" />
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="saveChanges">
            <ion-icon aria-label="Save" :icon="save" />
          </ion-button>
        </ion-buttons>
<!--        <ion-progress-bar type="indeterminate"></ion-progress-bar>-->
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="!isPlatform('ios')" class="ion-padding">
        <nav class="navbar mb-4 py-2 relative">
          <p class="font-bold text-xl text-center">
            Edit Alarm
          </p>
        </nav>
      </div>

      <div class="border-[#efeee9] h-[1px] w-full border-b-[2px] relative -bottom-[1px] z-20" />
      <ion-datetime
          presentation="time"
          :prefer-wheel="true"
          size="cover"
          class="z-10"
          :value="ionTime"
          @ionChange="handleTimeChange"
      >
      </ion-datetime>
      <div class="border-[#efeee9] h-[1px] w-full border-t-[2px] relative -top-[1px] z-20" />


      <section class="ion-padding mt-4">
        <div class="bg-white rounded-lg" :class="{ 'py-1': isPlatform('ios') }">
          <ion-list :inset="true">
            <ion-item lines="none">
              <ion-input v-model="form.title"
                         label="Title"
                         placeholder="Medication"
                         class="ion-text-right"
                         :class="{ 'ion-touched ion-invalid': formErrors.title.length > 0 }"
                         :error-text="getErrorMessage('title')"
                         @ionInput="() => formErrors.title = []">
              </ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-input v-model="form.message"
                         label="Description"
                         placeholder="e.g. Very important!"
                         class="ion-text-right"
                         :class="{ 'ion-touched ion-invalid': formErrors.message.length > 0 }"
                         :error-text="getErrorMessage('message')"
                         @ionInput="() => formErrors.message = []">
              </ion-input>
            </ion-item>
            <ion-item lines="none">
              <ion-select
                  v-model="form.weekdays"
                  label="Repeat every"
                  aria-label="Repeat every"
                  placeholder="None"
                  justify="space-between"
                  :multiple="true"
                  :value="form.weekdays"
              >
                <ion-select-option :value="Weekday.Sunday">
                  Sunday
                </ion-select-option>
                <ion-select-option :value="Weekday.Monday">
                  Monday
                </ion-select-option>
                <ion-select-option :value="Weekday.Tuesday">
                  Tuesday
                </ion-select-option>
                <ion-select-option :value="Weekday.Wednesday">
                  Wednesday
                </ion-select-option>
                <ion-select-option :value="Weekday.Thursday">
                  Thursday
                </ion-select-option>
                <ion-select-option :value="Weekday.Friday">
                  Friday
                </ion-select-option>
                <ion-select-option :value="Weekday.Saturday">
                  Saturday
                </ion-select-option>
              </ion-select>
            </ion-item>
<!--            <ion-item lines="none">-->
<!--              <ion-select-->
<!--                  label="Sound"-->
<!--                  aria-label="Sound"-->
<!--                  justify="space-between"-->
<!--                  :value="form.sound"-->
<!--              >-->
<!--                <ion-select-option value="default">-->
<!--                  Default-->
<!--                </ion-select-option>-->
<!--                <ion-select-option value="bird">-->
<!--                  Bird-->
<!--                </ion-select-option>-->
<!--              </ion-select>-->
<!--            </ion-item>-->
          </ion-list>
        </div>

        <div v-if="!isPlatform('ios')" class="flex gap-2">
          <ion-button fill="outline" class="flex-1" router-link="/pages/profile" router-direction="back">
            Cancel
          </ion-button>
          <ion-button class="flex-1" @click="saveChanges">
            Save
          </ion-button>
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