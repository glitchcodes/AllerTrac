<script setup lang="ts">
  import {
    IonRippleEffect,
    actionSheetController,
    modalController, isPlatform
  } from "@ionic/vue";
  import { Clipboard } from "@capacitor/clipboard";
  import {
    arrowBackOutline,
    checkmarkCircleOutline,
    copyOutline,
    createOutline,
    trashOutline
  } from "ionicons/icons";

  import { useNetworkStore } from "@/store/network";
  import { useToastController } from "@/composables/useToastController";
  import { useAlertController } from "@/composables/useAlertController";

  import EditContactModal from "@/components/modal/EditContactModal.vue";
  import type { EmergencyContact } from "@/types/EmergencyContact";

  const networkStore = useNetworkStore();
  const { presentAlert } = useAlertController();
  const { presentToast } = useToastController();

  const emit = defineEmits<{
    (e: 'delete', id: number): void
  }>()

  const props = withDefaults(defineProps<{
    contact: EmergencyContact,
    canEdit?: boolean
  }>(), {
    canEdit: true
  });

  const openActionSheet = async () => {
    if (!props.canEdit) return;

    const actionSheet = await actionSheetController.create({
      header: "Actions",
      buttons: [
        {
          text: 'Delete',
          icon: !isPlatform('ios') ? trashOutline : undefined,
          role: 'destructive',
          data: {
            action: 'delete'
          }
        },
        {
          text: 'Edit',
          icon: !isPlatform('ios') ? createOutline : undefined,
          data: {
            action: 'edit'
          }
        },
        {
          text: 'Copy phone number',
          icon: !isPlatform('ios') ? copyOutline : undefined,
          data: {
            action: 'copy-phone-number'
          }
        },
        {
          text: 'Copy email address',
          icon: !isPlatform('ios') ? copyOutline : undefined,
          data: {
            action: 'copy-email-address'
          }
        },
        {
          text: 'Cancel',
          icon: !isPlatform('ios') ? arrowBackOutline : undefined,
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();

    const dismissEvent = await actionSheet.onWillDismiss();

    if (dismissEvent.data === undefined) return;

    // Open edit modal
    switch (dismissEvent.data.action) {
      case 'delete':
        if (!networkStore._isConnected) {
          await presentAlert({
            header: "Internet connection required",
            message: "You must be connected to the internet to perform this action",
            buttons: [
              {
                text: "Ok",
                role: "cancel"
              },
            ]
          });

          return;
        }

        // Show alert modal
        await presentAlert({
          header: "Delete contact?",
          message: "Are you sure you want to delete this contact?",
          buttons: [
            {
              text: "No",
              role: "cancel",
            },
            {
              text: "Yes",
              role: "confirm",
              handler: () => {
                // Handle deletion on parent component
                emit('delete', props.contact.id!);
              }
            }
          ]
        });
        break;
      case 'edit':
        await openEditModal();
        break;
      case 'copy-phone-number':
        // Write to clipboard
        await Clipboard.write({
          string: props.contact.phone_number
        });

        // Show toast message
        await presentToast({
          message: 'Phone number copied to clipboard',
          position: 'bottom',
          positionAnchor: 'scan-food-button',
          duration: 3000,
          icon: checkmarkCircleOutline
        });
        break;
      case 'copy-email-address':
        // Write to clipboard
        await Clipboard.write({
          string: props.contact.email
        });

        // Show toast message
        await presentToast({
          message: 'Email address copied to clipboard',
          position: 'bottom',
          positionAnchor: 'scan-food-button',
          duration: 3000,
          icon: checkmarkCircleOutline
        });
        break;
    }
  }

  const openEditModal = async () => {
    const modal = await modalController.create({
      component: EditContactModal,
      componentProps: {
        user: JSON.parse(JSON.stringify(props.contact))
      }
    });

    await modal.present();
  }

</script>

<template>
  <div class="bg-neutral-100 rounded-xl px-6 py-4 border-2 shadow w-full ion-activatable ripple-parent" @click="openActionSheet">
    <ion-ripple-effect v-if="canEdit"></ion-ripple-effect>
    <h2 class="text-2xl text-primary font-bold mb-2">
      {{ props.contact.full_name || "John Doe" }}
    </h2>
    <ul class="text-primary text-sm">
      <li class="text-[12px]">
        Relationship: <span class="capitalize">{{ props.contact.relationship || "Parent" }}</span>
      </li>
      <li class="text-[12px]">Phone Number: {{ props.contact.phone_number || "09XX XXX XXXX" }}</li>
      <li class="text-[12px]">Email Address: {{ props.contact.email || "N/A" }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">

</style>