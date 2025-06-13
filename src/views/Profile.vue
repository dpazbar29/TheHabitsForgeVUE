<script setup>
import { ref } from 'vue';
import CreateHabitForm from '../components/CreateHabitForm.vue';
import HabitList from '../components/HabitsList.vue';
import StatsPanel from '../components/StatsPanel.vue';
import DeleteAccountModal from '../components/DeleteAccountModal.vue';
import { useUserStore } from '../stores/user'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { computed } from 'vue'

const userStore = useUserStore()

async function toggleDailyEmail(e) {
    const checked = e.target.checked
    if (!userStore.userData) return

    const userRef = doc(db, "users", userStore.userData.uid)
    await updateDoc(userRef, { allowDailyEmail: checked })

    userStore.userData.allowDailyEmail = checked
}
const showModal = ref(false);
const showDeleteModal = ref(false);
const activeTab = ref('today');

const tabs = [
    { label: 'Hábitos de hoy', value: 'today' },
    { label: 'Todos los hábitos', value: 'all' },
    { label: 'Hábitos archivados', value: 'archived' }
];
</script>

<template>
    <div class="max-w-3xl mx-auto px-4 py-8 min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
        <div class="flex justify-between items-start mb-8">
            <h1 class="text-3xl font-bold text-blue-800 dark:text-blue-300 transition-colors">Mi Perfil</h1>
            <button
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 transition-colors"
                @click="showDeleteModal = true"
            >
                Eliminar Cuenta
            </button>
        </div>

        <StatsPanel class="mb-8" />

        <div class="flex space-x-2 mb-8">
            <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="activeTab = tab.value"
                :class="[
                    'px-4 py-2 rounded-t-lg font-semibold transition-colors',
                    activeTab === tab.value
                    ? 'bg-blue-700 dark:bg-blue-800 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                ]"
            >
                {{ tab.label }}
            </button>
        </div>

        <div class="mb-8 flex items-center">
            <input
                type="checkbox"
                id="allowDailyEmail"
                :checked="userStore.userData?.allowDailyEmail"
                @change="toggleDailyEmail"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="allowDailyEmail" class="ml-2 text-sm text-gray-600 dark:text-gray-300">
                Recibir recordatorio diario por correo
            </label>
        </div>

        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {{ tabs.find(tab => tab.value === activeTab).label }}
            </h2>
            <button 
                v-if="activeTab !== 'archived'"
                @click="showModal = true"
                class="bg-blue-700 dark:bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-900 transition-colors"
            >
                + Nuevo Hábito
            </button>
        </div>

        <HabitList :filter="activeTab" />

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

        <DeleteAccountModal v-if="showDeleteModal" @close="showDeleteModal = false" />
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
