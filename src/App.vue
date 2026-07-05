<script setup lang="ts"></script>

<template>
  <div class="app-shell">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style>
body {
  background: transparent;
}
</style>
