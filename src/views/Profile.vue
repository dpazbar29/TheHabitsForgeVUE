<script setup>
import { ref } from 'vue';
import CreateHabitForm from '../components/CreateHabitForm.vue';
import HabitList from '../components/HabitsList.vue';
import StatsPanel from '../components/StatsPanel.vue';

const showModal = ref(false);
</script>

<template>
    <div class="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
        <h1 class="text-3xl font-bold text-blue-800 dark:text-blue-300 mb-8 transition-colors">Mi Perfil</h1>
    
        <StatsPanel class="mb-8" />
    
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors">Hábitos de hoy</h2>
            <button 
                @click="showModal = true"
                class="bg-blue-700 dark:bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors"
            >
                + Nuevo Hábito
            </button>
        </div>

        <HabitList />

        <!-- Modal para crear hábitos -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md relative transition-colors">
                <button 
                    @click="showModal = false"
                    class="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                    ✕
                </button>
                <CreateHabitForm @habit-created="showModal = false" />
            </div>
        </div>
    </div>
</template>

<style>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>

