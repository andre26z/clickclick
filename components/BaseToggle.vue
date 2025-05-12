<template>
	<BaseButton
		type="button"
		role="switch"
		:aria-checked="modelValue"
		:class="[
			'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary',
			modelValue ? activeBgClass : inactiveBgClass, // Usa as classes de cor corretas
			disabled ? 'opacity-50 cursor-not-allowed' : '',
		]"
		:disabled="disabled"
		@click="toggle"
	>
		<span class="sr-only">{{ accessibleLabel }}</span>
		<span
			aria-hidden="true"
			:class="[
				'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
				modelValue ? 'translate-x-5' : 'translate-x-0', // Movimenta o círculo
			]"
		/>
	</BaseButton>
</template>

<script setup lang="ts">
	import { computed } from 'vue';

	const props = withDefaults(
		defineProps<{
			modelValue: boolean; // For v-model
			disabled?: boolean;
			activeBgClass?: string; // Permite customizar cor ativa
			inactiveBgClass?: string; // Permite customizar cor inativa
			accessibleLabel?: string; // Para leitores de tela
		}>(),
		{
			disabled: false,
			activeBgClass: 'bg-orange-400', // Cor laranja/amarela vista no mockup de favoritos ativos
			inactiveBgClass: 'bg-gray-300', // Cor cinza padrão quando inativo
			accessibleLabel: 'Toggle',
		}
	);

	const emit = defineEmits(['update:modelValue']);

	const toggle = () => {
		if (!props.disabled) {
			emit('update:modelValue', !props.modelValue);
		}
	};
</script>
