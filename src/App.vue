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
    window.addEventListener('beforeunload', (event) => {
        if (userStore.userData?.uid) {
            const syncData = {
                userId: userStore.userData.uid,
                habits: habitsStore.habits,
                timestamp: new Date().toISOString()
            };
            
            // Enviar datos incluso si el navegador cierra la pestaña
            navigator.sendBeacon(
                `https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents:commit`,
                JSON.stringify({
                    writes: habitsStore.habits.map(habit => ({
                        update: {
                            name: `projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/habits/${habit.id}`,
                            fields: {
                                userId: { stringValue: userStore.userData.uid },
                                name: { stringValue: habit.name },
                                // ... otros campos
                            }
                        }
                    }))
                })
            );
        }
    });
});

</script>