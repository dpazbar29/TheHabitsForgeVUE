<script setup>
import { useHabitsStore } from '../stores/habits';
import { useUserStore } from '../stores/user';
import { onMounted, onUnmounted } from 'vue';
import HabitItem from './HabitItem.vue';

const habitsStore = useHabitsStore();
const userStore = useUserStore();
let unsubscribe;

onMounted(async () => {
    if (userStore.userData?.uid) {
        await habitsStore.retryFailedSyncs();
        await habitsStore.syncWithFirestore(userStore.userData.uid);
    }
});

</script>

<template>
    <div class="space-y-4">
        <HabitItem 
            v-for="habit in habitsStore.habits" 
            :key="habit.id" 
            :habit="habit" 
            :class="'bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md transition-colors'"
        />

        <div v-if="habitsStore.habits.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8 transition-colors">
            No tienes hábitos registrados. ¡Crea tu primer hábito!
        </div>
    </div>
</template>
