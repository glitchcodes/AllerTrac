<script setup lang="ts">
  import { IonIcon, IonButton, IonRippleEffect, IonToggle, isPlatform, ToggleCustomEvent} from "@ionic/vue";
  import { addSharp, alarm } from "ionicons/icons";
  import { Capacitor } from "@capacitor/core";

  import { useNotificationStore } from "@/store/notification";
  import { useAlarmStore } from "@/store/alarm";

  import AlertMessage from "@/components/AlertMessage.vue";
  import type { Alarm } from "@/types/Alarm";

  const notificationStore = useNotificationStore();
  const alarmStore = useAlarmStore();

  const formatTo12Hour = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Add leading zero if needed

    return `${adjustedHour}:${formattedMinute} ${period}`;
  }

  const toggleAlarm = (e: ToggleCustomEvent, alarm: Alarm) => {
    if (alarm.isScheduled) {
      alarmStore.cancelAlarm(alarm.id);
      alarm.isScheduled = false;
    } else {
      alarmStore.scheduleAlarm(alarm);
      alarm.isScheduled = true;
    }
  }
</script>

<template>
  <div class="bg-white shadow-md p-4 rounded-lg">
    <div class="flex items-center justify-between">

      <div class="flex flex-grow items-center text-2xl gap-2">
        <ion-icon :icon="alarm" />
        <h6 class="text-xl font-bold flex-grow">
          Alarms
        </h6>

        <ion-button v-if="isPlatform('ios')" fill="outline" router-link="/pages/alarms/create" router-direction="forward">
          <ion-icon slot="icon-only" aria-label="Save" :icon="addSharp"></ion-icon>
        </ion-button>

        <ion-button v-else fill="outline" shape="round" router-link="/pages/alarms/create" router-direction="forward">
          <ion-icon slot="start" aria-label="Save" :icon="addSharp"></ion-icon>
          <span>New</span>
        </ion-button>
      </div>

    </div>

    <AlertMessage v-if="notificationStore.permissionStatus !== 'granted' && Capacitor.isNativePlatform()" type="danger" class="my-4">
      We need permissions to send you notifications/reminders.

      <ion-button slot="end" size="small" color="secondary" @click="notificationStore.requestPermissions()">
        Fix
      </ion-button>
    </AlertMessage>

    <AlertMessage v-else-if="notificationStore.exactAlarmStatus !== 'granted' && Capacitor.isNativePlatform()" type="warning" class="my-4">
      Alarms may not be sent on time due to Android 12's alarm permission policies.

      <ion-button slot="end" size="small" color="secondary" @click="notificationStore.openExactAlarmSettings()">
        Fix
      </ion-button>
    </AlertMessage>

    <AlertMessage v-else type="info" class="my-4">
      Tap on an alarm to edit it
    </AlertMessage>

    <div class="flex flex-col gap-3">
      <div v-for="alarm in alarmStore.alarms"
           :key="alarm.id"
           class="flex items-center justify-between w-full ion-activatable ripple-parent"
      >
        <ion-ripple-effect></ion-ripple-effect>
        <div class="bg-neutral-100 rounded-2xl p-6 text-primary font-bold flex items-center w-full justify-between border-2 shadow-md">
          <h2 class="text-2xl text-primary font-bold">
            {{ formatTo12Hour(alarm.time.hour, alarm.time.minute) }}
          </h2>
          <ion-toggle :checked="alarm.isScheduled" @ionChange="toggleAlarm($event, alarm)"></ion-toggle>
        </div>
      </div>
    </div>

<!--    <div class="bg-primary rounded-2xl p-4 flex items-center justify-center">-->
<!--      -->
<!--    </div>-->
  </div>
</template>

<style scoped lang="scss">

</style>