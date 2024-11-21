import { ref } from "vue";
import { defineStore } from "pinia";
import { isPlatform } from "@ionic/vue";
import { Haptics } from "@capacitor/haptics";
import { NativeAudio } from "@capacitor-community/native-audio";
import { useAuthStore } from "@/store/auth";
import { useToastController } from "@/composables/useToastController";
import { useFetchAPI } from "@/composables/useFetchAPI";
import { checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons";
import FetchError from "@/utils/errors/FetchError";
import {Preferences} from "@capacitor/preferences";

export const useEmergencyStore = defineStore('emergency', () => {
  const authStore = useAuthStore();
  const toastController = useToastController();

  const ringtone = ref('siren-alert');
  const isAlertActivated = ref<boolean>(false);

  const getSelectedRingtone = async () => {
    const { value } = await Preferences.get({ key: 'emergency_ringtone' });

    ringtone.value = value ? value : 'siren-alert';
  }

  const updateSelectedRingtone = async (ringtoneName: string) => {
    await Preferences.set({
      key: 'emergency_ringtone',
      value: ringtoneName
    });

    ringtone.value = ringtoneName;
  }

  const activateAlert = async () => {
    isAlertActivated.value = true;

    // Attempt to play alert sound
    const audio = await NativeAudio.isPlaying({ assetId: ringtone.value });

    if (!audio.isPlaying) {
      // Must call play() before loop()
      NativeAudio.play({
        assetId: ringtone.value,
        time: 0
      })

      NativeAudio.loop({
        assetId: ringtone.value
      });

      await NativeAudio.setVolume({
        assetId: ringtone.value,
        volume: 1.0
      })
    }

    if (isPlatform('android')) {
      await Haptics.vibrate({ duration: 10000 })
    }

    // Send emergency tex
    await sendEmergencyText()
  }

  const deactivateAlert = async () => {
    isAlertActivated.value = false;

    // Attempt to stop emergency alert
    const audio = await NativeAudio.isPlaying({ assetId: ringtone.value });

    if (audio.isPlaying) {
      NativeAudio.pause({
        assetId: ringtone.value
      })
    }
  }

  const sendEmergencyText = async () => {
    if (!authStore._isLoggedIn) return;

    try {
      await useFetchAPI({
        url: '/contacts/send',
        method: 'POST',
      });

      await toastController.presentToast({
        message: 'Your emergency contacts have been notified',
        duration: 3000,
        icon: checkmarkCircleOutline,
        position: "bottom",
        positionAnchor: 'scan-food-button'
      });
    } catch (error) {
      if (error instanceof FetchError) {
        switch (error.statusCode) {
          case 429:
            await toastController.presentToast({
              message: 'You may only send notifications to your contacts after 1 minute',
              duration: 3000,
              icon: closeCircleOutline,
              position: "bottom",
              positionAnchor: 'scan-food-button'
            });
            break;
          default:
            await toastController.presentToast({
              message: error.message,
              duration: 3000,
              icon: closeCircleOutline,
              position: "bottom",
              positionAnchor: 'scan-food-button'
            });
        }
      } else {
        await toastController.presentToast({
          message: 'Something went wrong while trying to notify your contacts',
          duration: 3000,
          icon: closeCircleOutline,
          position: "bottom",
          positionAnchor: 'scan-food-button'
        });
      }
    }
  }

  return { ringtone, isAlertActivated, getSelectedRingtone, updateSelectedRingtone, activateAlert, deactivateAlert }
});