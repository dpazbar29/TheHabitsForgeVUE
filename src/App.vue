<template>
  <div class="min-h-screen flex flex-col">
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