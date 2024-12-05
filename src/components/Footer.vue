<script setup lang="ts">

</script>

<template>
    <div class="footer">
        <div class="contact">Contato</div>
        <img src="../assets/github.png" alt="github" class="git">
        <div class="marca">DivSmart</div>
    </div>
</template>

<style scoped>
div.footer {
    position: relative;
    bottom: 0;
    width: 100%;
    min-height: 5vh;
}

div.contact {
    color: whitesmoke;
    position: relative;
    left: 30%;
}

div.git {
    object-position: 20% 2%;
}

div.marca {
    position: relative;
    left: 80%;
    color: whitesmoke;
}
</style>