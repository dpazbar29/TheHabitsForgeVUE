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
    const today = new Date();
    const todayDay = today.getDay(); // 0 (Domingo) a 6 (Sábado)
    const todayDate = today.toISOString().split('T')[0];

    return habitsStore.habits.filter(habit => {
        // Filtro archivados
        if (props.filter === 'archived') return habit.archived;
        if (habit.archived) return false;

        // Filtro principal
        switch(props.filter) {
            case 'today':
                // Verifica si está programado para hoy (o todos los días si no tiene programación)
                const isScheduled = habit.scheduledDays?.length > 0 
                    ? habit.scheduledDays.includes(todayDay)
                    : true; // Hábitos antiguos sin scheduledDays se muestran siempre
                
                // Verifica si no tiene registro hoy
                const notMarkedToday = !habit.history.some(entry => entry.date === todayDate);
                
                return isScheduled && notMarkedToday;

            case 'all':
                return true; // Todos no archivados

            default:
                return true;
        }
    });
});
</script>

<template>
    <div class="space-y-4">
        <HabitItem 
            v-for="habit in filteredHabits" 
            :key="habit.id" 
            :habit="habit"
            :show-actions="filter === 'today'"
            :class="'bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md transition-colors'"
        />

        <div v-if="filteredHabits.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8 transition-colors">
            <template v-if="filter === 'today'">
                🎉 ¡No tienes hábitos pendientes para hoy!
            </template>
            <template v-else-if="filter === 'archived'">
                📁 No hay hábitos archivados
            </template>
            <template v-else>
                🚀 ¡Crea tu primer hábito para comenzar!
            </template>
        </div>
    </div>
</template>
