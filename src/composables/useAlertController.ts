import {alertController, AlertOptions} from "@ionic/vue";

export const useAlertController = () => {
  const presentAlert = async (options: AlertOptions) => {
    const alert = await alertController.create(options)

    await alert.present();
  }

  return { presentAlert }
}