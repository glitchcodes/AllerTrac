import { ref } from "vue";
import { defineStore } from "pinia";
import { isPlatform } from "@ionic/vue";
import { Haptics } from "@capacitor/haptics";
import { NativeAudio } from "@capacitor-community/native-audio";

export const useEmergencyStore = defineStore('emergency', () => {
  const isAlertActivated = ref<boolean>(false);

  const activateAlert = async () => {
    isAlertActivated.value = true;

    // Attempt to play alert sound
    const audio = await NativeAudio.isPlaying({ assetId: 'emergency-alert' });

    if (!audio.isPlaying) {
      // Must call play() before loop()
      NativeAudio.play({
        assetId: 'emergency-alert',
        time: 0
      })

      NativeAudio.loop({
        assetId: 'emergency-alert'
      });

      NativeAudio.setVolume({
        assetId: 'emergency-alert',
        volume: 1.0
      })
    }

    if (isPlatform('hybrid')) {
      await Haptics.vibrate({ duration: 10000 })
    }
  }

  const deactivateAlert = async () => {
    isAlertActivated.value = false;

    // Attempt to stop emergency alert
    const audio = await NativeAudio.isPlaying({ assetId: 'emergency-alert' });

    if (audio.isPlaying) {
      await NativeAudio.stop({
        assetId: 'emergency-alert'
      })
    }
  }

  return { isAlertActivated, activateAlert, deactivateAlert }
});