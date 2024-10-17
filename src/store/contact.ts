import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFetchAPI } from "@/composables/useFetchAPI";
import type { EmergencyContact } from "@/types/EmergencyContact";

export const useContactStore = defineStore('contacts', () => {
  const contacts = ref<EmergencyContact[]>([]);

  const _contacts = computed(() => contacts.value);

  const getContacts = async () => {
    const response = await useFetchAPI({
      url: '/contacts',
      method: 'GET'
    });

    contacts.value = response.data.contacts;

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

    return response;
  }

  return { _contacts, getContacts, createContact, editContact, deleteContact }
})