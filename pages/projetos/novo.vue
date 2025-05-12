<template>
	<div>
		<NuxtLink
			to="/"
			class="inline-flex items-center text-sm text-gray-600 hover:text-brand-primary mb-6"
		>
			<svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
					clip-rule="evenodd"
				/>
			</svg>
			Voltar
		</NuxtLink>
		<h2 class="text-2xl font-semibold mb-6">Novo projeto</h2>
		<ProjectForm mode="create" :is-submitting="isSubmitting" @submit="handleCreateProject" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import ProjectForm from '~/components/ProjectForm.vue';
	import type { ProjectData } from '~/types/project'; // Certifique-se que este tipo é o mesmo esperado pela store
	import { useRouter } from 'vue-router';
	import { useProjectsStore } from '~/stores/project'; // 1. Importar a store

	const router = useRouter();
	const projectStore = useProjectsStore(); // 2. Instanciar a store
	const isSubmitting = ref(false);

	const handleCreateProject = async (projectData: ProjectData) => {
		console.log('Criando projeto com Pinia:', projectData);
		isSubmitting.value = true;

		try {
			// 3. Chamar a action da store para adicionar o projeto
			const newProject = await projectStore.addProject(projectData);

			if (newProject && newProject.id) {
				console.log('Projeto criado com sucesso:', newProject);
				// Você pode navegar para a página do novo projeto ou para a lista
				router.push('/'); // Ou: router.push(`/projetos/${newProject.id}`);
			} else {
				// Se newProject for null, significa que a store indicou um erro internamente
				// A store já deve ter logado o erro, mas você pode adicionar um feedback ao usuário aqui
				console.error('A store não retornou um novo projeto, verifique os logs da store.');
				// Exemplo: alert('Houve um problema ao criar o projeto. Tente novamente.');
			}
		} catch (error) {
			// Este catch pegaria erros não tratados pela store, ou erros na lógica daqui.
			// A sua store já tem um bom tratamento de erro interno.
			console.error('Erro ao tentar criar projeto (na página):', error);
			// Mostrar mensagem de erro para o usuário, se necessário
			// Exemplo: alert(`Erro ao criar projeto: ${error.message}`);
		} finally {
			isSubmitting.value = false;
		}
	};
</script>
