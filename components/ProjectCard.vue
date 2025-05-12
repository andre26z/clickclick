<template>
	<div
		class="bg-brand-card rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02]"
	>
		<div class="h-40 bg-gray-200 flex items-center justify-center relative">
			<ProjectCoverPlaceholder
				:project-name="project.name"
				:project-id="project.id"
				class="w-full h-full"
			/>
			<BaseButton
				@click.stop="$emit('toggleFavorite', project.id)"
				:class="[
					'absolute top-2 right-2 p-1.5 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500',
					project.isFavorite
						? 'bg-yellow-400 hover:bg-yellow-500 text-black'
						: 'bg-gray hover:bg-yellow-300 text-black',
				]"
				aria-label="Favoritar"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					:fill="project.isFavorite ? 'currentColor' : 'none'"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69L11.049 2.927z"
					/>
				</svg>
			</BaseButton>
		</div>

		<div class="p-4 flex-grow flex flex-col relative">
			<h3 class="font-semibold text-lg mb-1" v-html="highlightedName"></h3>
			<p class="text-sm text-gray-600 mb-3">
				Cliente: <span class="font-medium">{{ project.client }}</span>
			</p>

			<div class="text-sm text-gray-500 mt-auto space-y-1">
				<div class="flex items-center space-x-1.5">
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>{{ formatDate(project.startDate) }}</span>
				</div>
				<div class="flex items-center space-x-1.5">
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>{{ formatDate(project.endDate) }}</span>
				</div>
			</div>

			<div class="absolute bottom-2 right-2 group">
				<BaseButton class="p-1 rounded-full hover:bg-gray-200 text-gray-500">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
						/>
					</svg>
				</BaseButton>
				<div
					class="absolute right-0 bottom-full mb-1 w-32 bg-white rounded-md shadow-lg py-1 hidden group-hover:block group-focus-within:block z-10 ring-1 ring-black ring-opacity-5"
				>
					<NuxtLink
						:to="`/projetos/editar/${project.id}`"
						class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
						>Editar</NuxtLink
					>
					<BaseButton
						variant="link"
						class="block w-full text-left px-4 py-2 text-sm !text-gray-700 hover:!bg-gray-100 no-underline focus:!outline-none focus:!ring-0"
						@click.stop="$emit('deleteProject', project.id)"
					>
						Remover
					</BaseButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import type { Project } from '~/types/project';
	import BaseBaseButton from '~/components/BaseButton.vue';
	import ProjectCoverPlaceholder from '~/components/ProjectCoverPlaceholder.vue';

	const props = defineProps<{
		project: Project;
		searchTerm?: string;
	}>();

	defineEmits(['toggleFavorite', 'deleteProject']);

	const formatDate = (dateString: string): string => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString + 'T00:00:00');
		return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
	};

	const highlightedName = computed(() => {
		if (!props.searchTerm || props.searchTerm.length < 3) {
			return props.project.name;
		}
		const regex = new RegExp(
			`(${props.searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`,
			'gi'
		);
		return props.project.name.replace(
			regex,
			'<mark class="bg-yellow-200 px-0 py-0 rounded">$1</mark>'
		);
	});
</script>

<style scoped>
	.group:hover .group-hover\:block {
		display: block;
	}
	:deep(mark) {
		background-color: #fef08a;
		padding: 0;
		border-radius: 0.125rem;
	}
	/* Adiciona !important via CSS se as classes Tailwind com ! não funcionarem (geralmente funcionam) */
	/* .force-left-align { justify-content: flex-start !important; } */
</style>
