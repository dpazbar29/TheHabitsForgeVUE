<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'
</script>