<script setup>
import { ref } from 'vue';
import { useHabitsStore } from '../stores/habits';
import EditHabitForm from './EditHabitForm.vue';

const props = defineProps({
    habit: {
        type: Object,
        required: true
    }
});

const habitsStore = useHabitsStore();
const currentValue = ref('');
const showEditModal = ref(false);

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
    <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-4 transition-colors">
        <div class="flex justify-between items-center">
            <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ habit.name }}</h3>
                <div class="flex items-center gap-2 mt-2">
                    <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        🔥 {{ habit.currentStreak }} días
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        Récord: {{ habit.longestStreak }} días
                    </span>
                </div>
            </div>
            
            <div class="flex items-center gap-4">
                <div v-if="habit.type === 'quantitative'" class="flex items-center gap-2">
                    <input
                        v-model.number="currentValue"
                        type="number"
                        :min="1"
                        :max="habit.targetValue"
                        class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors"
                        placeholder="Ej: 5"
                    >
                    <span class="text-gray-700 dark:text-gray-200">/ {{ habit.targetValue }}</span>
                    <button 
                        @click="markCompleted"
                        class="px-3 py-1 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                    >
                        ✔
                    </button>
                </div>
                
                <button 
                    v-else
                    @click="markCompleted"
                    class="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                >
                    {{ habit.history.some(h => h.date === new Date().toISOString().split('T')[0]) ? '✅' : 'Marcar' }}
                </button>

                <!-- Botones de edición y eliminación -->
                <div class="flex items-center gap-2">
                    <button 
                        @click="showEditModal = true"
                        class="p-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        title="Editar hábito"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                    </button>

                    <button 
                        @click="deleteHabit"
                        class="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        title="Eliminar hábito"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal de edición -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6 relative transition-colors">
                <button 
                    @click="showEditModal = false"
                    class="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                    ✕
                </button>
                <EditHabitForm 
                    :habit="habit"
                    @close="showEditModal = false"
                />
            </div>
        </div>
    </div>
</template>
