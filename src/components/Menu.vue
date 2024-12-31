<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';
</script>

<template>
    <Header></Header>
    <router-view></router-view>
    <Sidebar></Sidebar>
</template>

<style scoped>

</style>