<template>
    <footer class="bg-gray-900 text-white py-4 text-center">
        <span>
            &copy; {{ new Date().getFullYear() }} TheHabitsForge &middot;
            <router-link
                to="/contacto"
                class="text-blue-300 hover:text-blue-400 underline transition"
            >
                Contacto
            </router-link>
        </span>
    </footer>
</template>
