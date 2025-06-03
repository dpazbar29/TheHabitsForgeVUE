<script setup>
    import CreateHabitForm from '../components/CreateHabitForm.vue';
    import HabitList from '../components/HabitsList.vue';
</script>

<template>
    <div class="max-w-3xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-blue-800 mb-8">Mi Perfil</h1>
    
        <CreateHabitForm />
        <HabitList class="mt-8" />
    </div>
</template>
