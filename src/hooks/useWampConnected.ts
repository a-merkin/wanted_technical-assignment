// src/hooks/useWampConnected.ts
import { watch } from 'vue';
import { useWampStore } from '../store/wampStore';

export const useWampConnected = (callback: () => void) => {
  const wampStore = useWampStore();

  watch(
    () => wampStore.isWsConnected,
    (newVal) => {
      if (newVal) {
        callback();
      }
    },
    { immediate: true }
  );
};
