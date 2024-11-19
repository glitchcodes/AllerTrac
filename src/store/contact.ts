import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFetchAPI } from "@/composables/useFetchAPI";
import { useNetworkStore } from "@/store/network";
import { Preferences } from "@capacitor/preferences";
import type { EmergencyContact } from "@/types/EmergencyContact";

export const useContactStore = defineStore('contacts', () => {
  const networkStore = useNetworkStore();

  const contacts = ref<EmergencyContact[]>([]);

  const _contacts = computed(() => contacts.value);

  const getContacts = async () => {
    if (!networkStore._isConnected && contacts.value.length === 0) {
      const { value } = await Preferences.get({ key: 'contacts' })

      contacts.value = value ? JSON.parse(value) : [];

      return;
    }

    if (networkStore._isConnected) {
      const response = await useFetchAPI({
        url: '/contacts',
        method: 'GET'
      });

      contacts.value = response.data.contacts;

      // Update local data
      await Preferences.set({
        key: 'contacts',
        value: JSON.stringify(contacts.value)
      })
    }

    return contacts;
  }

  const createContact = async (data: EmergencyContact) => {
    const response = await useFetchAPI({
      url: '/contacts',
      method: 'POST',
      data: JSON.stringify(data)
    });

    const contact = response.data.contact;
    contacts.value.push(contact);

    // Update local data
    await Preferences.set({
      key: 'contacts',
      value: JSON.stringify(contacts.value)
    })

    return contact;
  }

  const editContact = async (id: number, data: EmergencyContact) => {
    const response = await useFetchAPI({
      url: `/contacts/${id}`,
      method: 'PATCH',
      data: JSON.stringify(data)
    })

    const contact = response.data.contact;

    // Update contact in array
    const index = contacts.value.findIndex((item) => contact.id === item.id);
    contacts.value[index] = contact;

    await Preferences.set({
      key: 'contacts',
      value: JSON.stringify(contacts.value)
    })

    return contact;
  }

  const deleteContact = async (id: number) => {
    const response = await useFetchAPI({
      url: `/contacts/${id}`,
      method: 'DELETE'
    });

    // Remove contact from array
    const index = contacts.value.findIndex((item) => id === item.id);
    contacts.value.splice(index, 1);

    await Preferences.set({
      key: 'contacts',
      value: JSON.stringify(contacts.value)
    })

    return response;
  }

  const reset = async () => {
    await Preferences.remove({ key: 'contacts' })
  }

  return { _contacts, getContacts, createContact, editContact, deleteContact, reset }
})