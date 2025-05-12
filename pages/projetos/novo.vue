<template>
    <div>
      <NuxtLink to="/" class="inline-flex items-center text-sm text-gray-600 hover:text-brand-primary mb-6">
        <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
        Voltar
      </NuxtLink>
      <h2 class="text-2xl font-semibold mb-6">Novo projeto</h2>
      <ProjectForm
        mode="create"
        :is-submitting="isSubmitting"
        @submit="handleCreateProject"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import ProjectForm from '~/components/ProjectForm.vue';
  import type { ProjectData } from '~/types/project';
  import { useRouter } from 'vue-router';
  
  // Use Pinia Store aqui
  const router = useRouter();
  const isSubmitting = ref(false);
  
  const handleCreateProject = async (projectData: ProjectData) => {
    console.log('Criando projeto:', projectData);
    isSubmitting.value = true;
    // --- Lógica com Pinia Store ---
    // try {
    //   const newProject = await projectStore.addProject(projectData);
    //   router.push('/'); // Ou para a página do projeto criado: `/projetos/${newProject.id}`
    // } catch (error) {
    //   console.error("Erro ao criar projeto:", error);
    //   // Mostrar mensagem de erro para o usuário
    // } finally {
    //   isSubmitting.value = false;
    // }
    // --- Fim Lógica Pinia ---
  
    // Simulação sem Pinia:
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula request
    isSubmitting.value = false;
    router.push('/');
  };
  </script>