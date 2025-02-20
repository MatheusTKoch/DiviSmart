<script setup lang="ts">

</script>

<template>
    <div class="spinner"></div>
</template>
  
  
<style scoped>
.spinner {
    position: fixed;
    top: 30vh;
    left: 55vw;
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-left-color: #055db6;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: auto;
}
  
@keyframes spin {
to {
    transform: rotate(360deg);
}
}
</style>