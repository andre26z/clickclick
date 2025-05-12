// stores/projects.ts
import { defineStore } from 'pinia';
import {
	collection,
	getDocs,
	doc,
	getDoc,
	addDoc,
	updateDoc,
	deleteDoc,
	query,
	Timestamp,
} from 'firebase/firestore';
import type { Project, ProjectData } from '~/types/project';

export const useProjectsStore = defineStore('projects', () => {
	const { $firestore } = useNuxtApp();

	const projects = ref<Project[]>([]);
	const loading = ref(false);
	const error = ref<any>(null);
	const showFavoritesOnly = ref(false);
	const sortBy = ref('alphabetical');
	const searchTerm = ref('');

	async function fetchProjects() {
		loading.value = true;
		error.value = null;
		console.log('Buscando projetos do Firebase...');
		try {
			const projectsCollection = collection($firestore, 'projects');
			const q = query(projectsCollection);
			const querySnapshot = await getDocs(q);
			projects.value = querySnapshot.docs.map(
				(docSnap) =>
					({
						id: docSnap.id,
						...docSnap.data(),
					} as Project)
			);
			console.log('Projetos buscados:', projects.value.length);
		} catch (err) {
			console.error('Erro ao buscar projetos:', err);
			error.value = err;
			projects.value = [];
		} finally {
			loading.value = false;
		}
	}

	async function fetchProjectById(id: string): Promise<Project | null> {
		loading.value = true;
		error.value = null;
		try {
			const projectDocRef = doc($firestore, 'projects', id);
			const docSnap = await getDoc(projectDocRef);
			if (docSnap.exists()) {
				return { id: docSnap.id, ...docSnap.data() } as Project;
			} else {
				console.log('Nenhum projeto encontrado com o ID:', id);
				return null;
			}
		} catch (err) {
			console.error(`Erro ao buscar projeto ${id}:`, err);
			error.value = err;
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function addProject(projectData: ProjectData): Promise<Project | null> {
		loading.value = true;
		error.value = null;
		console.log('Tentando adicionar projeto:', projectData);
		try {
			const dataToSave: ProjectData = {
				name: projectData.name,
				client: projectData.client,
				startDate: projectData.startDate,
				endDate: projectData.endDate,
				isFavorite: projectData.isFavorite || false,
			};

			console.log('Dados a serem salvos no Firestore:', dataToSave);
			const projectsCollection = collection($firestore, 'projects');
			const docRef = await addDoc(projectsCollection, dataToSave);
			console.log('Projeto adicionado com ID:', docRef.id);

			const newProject: Project = { id: docRef.id, ...dataToSave };

			await fetchProjects();
			console.log('Projetos recarregados após adição.');
			return newProject;
		} catch (err) {
			console.error('ERRO DETALHADO ao adicionar projeto:', err);
			error.value = err;
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<boolean> {
		loading.value = true;
		error.value = null;
		try {
			const projectDocRef = doc($firestore, 'projects', id);
			const updateData: Partial<ProjectData> = { ...projectData };

			if (Object.keys(updateData).length === 0) {
				console.log('Nenhum dado para atualizar no projeto:', id);
				loading.value = false;
				return true;
			}

			console.log('Atualizando projeto', id, 'com dados:', updateData);
			await updateDoc(projectDocRef, updateData);

			const index = projects.value.findIndex((p) => p.id === id);
			if (index !== -1) {
				const updatedDocSnap = await getDoc(projectDocRef);
				if (updatedDocSnap.exists()) {
					projects.value[index] = { id: updatedDocSnap.id, ...updatedDocSnap.data() } as Project;
				} else {
					projects.value.splice(index, 1);
				}
			}
			return true;
		} catch (err) {
			console.error(`Erro ao atualizar projeto ${id}:`, err);
			error.value = err;
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function deleteProject(id: string): Promise<boolean> {
		loading.value = true;
		error.value = null;
		try {
			const projectDocRef = doc($firestore, 'projects', id);
			console.log('Deletando projeto do Firestore:', id);
			await deleteDoc(projectDocRef);
			projects.value = projects.value.filter((p) => p.id !== id);
			console.log('Projeto removido da lista local.');
			return true;
		} catch (err) {
			console.error(`Erro ao deletar projeto ${id}:`, err);
			error.value = err;
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function toggleFavorite(id: string): Promise<boolean> {
		const project = projects.value.find((p) => p.id === id);
		if (!project) {
			console.error('Projeto não encontrado localmente para favoritar/desfavoritar:', id);
			return false;
		}

		loading.value = true;
		error.value = null;
		try {
			const projectDocRef = doc($firestore, 'projects', id);
			const newFavoriteStatus = !project.isFavorite;
			await updateDoc(projectDocRef, { isFavorite: newFavoriteStatus });
			project.isFavorite = newFavoriteStatus;
			return true;
		} catch (err) {
			console.error(
				`Erro ao ${project.isFavorite ? 'desfavoritar' : 'favoritar'} projeto ${id}:`,
				err
			);
			error.value = err;
			return false;
		} finally {
			loading.value = false;
		}
	}

	function setSearchTerm(term: string) {
		searchTerm.value = term.toLowerCase();
	}

	const filteredAndSortedProjects = computed(() => {
		let result = [...projects.value];

		if (searchTerm.value && searchTerm.value.length >= 3) {
			result = result.filter(
				(p) =>
					p.name.toLowerCase().includes(searchTerm.value) ||
					p.client.toLowerCase().includes(searchTerm.value)
			);
		}

		if (showFavoritesOnly.value) {
			result = result.filter((p) => p.isFavorite);
		}

		result.sort((a, b) => {
			if (sortBy.value === 'alphabetical') {
				return a.name.localeCompare(b.name);
			}
			if (sortBy.value === 'recent') {
				const dateA =
					a.startDate instanceof Timestamp
						? a.startDate.toDate().getTime()
						: a.startDate
						? new Date(a.startDate as string).getTime()
						: 0;
				const dateB =
					b.startDate instanceof Timestamp
						? b.startDate.toDate().getTime()
						: b.startDate
						? new Date(b.startDate as string).getTime()
						: 0;
				return (dateB || 0) - (dateA || 0);
			}
			if (sortBy.value === 'endingSoon') {
				const dateA =
					a.endDate instanceof Timestamp
						? a.endDate.toDate().getTime()
						: a.endDate
						? new Date(a.endDate as string).getTime()
						: Infinity;
				const dateB =
					b.endDate instanceof Timestamp
						? b.endDate.toDate().getTime()
						: b.endDate
						? new Date(b.endDate as string).getTime()
						: Infinity;
				return (dateA || Infinity) - (dateB || Infinity);
			}
			return 0;
		});

		return result;
	});

	return {
		projects,
		loading,
		error,
		showFavoritesOnly,
		sortBy,
		searchTerm,
		fetchProjects,
		fetchProjectById,
		addProject,
		updateProject,
		deleteProject,
		toggleFavorite,
		setSearchTerm,
		filteredAndSortedProjects,
	};
});
