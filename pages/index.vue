<template>
	<div>
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
			<h2 class="text-2xl font-semibold text-brand-text-light">
				Projetos ({{ store.filteredAndSortedProjects.length }})
			</h2>
			<div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
				<label class="flex items-center space-x-2 cursor-pointer">
					<input
						type="checkbox"
						v-model="store.showFavoritesOnly"
						class="form-checkbox h-5 w-5 text-brand-primary rounded focus:ring-brand-primary-light"
					/>
					<span class="text-sm font-medium">Apenas Favoritos</span>
				</label>

				<select
					v-model="store.sortBy"
					class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
				>
					<option value="alphabetical">Ordem alfabética</option>
					<option value="recent">Iniciados mais recentemente</option>
					<option value="endingSoon">Próximos à finalização</option>
				</select>

				<NuxtLink
					to="/projetos/novo"
					class="bg-brand-primary hover:bg-brand-primary-light text-black px-4 py-2 rounded-md text-sm font-medium flex border border-gray-500 items-center justify-center space-x-1 whitespace-nowrap"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>Novo projeto</span>
				</NuxtLink>
			</div>
		</div>

		<div v-if="store.loading" class="text-center py-10">Carregando...</div>
		<div
			v-else-if="store.filteredAndSortedProjects.length > 0"
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
		>
			<ProjectCard
				v-for="project in store.filteredAndSortedProjects"
				:key="project.id"
				:project="project"
				:search-term="store.searchTerm"
				@toggle-favorite="handleToggleFavorite"
				@delete-project="promptDeleteProject"
			/>
		</div>
		<div v-else class="text-center py-10 text-gray-500">
			Nenhum projeto encontrado{{ store.showFavoritesOnly ? ' como favorito' : '' }}.
			<NuxtLink
				v-if="!store.showFavoritesOnly"
				to="/projetos/novo"
				class="text-brand-primary hover:underline ml-1"
				>Crie um novo projeto!</NuxtLink
			>
		</div>

		<ConfirmationModal
			:show="showDeleteModal"
			:project-name="projectToDelete?.name ?? ''"
			@confirm="confirmDeleteProject"
			@cancel="cancelDeleteProject"
		/>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import ProjectCard from '~/components/ProjectCard.vue';
	import ConfirmationModal from '~/components/ConfirmationModal.vue';

	import { useProjectsStore } from '~/stores/project';
	import type { Project } from '~/types/project';

	const store = useProjectsStore();

	const showDeleteModal = ref(false);
	const projectToDelete = ref<Project | null>(null);

	onMounted(() => {
		if (store.projects.length === 0) {
			store.fetchProjects();
		}
	});

	const handleToggleFavorite = async (projectId: string) => {
		await store.toggleFavorite(projectId);
		// Considerar adicionar feedback de UI (loading, sucesso/erro) se desejar
	};

	const promptDeleteProject = (projectId: string) => {
		projectToDelete.value = store.projects.find((p) => p.id === projectId) || null;
		if (projectToDelete.value) {
			showDeleteModal.value = true;
		}
	};

	const confirmDeleteProject = async () => {
		if (projectToDelete.value) {
			await store.deleteProject(projectToDelete.value.id);
		}
		cancelDeleteProject();
	};

	const cancelDeleteProject = () => {
		showDeleteModal.value = false;
		projectToDelete.value = null;
	};
</script>
