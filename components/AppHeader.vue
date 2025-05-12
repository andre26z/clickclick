<template>
	<header
		class="bg-violet-900 text-brand-text-dark p-4 flex justify-between items-center sticky top-0 z-10 shadow-md"
	>
		<div class="flex items-center space-x-2">
			<NuxtLink to="/" class="flex items-center space-x-2">
				<svg class="h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00-.504-.868l-7-4zM10 9a1 1 0 100-2 1 1 0 000 2zm-2 4a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
						clip-rule="evenodd"
					/>
				</svg>
				<h1 class="text-xl text-white font-semibold">Gerenciador de Projetos</h1>
			</NuxtLink>
		</div>
	</header>
</template>

<script setup lang="ts">
	import { ref } from 'vue'; // `watch` não é mais estritamente necessário para esta lógica
	import { useRouter } from 'vue-router';
	import BaseButton from '~/components/BaseButton.vue';
	import { useProjectsStore } from '~/stores/project'; // 1. Importar a store de projetos

	const isSearchOpen = ref(false);
	const searchTerm = ref(''); // v-model para o input de busca no template
	const recentSearches = ref(['']); // Mock para buscas recentes

	const projectStore = useProjectsStore();
	const router = useRouter();

	const toggleSearch = () => {
		isSearchOpen.value = !isSearchOpen.value;
		if (isSearchOpen.value) {
			searchTerm.value = projectStore.searchTerm;
		} else {
			searchTerm.value = '';
			projectStore.setSearchTerm('');
		}

		const handleSearchInput = () => {
			projectStore.setSearchTerm(searchTerm.value);

			if (searchTerm.value.length >= 3) {
				updateRecentSearches(searchTerm.value);
			}
		};

		const updateRecentSearches = (term: string) => {
			recentSearches.value = [term, ...recentSearches.value.filter((s) => s !== term)].slice(0, 5);
		};

		const removeRecentSearch = (term: string) => {
			recentSearches.value = recentSearches.value.filter((s) => s !== term);
		};
	};
</script>
