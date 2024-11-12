import { defineStore } from "pinia";
import { ref } from "vue";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Preferences } from "@capacitor/preferences";

import type { Alarm, AlarmProp } from "@/types/Alarm";

export const useAlarmStore = defineStore('alarms', () => {
  const alarms = ref<Alarm[]>([]);
  const ALARM_STORAGE_KEY = 'alarms';

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

  const addAlarm = async (alarm: AlarmProp) => {
    const newAlarm: Alarm = {
      id: Date.now(),
      title: alarm.title,
      message: alarm.message,
      time: alarm.time,
      repeatWeekly: alarm.weekdays.length > 0,
      weekdays: alarm.weekdays,
      isScheduled: false,
      notificationIds: []
    }

    alarms.value.push(newAlarm);

    console.log(newAlarm);

    // Persist alarms to preferences
    await saveAlarms();

    return newAlarm;
  }

  const scheduleAlarm = async (alarm: Alarm) => {
    const baseNotification = {
      title: alarm.title,
      body: alarm.message,
      // sound: 'beep.wav',
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

  return { alarms, init, addAlarm, scheduleAlarm, cancelAlarm, deleteAlarm }
})