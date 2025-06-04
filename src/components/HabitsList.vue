<script setup>
import { useHabitsStore } from '../stores/habits';
import { useUserStore } from '../stores/user';
import { onMounted, computed } from 'vue';
import HabitItem from './HabitItem.vue';

const habitsStore = useHabitsStore();
const userStore = useUserStore();

const props = defineProps({
    filter: {
        type: String,
        default: 'today'
    }
});

onMounted(async () => {
    if (userStore.userData?.uid) {
        await habitsStore.retryFailedSyncs();
        await habitsStore.syncWithFirestore(userStore.userData.uid);
    }
});

const filteredHabits = computed(() => {
    if (props.filter === 'today') {
        // Ejemplo: hábitos activos y programados para hoy
        return habitsStore.habits.filter(habit =>
            !habit.archived &&
            habit.scheduledDays?.includes(new Date().getDay())
        );
    }
    if (props.filter === 'all') {
        return habitsStore.habits.filter(habit => !habit.archived);
    }
    if (props.filter === 'archived') {
        return habitsStore.habits.filter(habit => habit.archived);
    }
    return habitsStore.habits;
});
</script>

<template>
    <div class="space-y-4">
        <HabitItem 
            v-for="habit in filteredHabits" 
            :key="habit.id" 
            :habit="habit" 
            :class="'bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md transition-colors'"
        />

        <div v-if="filteredHabits.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8 transition-colors">
            No tienes hábitos registrados para esta sección.
        </div>
    </div>
</template>
