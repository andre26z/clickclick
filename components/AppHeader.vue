<template>
	<header
		class="bg-violet-900 text-brand-text-dark p-4 flex justify-between items-center sticky top-0 z-10 shadow-md"
	>
		<div class="flex items-center space-x-2">
			<svg class="h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00-.504-.868l-7-4zM10 9a1 1 0 100-2 1 1 0 000 2zm-2 4a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
					clip-rule="evenodd"
				/>
			</svg>
			<h1 class="text-xl text-white font-semibold">Gerenciador de Projetos</h1>
		</div>

		<div class="relative">
			<BaseButton @click="toggleSearch" class="p-2 rounded-full hover:bg-gray-700">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</BaseButton>
			<div
				v-if="isSearchOpen"
				class="absolute right-0 mt-2 w-64 md:w-96 bg-white rounded-md shadow-lg p-2 z-20"
			>
				<input
					type="text"
					v-model="searchTerm"
					@input="handleSearchInput"
					placeholder="Digite o nome do projeto..."
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-text-light"
				/>
				<ul
					v-if="searchTerm.length < 3 && recentSearches.length > 0"
					class="mt-2 text-sm text-gray-600"
				>
					<li class="font-semibold mb-1">Recentes:</li>
					<li
						v-for="(search, index) in recentSearches"
						:key="index"
						class="p-1 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
					>
						<span>{{ search }}</span>
						<BaseButton @click.stop="removeRecentSearch(search)" class="text-red-500 text-xs"
							>✕</BaseButton
						>
					</li>
				</ul>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	// Em um app real, use Pinia store aqui
	const isSearchOpen = ref(false);
	const searchTerm = ref('');
	const recentSearches = ref(['Projeto 1', 'Design System', 'App Mobile']); // Mock
	const router = useRouter();
	import BaseButton from '~/components/BaseButton.vue'; // Importa o BaseButton

	const toggleSearch = () => {
		isSearchOpen.value = !isSearchOpen.value;
		if (!isSearchOpen.value) {
			searchTerm.value = ''; // Limpa ao fechar
		}
	};

	const handleSearchInput = () => {
		// Lógica para disparar busca após 3 caracteres
		if (searchTerm.value.length >= 3) {
			console.log('Buscando por:', searchTerm.value);
			// Aqui você atualizaria a store Pinia ou usaria query params para filtrar
			// Ex: router.push({ path: '/', query: { q: searchTerm.value } });
			updateRecentSearches(searchTerm.value);
			// Fechar o input após busca pode ser uma opção UX
			// isSearchOpen.value = false;
		} else {
			// Limpar filtro na store ou query params se a busca for apagada
			// Ex: router.push({ path: '/', query: { ...router.currentRoute.value.query, q: undefined } });
		}
	};

	const updateRecentSearches = (term: string) => {
		// Remove duplicações e adiciona no início
		recentSearches.value = [term, ...recentSearches.value.filter((s) => s !== term)].slice(0, 5); // Mantém as 5 últimas
	};

	const removeRecentSearch = (term: string) => {
		recentSearches.value = recentSearches.value.filter((s) => s !== term);
	};

	// Fechar busca ao clicar fora (adicionar lógica de detecção de clique fora)
</script>
