import { toastController, ToastOptions } from "@ionic/vue";

export const useToastController = () => {
  const presentToast = async (options: ToastOptions) => {
    const toast = await toastController.create(options)

    await toast.present();
  }

  return { presentToast }
}