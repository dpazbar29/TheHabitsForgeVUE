<script setup>
import { useHabitsStore } from '../stores/habits';
import { useUserStore } from '../stores/user';
import { onMounted, onUnmounted } from 'vue';

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
        <div v-for="habit in habitsStore.habits" :key="habit.id" 
            class="bg-white p-4 rounded-lg shadow-md">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="text-lg font-semibold text-blue-800">{{ habit.name }}</h4>
                    <p class="text-gray-600">
                        Tipo: {{ habit.type === 'binary' ? 'Sí/No' : 'Cuantitativo' }}
                        <span v-if="habit.type === 'quantitative'">(Meta: {{ habit.targetValue }})</span>
                    </p>
                    <p class="text-sm text-gray-500">
                        Frecuencia: {{ 
                            habit.frequency.type === 'daily' ? 'Diario' : 
                            habit.frequency.type === 'weekly' ? 'Semanal' : 
                            habit.frequency.days.join(', ') 
                        }}
                    </p>
                </div>
                <button 
                    @click="habitsStore.deleteHabit(habit.id)"
                    class="text-red-500 hover:text-red-700"
                >
                    Eliminar
                </button>
            </div>
            <div class="mt-2 flex items-center gap-2">
                <span class="text-sm font-medium">Racha actual:</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {{ habit.currentStreak }} días 🔥
                </span>
            </div>
        </div>

        <div v-if="habitsStore.habits.length === 0" class="text-center text-gray-500 py-8">
            No tienes hábitos registrados. ¡Crea tu primer hábito!
        </div>
    </div>
</template>
