import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Channel, LocalNotifications } from "@capacitor/local-notifications";
import { isPlatform } from "@ionic/vue";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

import type { Alarm, AlarmProp } from "@/types/Alarm";

export const useAlarmStore = defineStore('alarms', () => {
  const alarms = ref<Alarm[]>([]);
  const ALARM_STORAGE_KEY = 'alarms';

  const isAndroid = computed(() => {
    return Capacitor.isNativePlatform() && isPlatform('android');
  })

  const loadAlarms = async () => {
    const { value } = await Preferences.get({ key: ALARM_STORAGE_KEY });
    alarms.value = value ? JSON.parse(value) : []
  }

  const saveAlarms = async () => {
    await Preferences.set({
      key: ALARM_STORAGE_KEY,
      value: JSON.stringify(alarms.value)
    })
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
      channelId: isAndroid.value ? 'alarms' : null,
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
      await saveAlarms();
    }
  }

  const deleteAlarm = async (alarmId: number) => {
    await cancelAlarm(alarmId);
    alarms.value = alarms.value.filter(a => a.id !== alarmId);

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

  return { alarms, init, getAlarm, addAlarm, scheduleAlarm, editAlarm, cancelAlarm, deleteAlarm }
})