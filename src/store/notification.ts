import { ref } from "vue";
import { defineStore } from "pinia";
import { PermissionState } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export const useNotificationStore = defineStore('notification', () => {
  const permissionStatus = ref<PermissionState>();
  const exactAlarmStatus = ref<PermissionState>();

  const checkPermissions = async () => {
    permissionStatus.value = (await LocalNotifications.checkPermissions()).display;
  }

  const checkExactAlarmPermission = async () => {
    exactAlarmStatus.value = (await LocalNotifications.checkExactNotificationSetting()).exact_alarm
  }

  const requestPermissions = async () => {
    permissionStatus.value = (await LocalNotifications.requestPermissions()).display
  }

  const openExactAlarmSettings = async () => {
    permissionStatus.value = (await LocalNotifications.changeExactNotificationSetting()).exact_alarm
  }

  return {
    permissionStatus,
    exactAlarmStatus,
    checkPermissions,
    checkExactAlarmPermission,
    requestPermissions,
    openExactAlarmSettings
  }
})