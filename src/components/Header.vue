<script setup>
import { useUserStore } from '../stores/user'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useHabitsStore } from '../stores/habits'

const habitsStore = useHabitsStore()
const userStore = useUserStore()
const router = useRouter()

async function handleLogout() {
    try {
        const userId = userStore.userData?.uid;
        
        if (userId) {
            await habitsStore.syncWithFirestore(userId);
        }
        
        await userStore.logoutUser();
        localStorage.removeItem('habits');
        router.push('/');
    } catch (error) {
        alert(error.message);
    }
}

const isDark = ref(false)

onMounted(() => {
    isDark.value =
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkClass(isDark.value)
})

function toggleDark() {
    isDark.value = !isDark.value
    setDarkClass(isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function setDarkClass(value) {
    document.documentElement.classList.toggle('dark', value)
}
</script>

<template>
    <header class="bg-gray-800 dark:bg-gray-950 text-white dark:text-gray-100 px-6 py-4 flex justify-between items-center transition-colors">
        <div class="font-bold text-xl cursor-pointer hover:text-blue-300 dark:hover:text-blue-400 transition-colors" @click="router.push('/')">
            TheHabitsForge
        </div>
        <div class="flex items-center gap-2">
            <nav class="flex items-center gap-2">
                <template v-if="userStore.userData">
                    <button
                        class="px-3 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        @click="router.push('/perfil')"
                    >Perfil</button>
                    <button
                        class="px-3 py-1 rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                        @click="handleLogout"
                    >Cerrar sesión</button>
                </template>
                <template v-else>
                    <button
                        class="px-3 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        @click="router.push('/login')"
                    >Iniciar sesión</button>
                    <button
                        class="px-3 py-1 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                        @click="router.push('/register')"
                    >Registrarse</button>
                </template>
            </nav>
            <button
                @click="toggleDark"
                class="ml-2 px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow flex items-center justify-center"
                aria-label="Alternar modo oscuro"
                style="min-width: 44px;"
            >
                <font-awesome-icon :icon="isDark ? 'fa-sun' : 'fa-moon'" />
            </button>
        </div>
    </header>
</template>
