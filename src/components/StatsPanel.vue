<script setup>
import { computed } from 'vue';
import { useHabitsStore } from '../stores/habits';

const habitsStore = useHabitsStore();

const stats = computed(() => {
    const completed = habitsStore.habits.reduce((acc, habit) => 
        acc + habit.history.filter(h => h.status === 'completed').length, 0);

    const total = habitsStore.habits.reduce((acc, habit) => 
        acc + habit.history.length, 0);

    return {
        totalHabits: habitsStore.habits.length,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        currentStreaks: habitsStore.habits.map(h => h.currentStreak)
    };
});
</script>

<template>
    <div class="bg-white dark:bg-gray-900 p-6 rounded-lg shadow transition-colors">
        <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">Estadísticas</h2>
    
        <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalHabits }}</p>
                <p class="text-gray-600 dark:text-gray-400">Hábitos totales</p>
            </div>

            <div class="text-center">
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.completionRate }}%</p>
                <p class="text-gray-600 dark:text-gray-400">Tasa de éxito</p>
            </div>

            <div class="text-center">
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ Math.max(...stats.currentStreaks) }}</p>
                <p class="text-gray-600 dark:text-gray-400">Mejor racha actual</p>
            </div>
        </div>
    </div>
</template>

