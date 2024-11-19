import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Channel, LocalNotifications } from "@capacitor/local-notifications";
import { isPlatform } from "@ionic/vue";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useFetchAPI } from "@/composables/useFetchAPI";
import { useToastController } from "@/composables/useToastController";

import type { Alarm, AlarmProp } from "@/types/Alarm";
import {closeCircleOutline} from "ionicons/icons";

export const useAlarmStore = defineStore('alarms', () => {
  const alarms = ref<Alarm[]>([]);
  const alarmVersion = ref<Date>();

  const isOutdated = ref(false);
  const isSyncing = ref(false);

  const ALARM_VERSION_KEY = 'alarm_version';
  const ALARM_STORAGE_KEY = 'alarms';

  const toastController = useToastController();

  const isAndroid = computed(() => {
    return Capacitor.isNativePlatform() && isPlatform('android');
  });

  const checkAlarmVersion = async () => {
    try {
      isSyncing.value = true;

      const response = await useFetchAPI({
        url: '/user/alarms',
        method: 'GET'
      });

      if (response.data && response.data.length === 0) {
        isOutdated.value = true;
      }

      // Check if the cloud version is newer than local copy
      isOutdated.value =  !(alarmVersion.value === undefined || (new Date(response.data.updated_at) >= alarmVersion.value));
    } catch (error) {
      console.log(error)

      isOutdated.value = true;
    } finally {
      isSyncing.value = false;
    }
  }

  const syncAlarms = async () => {
    // Get old alarms
    const { value } = await Preferences.get({ key: ALARM_STORAGE_KEY });
    const oldAlarms = value;

    try {
      isSyncing.value = true;

      const response = await useFetchAPI({
        url: '/user/alarms',
        method: 'GET'
      });

      if (response.status === 200) {
        if (response.data && response.data.length === 0) {
          await saveToCloud();
          return;
        }

        const cloudAlarms = response.data.alarms;

        // Check if the cloud version is newer than local copy
        if (
          alarmVersion.value === undefined || (new Date(response.data.updated_at) >= alarmVersion.value)
        ) {
          alarms.value = JSON.parse(cloudAlarms);
          await saveAlarms();
        } else {
          await saveToCloud();
        }
      }
    } catch (error) {
      await toastController.presentToast({
        message: `We can't sync your alarms. Please try again later`,
        icon: closeCircleOutline,
        duration: 3000,
        position: 'bottom',
        positionAnchor: 'scan-food-button'
      });

      console.error(error);
      alarms.value = oldAlarms ? JSON.parse(JSON.parse(oldAlarms)) : [];
    } finally {
      isSyncing.value = false;
    }
  }

  const saveToCloud = async () => {
    try {
      const response = await useFetchAPI({
        url: '/user/alarms',
        method: 'POST',
        data: JSON.stringify({
          alarms: `${JSON.stringify(alarms.value)}`
        })
      });

      if (response.status === 200) {
        // Set new version
        await Preferences.set({
          key: ALARM_VERSION_KEY,
          value: response.data.updated_at
        });

        isOutdated.value = false;
      }
    } catch (error) {
      throw new Error(`Can't save to cloud`);
    }
  }

  const loadAlarms = async () => {
    // Get alarm version
    const version = await Preferences.get({ key: ALARM_VERSION_KEY });
    alarmVersion.value = version.value ? new Date(version.value) : undefined

    // Get alarms
    const cloud = await Preferences.get({ key: ALARM_STORAGE_KEY });
    alarms.value = cloud.value ? JSON.parse(cloud.value) : []
  }

  const saveAlarms = async () => {
    // Store alarms
    await Preferences.set({
      key: ALARM_STORAGE_KEY,
      value: JSON.stringify(alarms.value)
    });
  }

  const updateVersion = async () => {
    alarmVersion.value = new Date()

    await Preferences.set({
      key: ALARM_VERSION_KEY,
      value: alarmVersion.value.toISOString()
    });

    await checkAlarmVersion();
  }

  const generateNotificationId = () => Math.floor(Date.now() % 1000000);

  const getAlarm = (alarmId: number) => {
    return alarms.value.find(alarm => alarm.id === alarmId) || null;
  };

  const addAlarm = async (alarm: AlarmProp) => {
    const newAlarm: Alarm = {
      id: Date.now(),
      title: alarm.title,
      message: alarm.message,
      time: alarm.time,
      repeatWeekly: alarm.weekdays.length > 0,
      weekdays: alarm.weekdays,
      sound: alarm.sound,
      isScheduled: false,
      notificationIds: []
    }

    alarms.value.push(newAlarm);

    // Store new version
    await updateVersion()

    // Persist alarms to preferences
    await saveAlarms();

    return newAlarm;
  }

  const scheduleAlarm = async (alarm: Alarm) => {
    // Get channels - Only available for Android
    if (isAndroid.value) {
      const { channels } = await LocalNotifications.listChannels();

      if (channels.find(ch => ch.id === 'alarms') === undefined) {
        const alarmChannel: Channel = {
          id: 'alarms',
          name: 'Alarms',
          sound: 'default_notification.wav',
          vibration: true,
          importance: 5,
        }

        await LocalNotifications.createChannel(alarmChannel);
      }
    }

    // Schedule Notifications
    const baseNotification = {
      title: alarm.title,
      body: alarm.message,
      channelId: isAndroid.value ? 'alarms' : undefined,
      sound: alarm.sound,
      extra: { alarmId: alarm.id }
    }

    if (alarm.repeatWeekly && alarm.weekdays.length > 0) {
      // Clear any previous notifications
      alarm.notificationIds = []

      for (const weekday of alarm.weekdays) {
        const notificationId = generateNotificationId();

        await LocalNotifications.schedule({
          notifications: [
            {
              ...baseNotification,
              id: notificationId,
              schedule: {
                on: {
                  weekday,
                  hour: alarm.time.hour,
                  minute: alarm.time.minute
                }
              }
            }
          ]
        });

        alarm.notificationIds.push(notificationId);
      }
    } else {
      const notificationId = generateNotificationId();

      await LocalNotifications.schedule({
        notifications: [
          {
            ...baseNotification,
            id: notificationId,
            schedule: { on: { hour: alarm.time.hour, minute: alarm.time.minute } }
          }
        ]
      });

      alarm.notificationIds.push(notificationId);
    }

    // Update alarm state
    alarm.isScheduled = true;
    await saveAlarms()
  }

  const editAlarm = async (alarmId: number, updatedAlarm: AlarmProp) => {
    const alarm = alarms.value.find(a => a.id === alarmId);

    if (alarm) {
      // Cancel existing notifications if schedulled
      if (alarm.isScheduled) {
        await cancelAlarm(alarmId);
      }

      // Update alarm
      Object.assign(alarm, updatedAlarm);

      // Reschedule the alarm
      await scheduleAlarm(alarm);

      // Store new version
      await updateVersion()

      await saveAlarms()
    }
  }

  const cancelAlarm = async (alarmId: number) => {
    const alarm = alarms.value.find(a => a.id === alarmId);
    if (alarm && alarm.notificationIds.length > 0) {
      // Ensure the notifications array contains objects with id properties
      const notificationsToCancel = alarm.notificationIds.map(id => ({ id }));

      await LocalNotifications.cancel({ notifications: notificationsToCancel });

      alarm.isScheduled = false;
      alarm.notificationIds = []; // Clear notification IDs

      // Store new version
      await updateVersion()

      await saveAlarms();
    }
  }

  const deleteAlarm = async (alarmId: number) => {
    await cancelAlarm(alarmId);
    alarms.value = alarms.value.filter(a => a.id !== alarmId);

    // Store new version
    await updateVersion()

    await saveAlarms();
  }

  // Initialize amd load alarms from storage
  const init = async () => {
    await loadAlarms();

    // Reschedule any alarm on app start
    alarms.value.forEach((alarm) => {
      if (alarm.isScheduled && alarm.repeatWeekly) {
        scheduleAlarm(alarm);
      }
    })
  }

  const reset = async () => {
    alarms.value.forEach((alarm) => {
      deleteAlarm(alarm.id);
    })

    await Preferences.remove({ key: ALARM_STORAGE_KEY })
  }

  return { alarms, alarmVersion, isSyncing, isOutdated, checkAlarmVersion, init, syncAlarms, getAlarm, addAlarm, scheduleAlarm, editAlarm, cancelAlarm, deleteAlarm, reset }
})