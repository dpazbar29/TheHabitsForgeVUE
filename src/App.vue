<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'; 
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'

import { useHabitsStore } from './stores/habits';
import { useUserStore } from './stores/user';

const habitsStore = useHabitsStore();
const userStore = useUserStore();

onMounted(() => {
    let isReload = false;

    // Detectar si es recarga
    window.addEventListener('beforeunload', () => {
        isReload = performance.navigation.type === 1;
    });

    // Sincronizar solo en cierre real
    window.addEventListener('pagehide', async () => {
        if (!isReload && userStore.userData?.uid && habitsStore.pendingSync) {
            await habitsStore.syncWithFirestore(userStore.userData.uid);
        }
    });
});

</script>