<script setup>
import { useHabitsStore } from '../stores/habits';
import { useUserStore } from '../stores/user';
import { onMounted, onUnmounted } from 'vue';
import HabitItem from './HabitItem.vue';

const habitsStore = useHabitsStore();
const userStore = useUserStore();
let unsubscribe;

onMounted(() => {
    unsubscribe = habitsStore.subscribeToUserHabits(userStore.userData.uid);
});

onUnmounted(() => {
    if (unsubscribe) unsubscribe();
});
</script>

<template>
    <div class="space-y-4">
        <HabitItem 
            v-for="habit in habitsStore.habits" 
            :key="habit.id" 
            :habit="habit" 
            class="bg-white p-4 rounded-lg shadow-md"
        />

        <div v-if="habitsStore.habits.length === 0" class="text-center text-gray-500 py-8">
            No tienes hábitos registrados. ¡Crea tu primer hábito!
        </div>
    </div>
</template>
