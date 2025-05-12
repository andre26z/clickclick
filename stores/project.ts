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
  orderBy as firestoreOrderBy,
  where, // Import 'where' for filtering
  Timestamp,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import type { Project, ProjectData } from '~/types/project';

export const useProjectsStore = defineStore('projects', () => {
  const { $firestore, $storage } = useNuxtApp();

  // === STATE ===
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<any>(null);
  const showFavoritesOnly = ref(false); // Estado para o filtro de favoritos
  const sortBy = ref('alphabetical'); // Estado para a ordenação ('alphabetical', 'recent', 'endingSoon')
  const searchTerm = ref(''); // Estado para o termo de busca (opcional, se a busca for feita aqui)

  // === ACTIONS ===

  async function fetchProjects() {
    loading.value = true;
    error.value = null;
    console.log("Fetching projects from Firebase..."); // Log para debug
    try {
      const projectsCollection = collection($firestore, 'projects');
      // A query inicial pode ser simples ou já incluir ordenação padrão
      const q = query(projectsCollection); // Pode adicionar firestoreOrderBy aqui se quiser uma ordem padrão
      const querySnapshot = await getDocs(q);
      projects.value = querySnapshot.docs.map(docSnap => ({ // Corrigido para docSnap
        id: docSnap.id,
        ...docSnap.data(),
      } as Project));
      console.log("Projects fetched:", projects.value.length); // Log para debug
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
      error.value = err;
      projects.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchProjectById(id: string): Promise<Project | null> {
    // Mantém a função como estava...
    loading.value = true;
    error.value = null;
    try {
      const projectDocRef = doc($firestore, 'projects', id);
      const docSnap = await getDoc(projectDocRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project;
      } else {
        console.log("Nenhum projeto encontrado com o ID:", id);
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
     // Mantém a função como estava...
    loading.value = true;
    error.value = null;
    try {
      let coverImageUrl = projectData.coverImageUrl || '';
      if (projectData.coverImageFile) {
        const file = projectData.coverImageFile;
        const filePath = `project-covers/${Date.now()}_${file.name}`;
        const fileRef = storageRef($storage, filePath);
        await uploadBytes(fileRef, file);
        coverImageUrl = await getDownloadURL(fileRef);
      }
      const dataToSave = {
        name: projectData.name,
        client: projectData.client,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        isFavorite: projectData.isFavorite || false,
        coverImageUrl: coverImageUrl,
      };
      const projectsCollection = collection($firestore, 'projects');
      const docRef = await addDoc(projectsCollection, dataToSave);
      // Não precisa adicionar localmente se o getter for reativo o suficiente
      // ou pode chamar fetchProjects() novamente ou apenas adicionar
       const newProject: Project = { id: docRef.id, ...dataToSave, coverImageUrl };
      // projects.value.push(newProject); // Adiciona à lista local
      await fetchProjects(); // Recarrega a lista toda para simplicidade inicial
      return newProject;
    } catch (err) {
      console.error("Erro ao adicionar projeto:", err);
      error.value = err;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<boolean> {
    // Mantém a função como estava...
    loading.value = true;
    error.value = null;
    try {
      const projectDocRef = doc($firestore, 'projects', id);
      const updateData: { [key: string]: any } = {};

       // Copia apenas os campos definidos em projectData para updateData
        for (const key in projectData) {
            if (Object.prototype.hasOwnProperty.call(projectData, key) && key !== 'coverImageFile') {
                 updateData[key] = projectData[key as keyof ProjectData];
            }
        }


      if (projectData.coverImageFile) {
        const currentProject = projects.value.find(p => p.id === id) || await fetchProjectById(id);
        if (currentProject?.coverImageUrl) {
            try { const oldImageRef = storageRef($storage, currentProject.coverImageUrl); await deleteObject(oldImageRef); } catch (e) { console.warn("Warn: old image delete failed", e); }
        }
        const file = projectData.coverImageFile;
        const filePath = `project-covers/${Date.now()}_${file.name}`;
        const fileRef = storageRef($storage, filePath);
        await uploadBytes(fileRef, file);
        updateData.coverImageUrl = await getDownloadURL(fileRef);
      } else if (projectData.hasOwnProperty('coverImageUrl') && projectData.coverImageUrl === '') {
          const currentProject = projects.value.find(p => p.id === id) || await fetchProjectById(id);
           if (currentProject?.coverImageUrl) {
              try { const oldImageRef = storageRef($storage, currentProject.coverImageUrl); await deleteObject(oldImageRef); } catch (e) { console.warn("Warn: old image delete failed", e); }
          }
          updateData.coverImageUrl = '';
      }

      await updateDoc(projectDocRef, updateData);

      // Atualiza a lista local
      const index = projects.value.findIndex(p => p.id === id);
      if (index !== -1) {
        const updatedDocSnap = await getDoc(projectDocRef);
        if (updatedDocSnap.exists()) {
          projects.value[index] = { id: updatedDocSnap.id, ...updatedDocSnap.data() } as Project;
        } else { // Se não existe mais (caso raro), remove
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
    // Mantém a função como estava...
    loading.value = true;
    error.value = null;
    try {
      const projectDocRef = doc($firestore, 'projects', id);
      const projectToDelete = projects.value.find(p => p.id === id) || await fetchProjectById(id); // Busca antes de deletar para pegar a URL
      if (projectToDelete?.coverImageUrl) {
          try { const imageRef = storageRef($storage, projectToDelete.coverImageUrl); await deleteObject(imageRef); } catch (e: any) { if (e.code !== 'storage/object-not-found') console.warn("Warn: image delete failed", e); }
      }
      await deleteDoc(projectDocRef);
      projects.value = projects.value.filter(p => p.id !== id);
      return true;
    } catch (err) {
      console.error(`Erro ao deletar projeto ${id}:`, err);
      error.value = err;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function toggleFavorite(id: string): Promise<boolean> { // Removido current status, busca antes
    try {
      const projectDocRef = doc($firestore, 'projects', id);
      // Busca o estado atual antes de inverter
      const project = projects.value.find(p => p.id === id);
      if (!project) {
          console.error("Projeto não encontrado localmente para favoritar:", id);
          // Poderia buscar do DB aqui, mas vamos simplificar
          return false;
      }
      const newFavoriteStatus = !project.isFavorite;
      await updateDoc(projectDocRef, { isFavorite: newFavoriteStatus });

      // Atualiza estado local após sucesso
      project.isFavorite = newFavoriteStatus;
      return true;
    } catch (err) {
      console.error(`Erro ao favoritar projeto ${id}:`, err);
      return false;
    }
  }

  // Ação para atualizar o termo de busca (chamado pelo componente de busca)
  function setSearchTerm(term: string) {
    searchTerm.value = term.toLowerCase();
  }

  // === GETTERS ===

  const filteredAndSortedProjects = computed(() => {
    let result = [...projects.value]; // Cria uma cópia para não modificar o original

    // Filtrar por busca (se houver termo na store)
    if (searchTerm.value && searchTerm.value.length >= 3) { // Adiciona condição de 3 caracteres
        result = result.filter(p =>
            p.name.toLowerCase().includes(searchTerm.value) ||
            p.client.toLowerCase().includes(searchTerm.value)
        );
    }

    // Filtrar por favoritos (usando estado da store)
    if (showFavoritesOnly.value) {
      result = result.filter(p => p.isFavorite);
    }

    // Ordenar (usando estado da store)
    result.sort((a, b) => {
      if (sortBy.value === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy.value === 'recent') {
        // Mais recente primeiro (data de início maior)
        // Adiciona verificação para garantir que as datas são válidas
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy.value === 'endingSoon') {
        // Mais próximo de finalizar primeiro (data final menor)
         const dateA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
        const dateB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
        return dateA - dateB;
      }
      return 0;
    });

    return result;
  });


  return {
    // State
    projects, // Exponha se precisar da lista bruta em algum lugar
    loading,
    error,
    showFavoritesOnly, // Expor para v-model
    sortBy,           // Expor para v-model
    searchTerm,       // Expor se necessário

    // Actions
    fetchProjects,
    fetchProjectById,
    addProject,
    updateProject,
    deleteProject,
    toggleFavorite,
    setSearchTerm,    // Expor ação de busca

    // Getters
    filteredAndSortedProjects,
  };
});