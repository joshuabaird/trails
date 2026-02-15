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

</script>

<svelte:head>
	<title>{route.name} - Trail Routes</title>
	<meta name="description" content={route.description || `${route.name} cycling route`} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-trail-50 to-white">
	<!-- Header -->
	<div class="bg-white border-b border-trail-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<a 
				href="/"
				class="inline-flex items-center text-sm text-forest-600 hover:text-forest-800 mb-4"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Routes
			</a>
			
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<div class="flex items-center gap-3 mb-2">
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-forest-100 text-forest-800 border border-forest-200">
							{categoryLabels[route.category as RouteCategory]}
						</span>
						{#if route.difficulty}
							<span class="text-sm text-earth-600 capitalize">
								{route.difficulty}
							</span>
						{/if}
					</div>
					<h1 class="text-3xl md:text-4xl font-bold text-forest-900 mb-2">
						{route.name}
					</h1>
					{#if route.locality || route.administrative_area}
						<p class="text-lg text-earth-600">
							{#if route.locality}{route.locality}{/if}
							{#if route.locality && route.administrative_area}, {/if}
							{#if route.administrative_area}{route.administrative_area}{/if}
						</p>
					{/if}
				</div>
				
				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row gap-3">
					<!-- View on RideWithGPS Button -->
					<a
						href={route.html_url || `https://ridewithgps.com/routes/${route.id}`}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center justify-center px-5 py-3 bg-forest-600 text-white font-medium rounded-lg hover:bg-forest-700 transition-colors shadow-md"
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
						class="inline-flex items-center justify-center px-5 py-3 bg-white text-forest-700 font-medium rounded-lg border-2 border-forest-600 hover:bg-forest-50 transition-colors shadow-sm"
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
				<div class="bg-white rounded-lg shadow-md p-6">
					<h2 class="text-xl font-semibold text-forest-900 mb-4">Route Map</h2>
					<RouteMap {route} />
				</div>
			</div>

			<!-- Info Sidebar -->
			<div class="space-y-6">
				
				<!-- Key Stats -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<h2 class="text-xl font-semibold text-forest-900 mb-4">Key Stats</h2>
					<dl class="space-y-4">
						<div class="flex justify-between items-center py-3 border-b border-trail-100">
							<dt class="text-sm font-medium text-earth-600">Distance</dt>
							<dd class="text-lg font-semibold text-forest-900">{formatDistance(route.distance)}</dd>
						</div>
						<div class="flex justify-between items-center py-3 border-b border-trail-100">
							<dt class="text-sm font-medium text-earth-600">Elevation Gain</dt>
							<dd class="text-lg font-semibold text-forest-900">{formatElevation(route.elevation_gain)}</dd>
						</div>
						{#if route.elevation_loss}
							<div class="flex justify-between items-center py-3 border-b border-trail-100">
								<dt class="text-sm font-medium text-earth-600">Elevation Loss</dt>
								<dd class="text-lg font-semibold text-forest-900">{formatElevation(route.elevation_loss)}</dd>
							</div>
						{/if}
						{#if route.terrain}
							<div class="flex justify-between items-center py-3 border-b border-trail-100">
								<dt class="text-sm font-medium text-earth-600">Terrain</dt>
								<dd class="text-base font-medium text-forest-900 capitalize">{route.terrain}</dd>
							</div>
						{/if}
						{#if route.surface}
							<div class="flex justify-between items-center py-3 border-b border-trail-100">
								<dt class="text-sm font-medium text-earth-600">Surface</dt>
								<dd class="text-base font-medium text-forest-900 capitalize">{route.surface}</dd>
							</div>
						{/if}
						{#if route.track_type}
							<div class="flex justify-between items-center py-3">
								<dt class="text-sm font-medium text-earth-600">Type</dt>
								<dd class="text-base font-medium text-forest-900 capitalize">{route.track_type}</dd>
							</div>
						{/if}
					</dl>
				</div>

				<!-- Badges -->
				{#if route.badges && route.badges.length > 0}
					<div class="bg-white rounded-lg shadow-md p-6">
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
					<div class="bg-white rounded-lg shadow-md p-6">
						<h2 class="text-xl font-semibold text-forest-900 mb-4">Description</h2>
						<p class="text-earth-700 leading-relaxed">{route.description}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
