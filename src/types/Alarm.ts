import { Weekday } from "@capacitor/local-notifications";

export type AlarmProp = {
  title: string
  message: string
  time: {
    hour: number
    minute: number
  }
  repeatWeekly: boolean
  weekdays: Weekday[]
  sound: string
}

export type Alarm = AlarmProp & {
  id: number
  isScheduled: boolean
  notificationIds: number[]
}