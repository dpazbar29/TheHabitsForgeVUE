<script setup>
import { ref } from 'vue';
import { useHabitsStore } from '../stores/habits';

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
});

const habitsStore = useHabitsStore();
const currentValue = ref('');

const markCompleted = async () => {
    const value = props.habit.type === 'quantitative' 
        ? Number(currentValue.value) 
        : 1;

    await habitsStore.markHabit(props.habit.id, value);
    currentValue.value = '';
};

const deleteHabit = async () => {
    if(confirm('¿Estás seguro de querer eliminar este hábito?')) {
        try {
            await habitsStore.deleteHabit(props.habit.id);
        } catch (error) {
            alert(error.message);
        }
    }
};
</script>

<template>
    <div class="bg-white p-4 rounded-lg shadow mb-4">
        <div class="flex justify-between items-center">
            <div>
                <h3 class="text-lg font-semibold">{{ habit.name }}</h3>
                <div class="flex items-center gap-2 mt-2">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        🔥 {{ habit.currentStreak }} días
                    </span>
                    <span class="text-sm text-gray-500">
                        Récord: {{ habit.longestStreak }} días
                    </span>
                </div>
            </div>
            
            <div class="flex items-center gap-4">
                <!-- Botones de acción -->
                <div v-if="habit.type === 'quantitative'" class="flex items-center gap-2">
                    <input
                        v-model.number="currentValue"
                        type="number"
                        :min="1"
                        :max="habit.targetValue"
                        class="w-20 px-2 py-1 border rounded"
                        placeholder="Ej: 5"
                    >
                    <span>/ {{ habit.targetValue }}</span>
                    <button 
                        @click="markCompleted"
                        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        ✔
                    </button>
                </div>
                
                <button 
                    v-else
                    @click="markCompleted"
                    class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    {{ habit.history.some(h => h.date === new Date().toISOString().split('T')[0]) ? '✅' : 'Marcar' }}
                </button>

                <!-- Botón de eliminar -->
                <button 
                    @click="deleteHabit"
                    class="px-3 py-2 text-red-500 hover:text-red-700"
                    title="Eliminar hábito"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
