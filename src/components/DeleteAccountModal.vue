<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '../stores/user';
import { useHabitsStore } from '../stores/habits';

const emit = defineEmits(['close']);
const userStore = useUserStore();
const habitsStore = useHabitsStore();

const password = ref('');

const confirmDelete = async () => {
    if (!password.value) return;
    try {
        await userStore.deleteAccount(password.value);
        habitsStore.clearLocalData();
        localStorage.clear();
        emit('close');
    } catch (error) {
    }
};

watch(() => userStore.deleteLoading, (loading) => {
    if (!loading && !userStore.deleteError) {
        password.value = '';
    }
});
</script>

<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md p-6 transition-colors">
            <h3 class="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Confirmar eliminación de cuenta</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
                Esta acción es <b>irreversible</b>. Todos tus datos serán eliminados permanentemente.<br>
                Para confirmar, ingresa tu contraseña:
            </p>
            <input
                v-model="password"
                type="password"
                placeholder="Contraseña"
                class="w-full px-4 py-2 mb-4 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-400 dark:focus:ring-red-600 transition-colors"
            />
            <div v-if="userStore.deleteError" class="text-red-500 dark:text-red-400 mb-4">
                {{ userStore.deleteError }}
            </div>
            <div class="flex justify-end gap-4">
                <button
                    @click="emit('close')"
                    class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Cancelar
                </button>
                <button
                    @click="confirmDelete"
                    :disabled="userStore.deleteLoading"
                    class="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800 transition-colors disabled:opacity-60"
                >
                    <span v-if="userStore.deleteLoading">Eliminando...</span>
                    <span v-else>Confirmar Eliminación</span>
                </button>
            </div>
        </div>
    </div>
</template>
