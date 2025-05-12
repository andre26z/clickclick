<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses" :aria-disabled="disabled" :disabled="disabled">
      <slot />
    </NuxtLink>
    <button v-else :type="type" :class="buttonClasses" :disabled="disabled" @click="$emit('click', $event)">
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  type ButtonType = 'button' | 'submit' | 'reset';
  type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';
  
  const props = withDefaults(defineProps<{
    type?: ButtonType;
    variant?: ButtonVariant;
    disabled?: boolean;
    to?: string | object; // For NuxtLink usage
  }>(), {
    type: 'button',
    variant: 'primary',
    disabled: false,
    to: undefined,
  });
  
  defineEmits(['click']);
  
  const baseClasses = 'border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out text-black'; 
  
  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        // Roxo principal (Salvar, Novo Projeto)
        return 'border-transparent shadow-sm px-4 py-2 text-white bg-brand-primary bg-brand-primary-light focus:ring-brand-primary';
      case 'secondary':
        // Branco com borda (Cancelar)
        return 'border-gray-300 shadow-sm px-4 py-2 text-gray-700 bg-white bg-gray-50 focus:ring-brand-primary';
      case 'danger':
         // Vermelho (Confirmar exclusão)
        return 'border-transparent shadow-sm px-4 py-2 text-white bg-red-600 bg-red-700 focus:ring-red-500';
      case 'link':
          // Aparência de Link (Voltar)
          return 'border-transparent px-1 py-1 text-brand-primary underline focus:ring-brand-primary'; // Ajuste padding se necessário
      default:
        return 'border-transparent shadow-sm px-4 py-2 text-white bg-brand-primary bg-brand-primary-light focus:ring-brand-primary';
    }
  });
  
  const buttonClasses = computed(() => `${baseClasses} ${variantClasses.value}`);
  
  </script>