import { popoverController } from "@ionic/vue";
import { useAuthStore } from "@/store/auth";
import UserMenuPopover from "@/components/UserMenuPopover.vue";

export const useMenuNav = () => {
  const authStore = useAuthStore();

  const openUserMenu = async (ev: Event) => {
    const popover = await popoverController.create({
      component: UserMenuPopover,
      componentProps: {
        user: authStore._user
      },
      event: ev
    })

    popover.style.cssText = '--min-width: 270px; --offset-y: 10px;';

    await popover.present()
  }

  return { openUserMenu }
}