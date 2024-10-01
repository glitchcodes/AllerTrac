import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { ConnectionStatus, ConnectionType } from "@capacitor/network";

export const useNetworkStore = defineStore('network', () => {
  const isConnected = ref<boolean>(false);
  const connectionType = ref<ConnectionType>();

  const _isConnected = computed(() => isConnected.value);
  const _connectionType = computed(() => connectionType.value);

  const updateNetworkStatus = async (status: ConnectionStatus) => {
    isConnected.value = status.connected;
    connectionType.value = status.connectionType;
  }

  return { _isConnected, _connectionType, updateNetworkStatus }
})