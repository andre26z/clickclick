<template>
    <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl mx-auto">
      <div>
        <label for="projectName" class="block text-sm font-medium text-gray-700 mb-1">
          Nome do projeto <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="projectName"
          v-model="formData.name"
          required
          placeholder="Ex: Redesign do Website Corporativo"
          :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2', errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary']"
        />
        <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
      </div>
  
      <div>
         <label for="clientName" class="block text-sm font-medium text-gray-700 mb-1">
          Cliente <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="clientName"
          v-model="formData.client"
          required
          placeholder="Ex: Empresa Exemplo Ltda."
           :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2', errors.client ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary']"
        />
         <p v-if="errors.client" class="text-sm text-red-600 mt-1">{{ errors.client }}</p>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
            Data de Início <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            v-model="formData.startDate"
            required
             :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2', errors.startDate ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary']"
           />
           <p v-if="errors.startDate" class="text-sm text-red-600 mt-1">{{ errors.startDate }}</p>
        </div>
         <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
            Data Final <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="endDate"
            v-model="formData.endDate"
            required
            :min="formData.startDate"
            :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2', errors.endDate ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary']"
           />
           <p v-if="errors.endDate" class="text-sm text-red-600 mt-1">{{ errors.endDate }}</p>
        </div>
      </div>
  
       <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Capa do projeto</label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <img v-if="imagePreview" :src="imagePreview" alt="Preview da capa" class="mx-auto h-24 w-auto mb-2 object-contain"/>
             <div v-else class="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg>
             </div>
            <div class="flex text-sm text-gray-600 justify-center">
              <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-primary-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                <span>Selecione um arquivo</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileChange" accept="image/jpeg, image/png">
              </label>
              <p class="pl-1">ou arraste e solte</p>
            </div>
            <p class="text-xs text-gray-500">
              PNG, JPG até 2MB
            </p>
            <p v-if="formData.coverImageUrl && !imagePreview" class="text-xs text-gray-500 mt-1">
              Capa atual: {{ getFileName(formData.coverImageUrl) }}
              <button type="button" @click="removeExistingImage" class="text-red-500 text-xs ml-1">(Remover)</button>
            </p>
            <p v-if="selectedFileName" class="text-xs text-gray-500 mt-1">
              Selecionado: {{ selectedFileName }}
              <BaseButton variant="secondary" @click="removeSelectedFile"> Remover </BaseButton>
            </p>
          </div>
        </div>
        <p v-if="errors.coverImage" class="text-sm text-red-600 mt-1">{{ errors.coverImage }}</p>
      </div>
  
      <div class="pt-5">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
        >
          {{ isSubmitting ? 'Salvando...' : (mode === 'edit' ? 'Salvar alterações' : 'Criar projeto') }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, reactive } from 'vue';
  import type { Project, ProjectData } from '~/types/project'; // Ajuste a interface conforme necessário
  
  interface Props {
      initialData?: Project | null;
      mode: 'create' | 'edit';
      isSubmitting?: boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    isSubmitting: false,
  });
  
  const emit = defineEmits(['submit']);
  
  // Reactive state for form data
  const formData = reactive<ProjectData>({
      name: '',
      client: '',
      startDate: '',
      endDate: '',
      coverImageUrl: '', // Armazena URL existente ou null
      coverImageFile: null, // Armazena o novo File selecionado
      isFavorite: false, // Manter o estado original ou definir padrão
  });
  
  const errors = reactive({
      name: '',
      client: '',
      startDate: '',
      endDate: '',
      coverImage: ''
  });
  
  const imagePreview = ref<string | null>(null);
  const selectedFileName = ref<string | null>(null);
  
  // Preenche o form se for modo edição
  watch(() => props.initialData, (newData) => {
      if (newData && props.mode === 'edit') {
          formData.name = newData.name;
          formData.client = newData.client;
          formData.startDate = newData.startDate; // Assumindo YYYY-MM-DD
          formData.endDate = newData.endDate;     // Assumindo YYYY-MM-DD
          formData.coverImageUrl = newData.coverImageUrl || '';
          formData.isFavorite = newData.isFavorite;
          imagePreview.value = newData.coverImageUrl || null; // Mostrar preview da imagem existente
          selectedFileName.value = null;
          formData.coverImageFile = null;
      } else {
          // Resetar form se initialData for null ou modo create
          Object.assign(formData, { name: '', client: '', startDate: '', endDate: '', coverImageUrl: '', coverImageFile: null, isFavorite: false });
          imagePreview.value = null;
          selectedFileName.value = null;
      }
  }, { immediate: true });
  
  
  // Validação Simples (pode expandir com Zod, VeeValidate etc.)
  const validate = (): boolean => {
    let isValid = true;
    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = '');
  
    if (!formData.name.trim()) {
      errors.name = 'Nome do projeto é obrigatório.';
      isValid = false;
    } else if (formData.name.trim().split(' ').length < 2) {
         errors.name = 'Por favor, digite ao menos duas palavras.';
         isValid = false;
    }
  
    if (!formData.client.trim()) {
      errors.client = 'Cliente é obrigatório.';
      isValid = false;
    } else if (formData.client.trim().split(' ').length < 1) { // Exemplo de validação diferente
        errors.client = 'Por favor, digite ao menos uma palavra.';
        isValid = false;
    }
  
    if (!formData.startDate) {
      errors.startDate = 'Data de início é obrigatória.';
      isValid = false;
    }
  
    if (!formData.endDate) {
      errors.endDate = 'Data final é obrigatória.';
      isValid = false;
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      errors.endDate = 'Data final não pode ser anterior à data de início.';
      isValid = false;
    }
  
     if(formData.coverImageFile && formData.coverImageFile.size > 2 * 1024 * 1024) { // 2MB limit
         errors.coverImage = 'A imagem não pode ser maior que 2MB.';
         isValid = false;
     }
  
    return isValid;
  }
  
  const handleSubmit = () => {
    if (validate()) {
      // Cria um objeto apenas com os dados relevantes para a store/API
      const dataToSubmit: ProjectData = {
          name: formData.name.trim(),
          client: formData.client.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          // Mantenha a URL existente se nenhuma nova imagem foi selecionada OU se a existente foi removida
          coverImageUrl: formData.coverImageFile ? undefined : formData.coverImageUrl || undefined,
          coverImageFile: formData.coverImageFile, // Passa o File para ser tratado na store/API
          isFavorite: formData.isFavorite // Importante manter o estado
      };
      emit('submit', dataToSubmit);
    }
  };
  
  const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
           // Valida tipo e tamanho aqui se necessário
          if (file.size > 2 * 1024 * 1024) {
              errors.coverImage = 'A imagem não pode ser maior que 2MB.';
              imagePreview.value = null;
              selectedFileName.value = null;
              formData.coverImageFile = null;
              target.value = ''; // Limpa o input
              return;
          }
          if (!['image/jpeg', 'image/png'].includes(file.type)) {
              errors.coverImage = 'Formato inválido. Use PNG ou JPG.';
               imagePreview.value = null;
              selectedFileName.value = null;
              formData.coverImageFile = null;
              target.value = ''; // Limpa o input
              return;
          }
  
          errors.coverImage = ''; // Limpa erro anterior
          formData.coverImageFile = file;
          selectedFileName.value = file.name;
          // Cria preview local
          const reader = new FileReader();
          reader.onload = (e) => {
              imagePreview.value = e.target?.result as string;
               formData.coverImageUrl = ''; // Indica que a imagem existente deve ser removida/substituída
          };
          reader.readAsDataURL(file);
      }
  };
  
  const removeSelectedFile = () => {
      formData.coverImageFile = null;
      selectedFileName.value = null;
      imagePreview.value = props.initialData?.coverImageUrl || null; // Volta para a imagem original, se houver
      errors.coverImage = '';
      // Limpa o input file programaticamente se necessário (pode ser complexo)
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
  }
  
  // Para remover imagem existente no modo edição
  const removeExistingImage = () => {
      formData.coverImageUrl = ''; // Marca para remoção na API/store
      imagePreview.value = null; // Remove o preview
  }
  
  // Helper para extrair nome do arquivo da URL (simples)
  const getFileName = (url: string | undefined | null) => {
      if (!url) return '';
      try {
        return url.substring(url.lastIndexOf('/') + 1);
      } catch {
        return 'arquivo_imagem';
      }
  }
  </script>