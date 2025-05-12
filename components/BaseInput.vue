<template>
    <div>
      <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
      <div class="relative rounded-md shadow-sm">
         <input
          :id="inputId"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :class="[
            baseInputClasses,
            error ? errorClasses : focusClasses,
            disabled ? disabledClasses : '',
            // $slots.icon ? 'pl-10' : '' // Adiciona padding se houver ícone
          ]"
          v-bind="$attrs"  
          @input="onInput"
        />
         <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
          </div>
      </div>
       <p v-if="typeof error === 'string' && error" class="mt-1 text-sm text-red-600" :id="`${inputId}-error`">
          {{ error }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  type InputType = 'text' | 'email' | 'password' | 'date' | 'number' | 'tel' | 'url';
  
  const props = withDefaults(defineProps<{
    modelValue: string | number | null | undefined;
    type?: InputType;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: boolean | string; // Boolean para estilo, String para mensagem
    id?: string;
  }>(), {
    type: 'text',
    label: undefined,
    placeholder: undefined,
    disabled: false,
    required: false,
    error: false,
    id: undefined,
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Gera um ID único se não for fornecido, útil para a label
  const inputId = computed(() => props.id || `base-input-${Math.random().toString(36).substring(7)}`);
  
  const baseInputClasses = 'block w-full border rounded-md px-3 py-2 shadow-sm sm:text-sm focus:outline-none disabled:cursor-not-allowed';
  const focusClasses = 'border-gray-300 focus:ring-brand-primary focus:border-brand-primary';
  const errorClasses = 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500';
  const disabledClasses = 'disabled:bg-gray-100 disabled:text-gray-500';
  
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  };
  
  </script>
  
  <style scoped>
  /* Adiciona hide para as setas de number input, se desejar */
  /* input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  } */
  </style>