<script lang="ts">
defineProps({
    retorno: String,
    sucesso: Boolean,
    erro: Boolean
})

</script>

<template>
    <div v-if="sucesso">
        <p>{{ retorno }}</p>
    </div>
    <div v-if="erro">
        <p>{{ retorno }}</p>
    </div>
</template>

<style scoped>
@keyframes showToast {
    from {
        transform: translateX(-100vw);
    }

    to {
        transform: translateX(0vw);
    }
}
</style>