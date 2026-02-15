<!-- Route Card Component - displays a single route in list view -->
<script lang="ts">
	import type { EnhancedRoute } from '$lib/types';
	import { formatDistance, formatElevation } from '$lib/utils';
	import Badge from './Badge.svelte';
	import { onMount } from 'svelte';

	interface Props {
		route: EnhancedRoute;
		featured?: boolean;
		index?: number; // For staggered animation
		showCategory?: boolean; // Show category badge (for "All Routes" view)
	}

	let { route, featured = false, index = 0, showCategory = false }: Props = $props();
	
	// Check if route is featured (from badge or prop)
	const isFeatured = $derived(featured || route.badges.includes('featured'));

	// Animation state
	let isVisible = $state(false);

	onMount(() => {
		// Trigger animation after a slight delay based on index
		setTimeout(() => {
			isVisible = true;
		}, index * 50); // 50ms stagger between cards
	});
</script>

<a 
	href="/routes/{route.category}/{route.id}"
	class="block bg-white hover:bg-trail-100/60 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border {
		isFeatured 
			? 'border-forest-400 ring-2 ring-forest-400/30' 
			: 'border-trail-200 hover:border-forest-400'
	} relative card-entrance {isVisible ? 'visible' : ''}"
>
	<!-- Featured Badge -->
	{#if isFeatured}
		<div class="absolute top-3 right-3 z-10">
			<div class="relative group">
				<!-- Badge circle with subtle shadow -->
				<div class="w-9 h-9 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 shadow-lg flex items-center justify-center ring-2 ring-white transition-transform group-hover:scale-110">
					<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				</div>
				<!-- Tooltip on hover -->
				<div class="absolute top-full right-0 mt-2 px-2 py-1 bg-forest-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
					Featured Route
				</div>
			</div>
		</div>
	{/if}

	<div class="p-6">
		<!-- Category Badge (Only shown when needed - e.g., "All Routes" tab) -->
		{#if showCategory}
			<div class="mb-3">
				<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold border {
					route.category === 'road' ? 'bg-blue-50 text-blue-700 border-blue-200' :
					route.category === 'gravel' ? 'bg-amber-50 text-amber-700 border-amber-200' :
					'bg-emerald-50 text-emerald-700 border-emerald-200'
				}">
					<span class="mr-1.5">
						{route.category === 'road' ? '🚴' : route.category === 'gravel' ? '🚵' : '⛰️'}
					</span>
					{route.category === 'road' ? 'Road' : route.category === 'gravel' ? 'Gravel' : 'Mountain'}
				</span>
			</div>
		{/if}

		<!-- Route Name -->
		<div class="mb-3">
			<h3 class="text-xl font-semibold text-forest-900 mb-1 hover:text-forest-600 transition-colors">
				{route.name}
			</h3>
		</div>

		<!-- Stats -->
		<div class="flex gap-6 mb-4 text-sm">
			<div class="flex items-center gap-2">
				<svg class="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
				</svg>
				<span class="text-earth-900 font-medium">{formatDistance(route.distance)}</span>
			</div>
			<div class="flex items-center gap-2">
				<svg class="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
				</svg>
				<span class="text-earth-900 font-medium">{formatElevation(route.elevation_gain)}</span>
			</div>
		</div>

		<!-- Description -->
		{#if route.description}
			<p class="text-earth-700 text-sm mb-4 line-clamp-2">
				{route.description}
			</p>
		{/if}

		<!-- Badges -->
		{#if route.badges && route.badges.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each route.badges as badge}
					<Badge type={badge} size="sm" />
				{/each}
			</div>
		{/if}
	</div>
</a>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Entrance animation */
	.card-entrance {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.card-entrance.visible {
		opacity: 1;
		transform: translateY(0);
	}
</style>
