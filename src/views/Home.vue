<template>
    <section class="bg-gradient-to-br from-blue-50 to-blue-100 min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div class="max-w-2xl text-center">
            <h1 class="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
                TheHabitsForge
            </h1>
            <p class="text-lg md:text-xl text-blue-800 mb-8">
                <span class="font-semibold">TheHabitsForge</span> es una aplicación web para ayudarte a crear y mantener hábitos positivos en tu vida diaria.<br>
                Registra tus hábitos, haz seguimiento de tu progreso, recibe recordatorios y descubre cómo la constancia puede transformar tu día a día.
            </p>
            <ul class="text-left text-blue-700 mb-8 space-y-2 mx-auto max-w-md">
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Crea, edita y elimina tus propios hábitos
                </li>
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Visualiza tu progreso con estadísticas y rachas
                </li>
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Recibe recordatorios personalizados
                </li>
                <li class="flex items-center">
                    <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    Acceso seguro y privado con autenticación
                </li>
            </ul>
            <div class="flex flex-col md:flex-row gap-4 justify-center">
                <router-link to="/register" class="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition">
                    ¡Empieza gratis!
                </router-link>
                <router-link to="/login" class="px-6 py-3 bg-white text-blue-700 border border-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Ya tengo cuenta
                </router-link>
            </div>
        </div>
    </section>
</template>
