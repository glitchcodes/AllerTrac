<script setup lang="ts">
  import { loadingController } from "@ionic/vue";
  import { alertCircle } from "ionicons/icons";

  import { useToastController } from "@/composables/useToastController";
  import { useContactStore } from "@/store/contact";
  import InfoAlert from "@/components/alert/InfoAlert.vue";
  import { default as EmergencyContactComponent } from "@/components/EmergencyContact.vue";
  import FetchError from "@/utils/errors/FetchError";

  const { presentToast } = useToastController();
  const contactStore = useContactStore();

  // Fetch contacts from the database
  await contactStore.getContacts();

  const handleDeleteContact = async (e: number) => {
    // Show loading modal
    const isDeleting = await loadingController.create({
      message: 'Deleting...'
    });

    await isDeleting.present();

    try {
      await contactStore.deleteContact(e);
    } catch (error) {
      if (error instanceof FetchError) {
        await presentToast({
          message: 'Error: ' + error.data.message,
          duration: 5000,
          icon: alertCircle
        });
      }
      console.error(error)
    }

    // Dismiss loading modal
    await isDeleting.dismiss();
  }
</script>

<template>
  <div v-if="contactStore._contacts.length > 0" class="flex flex-col gap-4">
    <template v-for="contact in contactStore._contacts" :key="contact.id">
      <EmergencyContactComponent :contact="contact" @delete="handleDeleteContact" />
    </template>
  </div>
  <div v-else>
    <InfoAlert>
      No emergency contacts found
    </InfoAlert>
  </div>
</template>

<style scoped lang="scss">

</style>