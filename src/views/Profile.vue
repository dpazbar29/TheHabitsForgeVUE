<script setup>
import { ref } from 'vue';
import CreateHabitForm from '../components/CreateHabitForm.vue';
import HabitList from '../components/HabitsList.vue';

const showModal = ref(false);

const handleHabitCreated = () => {
    showModal.value = false;
};
</script>

<template>
    <div class="max-w-3xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-blue-800 mb-8">Mi Perfil</h1>

        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-semibold text-gray-700">Mis Hábitos</h2>
            <button 
                @click="showModal = true"
                class="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
                + Nuevo Hábito
            </button>
        </div>

        <HabitList />

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg w-full max-w-md relative">
                    <button 
                        @click="showModal = false"
                        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
        
                    <CreateHabitForm @habit-created="handleHabitCreated" />
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
