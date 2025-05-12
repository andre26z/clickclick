<template>
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
        @click.self="$emit('cancel')"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-2 text-center">Remover projeto</h3>
          <p class="text-sm text-gray-600 text-center mb-6">
            Essa ação removerá definitivamente o projeto: <br>
            <strong class="text-base">{{ projectName }}</strong>
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="$emit('cancel')"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              @click="$emit('confirm')"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    show: boolean;
    projectName: string;
  }>();
  
  defineEmits(['confirm', 'cancel']);
  </script>
  
  <style scoped>
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  </style>