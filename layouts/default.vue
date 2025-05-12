<script setup>
    import AppHeader from '~/components/AppHeader.vue';
</script>

<template>
    <div class="min-h-screen bg-brand-background text-brand-text-light">
        <AppHeader />
        <main class="p-4 md:p-8">
            <slot />
        </main>
    </div>
</template>