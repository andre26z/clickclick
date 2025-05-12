<template>
  <div>
    <NuxtLink to="/" class="inline-flex items-center text-sm text-gray-600 hover:text-brand-primary mb-6">
      <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
      Voltar
    </NuxtLink>

    <div v-if="store.loading && !project" class="text-center py-10">Carregando dados do projeto...</div>
    <div v-else-if="project">
      <h2 class="text-2xl font-semibold mb-6">Editar projeto</h2>
      <ProjectForm
        mode="edit"
        :initial-data="project"
        :is-submitting="isSubmitting"
        @submit="handleUpdateProject"
      />
    </div>
    <div v-else-if="!store.loading && !project" class="text-center py-10 text-red-500">
      Projeto não encontrado ou erro ao carregar.
      <p v-if="store.error" class="text-xs">{{ store.error.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProjectForm from '~/components/ProjectForm.vue';
import type { Project, ProjectData } from '~/types/project';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '~/stores/project'; // Importe sua store

const route = useRoute();
const router = useRouter();
const store = useProjectsStore(); // Use a store
const projectId = route.params.id as string;

const project = ref<Project | null>(null); // Estado local para os dados do formulário
const isSubmitting = ref(false);

onMounted(async () => {
  if (projectId) {
    // Busca o projeto da store, que por sua vez busca do Firebase se necessário
    const fetchedProject = await store.fetchProjectById(projectId);
    if (fetchedProject) {
      project.value = { ...fetchedProject }; // Copia para o estado local para edição
    }
  }
});

const handleUpdateProject = async (projectData: ProjectData) => {
  if (!project.value) return;
  isSubmitting.value = true;
  try {
    // O projectData já vem com o coverImageFile se um novo foi selecionado
    // e coverImageUrl se um existente deve ser mantido ou removido
    const success = await store.updateProject(projectId, projectData);
    if (success) {
      router.push('/');
    } else {
      // Tratar erro de atualização (ex: mostrar notificação)
      console.error("Falha ao atualizar projeto na página de edição.");
    }
  } catch (error) {
    console.error("Erro ao submeter atualização:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>