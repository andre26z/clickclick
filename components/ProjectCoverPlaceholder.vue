<template>
	<div
		class="flex items-center justify-center overflow-hidden"
		:style="{ backgroundImage: gradientStyle, width: '100%', height: '100%' }"
	>
		<span
			class="text-center font-semibold text-white p-2 break-words"
			:style="{ fontSize: 'clamp(1rem, 5vw, 1.75rem)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }"
		>
			{{ projectName }}
		</span>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue';

	const props = defineProps<{
		projectName: string;
		projectId?: string; // Optional seed for deterministic gradient
	}>();

	const color1 = ref('#CCCCCC');
	const color2 = ref('#AAAAAA');

	// Simple Pseudo-Random Number Generator (PRNG) - Mulberry32
	function mulberry32(seed: number) {
		return function () {
			seed |= 0;
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	// Simple string hash to seed the PRNG
	function simpleStringHash(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	// Predefined pleasant color palettes (pair of [startColor, endColor])
	const gradientPalettes = [
		['#ff9a9e', '#fad0c4'], // Light Pink to Peach
		['#a18cd1', '#fbc2eb'], // Lavender to Pink
		['#84fab0', '#8fd3f4'], // Light Green to Light Blue
		['#fccb90', '#d57eeb'], // Orange to Purple
		['#e0c3fc', '#8ec5fc'], // Light Purple to Light Blue
		['#4facfe', '#00f2fe'], // Blue to Cyan
		['#fa709a', '#fee140'], // Pink to Yellow
		['#667eea', '#764ba2'], // Indigo to Dark Purple
		['#ffdde1', '#ee9ca7'], // Pale Pink to Dusty Rose
		['#00c6fb', '#005bea'], // Bright Blue to Dark Blue
	];

	function generateGradientColors() {
		let randomIndex;
		if (props.projectId) {
			const seed = simpleStringHash(props.projectId);
			const random = mulberry32(seed);
			randomIndex = Math.floor(random() * gradientPalettes.length);
		} else {
			randomIndex = Math.floor(Math.random() * gradientPalettes.length);
		}
		const selectedPalette = gradientPalettes[randomIndex];
		color1.value = selectedPalette[0];
		color2.value = selectedPalette[1];
	}

	onMounted(() => {
		generateGradientColors();
	});

	const gradientStyle = computed(() => {
		// Generate a random angle for the gradient for more variety
		const angle = props.projectId
			? simpleStringHash(props.projectId) % 360
			: Math.floor(Math.random() * 360);
		return `linear-gradient(${angle}deg, ${color1.value}, ${color2.value})`;
	});
</script>

<style scoped>
	/* Ensure the component itself takes up the space defined by its parent or props */
	div {
		width: 100%;
		height: 100%;
	}
	.break-words {
		word-break: break-word; /* Fallback for older browsers if needed */
		overflow-wrap: break-word;
		hyphens: auto; /* Optional: for better word breaking */
	}
</style>
