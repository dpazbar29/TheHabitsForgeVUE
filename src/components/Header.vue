<script setup>
import { useUserStore } from '../stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
    userStore.logoutUser()
    router.push('/')
}
</script>

<template>
    <header class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <div class="font-bold text-xl cursor-pointer" @click="router.push('/')">
            TheHabitsForge
        </div>
        <nav>
            <span v-if="userStore.userData">
                Bienvenido, {{ userStore.userData.email }}
                <button class="mx-2" @click="router.push('/perfil')">Perfil</button>
                <button class="mx-2" @click="handleLogout">Cerrar sesión</button>
            </span>
            <span v-else>
                <button class="mx-2" @click="router.push('/login')">Iniciar sesión</button>
                <button class="mx-2" @click="router.push('/register')">Registrarse</button>
            </span>
        </nav>
    </header>
</template>
