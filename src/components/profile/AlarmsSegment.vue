<script setup lang="ts">
  import { onMounted, computed, ref } from "vue";
  import {
    IonContent,
    IonIcon,
    IonButton,
    IonRippleEffect,
    IonToggle,
    IonPopover,
    IonList,
    IonItem,
    IonLabel,
    isPlatform,
    alertController,
    actionSheetController,
    useIonRouter,
    ToggleCustomEvent,
  } from "@ionic/vue";
  import {
    addSharp,
    alarm,
    arrowBackOutline,
    cloudDoneOutline,
    cloudOfflineOutline,
    createOutline,
    ellipsisHorizontal,
    syncOutline,
    trashOutline
  } from "ionicons/icons";
  import { Capacitor } from "@capacitor/core";

  import { useNotificationStore } from "@/store/notification";
  import { useAlarmStore } from "@/store/alarm";

  import AlertMessage from "@/components/AlertMessage.vue";
  import type { Alarm } from "@/types/Alarm";

  const ionRouter = useIonRouter();
  const notificationStore = useNotificationStore();
  const alarmStore = useAlarmStore();

  const isAndroid = computed(() => {
    return Capacitor.isNativePlatform() && isPlatform('android');
  });

  onMounted(async () => {
    await alarmStore.checkAlarmVersion()
  })

  const formatTo12Hour = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Add leading zero if needed

    return `${adjustedHour}:${formattedMinute} ${period}`;
  }

  const showAlarmOptions = async (alarm: Alarm) => {
    const actionSheet = await actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Delete',
          icon: !isPlatform('ios') ? trashOutline : undefined,
          role: 'destructive',
          data: {
            action: 'delete'
          }
        },
        {
          text: 'Edit',
          icon: !isPlatform('ios') ? createOutline : undefined,
          data: {
            action: 'edit'
          }
        },
        {
          text: 'Cancel',
          icon: !isPlatform('ios') ? arrowBackOutline : undefined,
          role: 'cancel',
          data: {
            action: 'cancel'
          }
        }
      ]
    });

    await actionSheet.present();

    const dismissEvent = await actionSheet.onDidDismiss();

    if (dismissEvent && dismissEvent.data) {
      if (dismissEvent.data.action === 'delete') {
        await showDeleteAlert(alarm)
      } else if (dismissEvent.data.action === 'edit') {
        ionRouter.navigate(`/pages/alarms/${alarm.id}`, 'forward', 'push');
      }
    }
  }

  const showDeleteAlert = async (alarm: Alarm) => {
    const alert = await alertController.create({
      header: `Delete ${ alarm.title }?`,
      message: `You won't be receiving this alarm anymore`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            alarmStore.deleteAlarm(alarm.id);
          }
        }
      ]
    });

    await alert.present();
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

  const isMenuOpen = ref<boolean>(false);
  const popoverEvent = ref<Event|null>();

  const openMenu = (e: Event) => {
    isMenuOpen.value = true;
    popoverEvent.value = e;
  }

  const closeMenu = () => {
    isMenuOpen.value = false;
  }

  const handleSyncAlarms = async () => {
    isMenuOpen.value = false;
    await alarmStore.syncAlarms()
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

        <ion-icon v-if="!alarmStore.isSyncing && !alarmStore.isOutdated" aria-label="Alarms updated" :icon="cloudDoneOutline" class="mr-2" />

        <ion-icon v-if="!alarmStore.isSyncing && alarmStore.isOutdated" aria-label="Alarms updated" :icon="cloudOfflineOutline" class="mr-2" />

        <ion-spinner v-if="alarmStore.isSyncing" class="size-4"></ion-spinner>



        <ion-button fill="outline" @click="openMenu">
          <ion-icon slot="icon-only" aria-label="Save" :icon="ellipsisHorizontal"></ion-icon>
        </ion-button>

        <ion-popover
            :is-open="isMenuOpen"
            :event="popoverEvent"
            class="alarm-options"
            @didDismiss="closeMenu"
        >
          <ion-content>
            <ion-list class="ion-no-padding">
              <ion-item button router-link="/pages/alarms/create" router-direction="forward" @click="closeMenu">
                <ion-icon aria-hidden="true" :icon="addSharp" slot="start"></ion-icon>
                <ion-label>New alarm</ion-label>
              </ion-item>
              <ion-item button @click="handleSyncAlarms">
                <ion-icon aria-hidden="true" :icon="syncOutline" slot="start"></ion-icon>
                <ion-label>Sync alarms</ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-popover>
      </div>

    </div>

    <AlertMessage v-if="notificationStore.permissionStatus !== 'granted' && Capacitor.isNativePlatform()" type="danger" class="mt-4">
      We need permissions to send you notifications/reminders.

      <ion-button slot="end" size="small" color="secondary" @click="notificationStore.requestPermissions()">
        Fix
      </ion-button>
    </AlertMessage>

    <AlertMessage v-else-if="notificationStore.exactAlarmStatus !== 'granted' && isAndroid" type="warning" class="mt-4">
      Alarms may not be sent on time due to Android 12's alarm permission policies.

      <ion-button slot="end" size="small" color="secondary" @click="notificationStore.openExactAlarmSettings()">
        Fix
      </ion-button>
    </AlertMessage>

    <div class="flex flex-col gap-3 mt-4">
      <div v-for="alarm in alarmStore.alarms"
           :key="alarm.id"
           class="flex items-center justify-between w-full ion-activatable ripple-parent overflow-hidden rounded-2xl"
           @click="showAlarmOptions(alarm)"
      >
        <ion-ripple-effect></ion-ripple-effect>
        <div class="bg-neutral-100 p-6 rounded-2xl text-primary font-bold flex items-center w-full justify-between border-2 shadow-md">
          <div>
            <h2 class="text-2xl text-primary font-bold">
              {{ formatTo12Hour(alarm.time.hour, alarm.time.minute) }}
            </h2>
            <p>{{ alarm.title }}</p>
          </div>
          <ion-toggle :checked="alarm.isScheduled" @ionChange="toggleAlarm($event, alarm)" @click.stop></ion-toggle>
        </div>
      </div>

      <AlertMessage v-if="alarmStore.alarms.length === 0" type="info">
        You have no alarms yet.
      </AlertMessage>
    </div>
  </div>
</template>

<style scoped lang="scss">
ion-popover.alarm-options {
  --min-width: 220px;
  ion-content {
    --ion-background-color: white;
  }
}
</style>