<script lang="ts" setup>
defineProps({
    retorno: String,
    sucesso: Boolean,
    erro: Boolean
})

</script>

<template>
    <div v-if="sucesso">
        <slot></slot>
    </div>
    <div v-if="erro">
        <slot></slot>
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