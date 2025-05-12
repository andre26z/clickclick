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
				:class="[
					'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
					errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-brand-primary',
				]"
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
				:class="[
					'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
					errors.client
						? 'border-red-500 ring-red-500'
						: 'border-gray-300 focus:ring-brand-primary',
				]"
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
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
						errors.startDate
							? 'border-red-500 ring-red-500'
							: 'border-gray-300 focus:ring-brand-primary',
					]"
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
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
						errors.endDate
							? 'border-red-500 ring-red-500'
							: 'border-gray-300 focus:ring-brand-primary',
					]"
				/>
				<p v-if="errors.endDate" class="text-sm text-red-600 mt-1">{{ errors.endDate }}</p>
			</div>
		</div>

		<div class="pt-5 justify-center flex">
			<BaseButton type="submit" :disabled="isSubmitting" class="w-3/4 text-black">
				{{ isSubmitting ? 'Salvando...' : mode === 'edit' ? 'Salvar alterações' : 'Criar projeto' }}
			</BaseButton>
		</div>
	</form>
</template>

<script setup lang="ts">
	import { ref, watch, reactive } from 'vue';
	// Certifique-se que Project e ProjectData aqui são as versões limpas de ~/types/project.ts
	// onde ProjectData NÃO inclui coverImageUrl nem coverImageFile.
	import type { Project, ProjectData } from '~/types/project';

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

	// formData agora está limpo, sem campos de imagem
	const formData = reactive<ProjectData>({
		name: '',
		client: '',
		startDate: '',
		endDate: '',
		isFavorite: false,
	});

	// errors também está limpo, sem referência a 'coverImage'
	const errors = reactive({
		name: '',
		client: '',
		startDate: '',
		endDate: '',
	});

	// Refs e métodos relacionados a imagem foram removidos

	// Preenche o form se for modo edição (sem campos de imagem)
	watch(
		() => props.initialData,
		(newData) => {
			if (newData && props.mode === 'edit') {
				formData.name = newData.name;
				formData.client = newData.client;
				formData.startDate = newData.startDate;
				formData.endDate = newData.endDate;
				formData.isFavorite = newData.isFavorite ?? false; // Garante que isFavorite seja booleano
			} else {
				// Resetar form para modo criação ou se initialData for null
				Object.assign(formData, {
					name: '',
					client: '',
					startDate: '',
					endDate: '',
					isFavorite: false,
				});
			}
		},
		{ immediate: true }
	);

	// Validação Simples (sem validação de imagem)
	const validate = (): boolean => {
		let isValid = true;
		// Reset errors
		(Object.keys(errors) as Array<keyof typeof errors>).forEach((key) => {
			errors[key] = '';
		});

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
		} else if (formData.client.trim().split(' ').length < 1) {
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

		return isValid;
	};

	const handleSubmit = () => {
		if (validate()) {
			// dataToSubmit agora está limpo, conforme a interface ProjectData atualizada
			const dataToSubmit: ProjectData = {
				name: formData.name.trim(),
				client: formData.client.trim(),
				startDate: formData.startDate,
				endDate: formData.endDate,
				isFavorite: formData.isFavorite,
			};
			emit('submit', dataToSubmit);
		}
	};

	// Todos os métodos relacionados a manipulação de arquivos e imagens foram removidos.
</script>

<style scoped>
	/* Estilos específicos para este formulário, se necessário */
	/* Ex: .form-checkbox { ... } se precisar de customização além do Tailwind padrão */
</style>
