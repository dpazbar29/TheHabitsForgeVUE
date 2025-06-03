<template>
    <section class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 items-center justify-center min-h-screen flex flex-col transition-colors">
        <div class="max-w-2xl text-center">
            <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-200 mb-6 transition-colors">
                TheHabitsForge
            </h1>
            <p class="text-lg md:text-xl text-blue-800 dark:text-blue-300 mb-8 transition-colors">
                <span class="font-semibold">TheHabitsForge</span> es una aplicación web para ayudarte a crear y mantener hábitos positivos en tu vida diaria.<br>
                Registra tus hábitos, haz seguimiento de tu progreso, recibe recordatorios y descubre cómo la constancia puede transformar tu día a día.
            </p>
            <ul class="text-left text-blue-700 dark:text-blue-400 mb-8 space-y-2 mx-auto max-w-md transition-colors">
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Crea, edita y elimina tus propios hábitos
                </li>
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Visualiza tu progreso con estadísticas y rachas
                </li>
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Recibe recordatorios personalizados
                </li>
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Acceso seguro y privado con autenticación
                </li>
            </ul>
            <div class="flex flex-col md:flex-row gap-4 justify-center">
                <router-link 
                    to="/register" 
                    class="px-6 py-3 bg-blue-700 dark:bg-blue-800 text-white rounded-lg font-semibold shadow hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors"
                >
                    ¡Empieza gratis!
                </router-link>
                <router-link 
                    to="/login" 
                    class="px-6 py-3 bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-300 border border-blue-700 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Ya tengo cuenta
                </router-link>
            </div>
        </div>
    </section>
</template>

