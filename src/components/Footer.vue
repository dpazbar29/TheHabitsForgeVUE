<template>
    <footer class="bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-300 py-4 text-center transition-colors">
        <span>
            &copy; {{ new Date().getFullYear() }} TheHabitsForge &middot;
            <router-link
                to="/contacto"
                class="text-blue-300 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
            >
                Contacto
            </router-link>
        </span>
    </footer>
</template>
