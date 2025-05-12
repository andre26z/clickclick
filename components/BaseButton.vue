<template>
	<NuxtLink
		v-if="to"
		:to="to"
		:class="buttonClasses"
		:aria-disabled="disabled"
		:disabled="disabled"
	>
		<slot />
	</NuxtLink>
	<button
		v-else
		:type="type"
		:class="buttonClasses"
		:disabled="disabled"
		@click="$emit('click', $event)"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
	import { computed } from 'vue';

	type ButtonType = 'button' | 'submit' | 'reset';
	type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

	const props = withDefaults(
		defineProps<{
			type?: ButtonType;
			variant?: ButtonVariant;
			disabled?: boolean;
			to?: string | object;
		}>(),
		{
			type: 'button',
			variant: 'primary',
			disabled: false,
			to: undefined,
		}
	);

	defineEmits(['click']);

	const baseClasses =
		'border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out';

	const variantClasses = computed(() => {
		switch (props.variant) {
			case 'primary':
				return 'bg-purple-700 hover:bg-purple-600 text-white border-transparent focus:ring-purple-700 px-4 py-2 shadow-sm';
			case 'secondary':
				return 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 focus:ring-purple-700 px-4 py-2 shadow-sm';
			case 'danger':
				return 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500 px-4 py-2 shadow-sm';
			case 'link':
				return 'text-purple-700 underline px-1 py-1 border-transparent focus:ring-purple-700';
			default:
				return 'bg-purple-700 hover:bg-purple-600 text-white border-transparent focus:ring-purple-700 px-4 py-2 shadow-sm';
		}
	});

	const buttonClasses = computed(() => `${baseClasses} ${variantClasses.value}`);
</script>
