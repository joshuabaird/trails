<!-- Route Detail Page -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { RouteCategory } from '$lib/types';
	import { formatDistance, formatElevation } from '$lib/utils';
	import Badge from '$lib/components/Badge.svelte';
	import RouteMap from '$lib/components/RouteMap.svelte';

	let { data }: { data: PageData } = $props();
	const route = $derived(data.route);

	const categoryLabels: Record<RouteCategory, string> = {
		road: 'Road',
		gravel: 'Gravel',
		mountain: 'Mountain'
	};

	// Format field values for display (e.g., "Mixed_surface" -> "Mixed Surface")
	function formatFieldValue(value: string): string {
		return value
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

</script>

<svelte:head>
	<title>{route.name} - Trail Routes</title>
	<meta name="description" content={route.description || `${route.name} cycling route`} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-forest-50 via-earth-50 to-trail-50">
	<!-- Header with gradient background -->
	<div class="relative bg-gradient-to-br from-forest-700 via-forest-600 to-earth-700 border-b-4 border-forest-500/30">
		<!-- Decorative pattern overlay -->
		<div class="absolute inset-0 opacity-10">
			<div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;"></div>
		</div>
		
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<a 
				href="/"
				class="inline-flex items-center text-sm text-forest-100 hover:text-white mb-6 transition-colors"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Routes
			</a>
			
			<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
				<div class="flex-1">
					<div class="flex items-center gap-3 mb-3">
						<span class="inline-flex items-center px-3 py-1 rounded text-sm font-semibold uppercase tracking-wide bg-forest-500/60 text-forest-50 border border-forest-400/40 backdrop-blur-sm">
							{categoryLabels[route.category as RouteCategory]}
						</span>
						{#if route.difficulty}
							<span class="text-sm text-forest-100 capitalize font-medium">
								{route.difficulty}
							</span>
						{/if}
					</div>
					<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
						{route.name}
					</h1>
					{#if route.locality || route.administrative_area}
						<p class="text-lg text-forest-100">
							{#if route.locality}{route.locality}{/if}
							{#if route.locality && route.administrative_area}, {/if}
							{#if route.administrative_area}{route.administrative_area}{/if}
						</p>
					{/if}
				</div>
				
				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row gap-3 lg:pt-8">
					<!-- View on RideWithGPS Button -->
					<a
						href={route.html_url || `https://ridewithgps.com/routes/${route.id}`}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center justify-center px-5 py-3 bg-white text-forest-700 font-semibold rounded-lg hover:bg-forest-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
					>
						<svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
						View on RWGPS
					</a>

					<!-- Download GPX Button -->
					<a
						href={route.track_download_url || `https://ridewithgps.com/routes/${route.id}.gpx`}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center justify-center px-5 py-3 bg-forest-800/40 text-white font-semibold rounded-lg border-2 border-forest-400/50 hover:bg-forest-800/60 backdrop-blur-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
					>
						<svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						Download GPX
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			
			<!-- Map Section -->
			<div class="lg:col-span-2">
				<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-forest-200/50">
					<h2 class="text-xl font-semibold text-forest-900 mb-4">Route Map</h2>
					<RouteMap {route} />
				</div>
			</div>

			<!-- Info Sidebar -->
			<div class="space-y-6">
				
				<!-- Key Stats -->
				<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-forest-200/50">
					<h2 class="text-xl font-semibold text-forest-900 mb-4">Key Stats</h2>
					<dl class="space-y-4">
						<div class="flex justify-between items-center py-3 border-b border-forest-100">
							<dt class="text-lg font-medium text-earth-600">Distance</dt>
							<dd class="text-lg font-semibold text-forest-900">{formatDistance(route.distance)}</dd>
						</div>
						<div class="flex justify-between items-center py-3 border-b border-forest-100">
							<dt class="text-lg font-medium text-earth-600">Elevation Gain</dt>
							<dd class="text-lg font-semibold text-forest-900">{formatElevation(route.elevation_gain)}</dd>
						</div>
						{#if route.elevation_loss}
							<div class="flex justify-between items-center py-3 border-b border-forest-100">
								<dt class="text-lg font-medium text-earth-600">Elevation Loss</dt>
								<dd class="text-lg font-semibold text-forest-900">{formatElevation(route.elevation_loss)}</dd>
							</div>
						{/if}
						{#if route.terrain}
							<div class="flex justify-between items-center py-3 border-b border-forest-100">
								<dt class="text-lg font-medium text-earth-600">Terrain</dt>
								<dd class="text-lg font-medium text-forest-900">{formatFieldValue(route.terrain)}</dd>
							</div>
						{/if}
						{#if route.surface}
							<div class="flex justify-between items-center py-3 border-b border-forest-100">
								<dt class="text-lg font-medium text-earth-600">Surface</dt>
								<dd class="text-lg font-medium text-forest-900">{formatFieldValue(route.surface)}</dd>
							</div>
						{/if}
						{#if route.track_type}
							<div class="flex justify-between items-center py-3">
								<dt class="text-lg font-medium text-earth-600">Type</dt>
								<dd class="text-lg font-medium text-forest-900">{formatFieldValue(route.track_type)}</dd>
							</div>
						{/if}
					</dl>
				</div>

				<!-- Badges -->
				{#if route.badges && route.badges.length > 0}
					<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-forest-200/50">
						<h2 class="text-xl font-semibold text-forest-900 mb-4">Route Tags</h2>
						<div class="flex flex-wrap gap-2">
							{#each route.badges as badge}
								<Badge type={badge} size="md" />
							{/each}
						</div>
					</div>
				{/if}

				<!-- Description -->
				{#if route.description}
					<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-forest-200/50">
						<h2 class="text-xl font-semibold text-forest-900 mb-4">Description</h2>
						<p class="text-earth-700 leading-relaxed">{route.description}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
