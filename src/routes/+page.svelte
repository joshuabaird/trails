<!-- Main Page - Trail Routes -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { EnhancedRoute, BadgeType } from '$lib/types';
	import RouteCard from '$lib/components/RouteCard.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';
	import FeaturedRoutes from '$lib/components/FeaturedRoutes.svelte';
	import { getAllBadgeInfo } from '$lib/utils';

	let { data }: { data: PageData } = $props();

	let activeTab = $state<'all' | 'road' | 'gravel' | 'mountain'>('all');
	let searchQuery = $state('');
	let selectedBadges = $state<BadgeType[]>([]);
	let showFilters = $state(false);

	const tabs = [
		{ id: 'all' as const, label: 'All Routes', icon: '🗺️' },
		{ id: 'road' as const, label: 'Road', icon: '🚴' },
		{ id: 'gravel' as const, label: 'Gravel', icon: '🚵' },
		{ id: 'mountain' as const, label: 'Mountain', icon: '⛰️' }
	];

	// Get all available badges for filters
	const availableBadges = getAllBadgeInfo();

	// Filter routes based on search and badge filters
	const getFilteredRoutes = () => {
		// Get routes based on active tab
		let routes: EnhancedRoute[];
		if (activeTab === 'all') {
			// Combine all routes from all categories
			routes = [
				...data.routes.road,
				...data.routes.gravel,
				...data.routes.mountain
			];
		} else {
			routes = data.routes[activeTab] || [];
		}

		// Apply text search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			routes = routes.filter((route: EnhancedRoute) => {
				const searchableText = [
					route.name,
					route.description || '',
					route.locality || '',
					route.administrative_area || ''
				].join(' ').toLowerCase();
				
				return searchableText.includes(query);
			});
		}

		// Apply badge filters
		if (selectedBadges.length > 0) {
			routes = routes.filter((route: EnhancedRoute) => {
				// Route must have ALL selected badges
				return selectedBadges.every(badge => route.badges.includes(badge));
			});
		}

		return routes;
	};

	const toggleBadgeFilter = (badgeType: BadgeType) => {
		if (selectedBadges.includes(badgeType)) {
			selectedBadges = selectedBadges.filter(b => b !== badgeType);
		} else {
			selectedBadges = [...selectedBadges, badgeType];
		}
	};

	const clearFilters = () => {
		searchQuery = '';
		selectedBadges = [];
	};

	const hasActiveFilters = $derived(searchQuery.trim() !== '' || selectedBadges.length > 0);
	const filteredRoutes = $derived(getFilteredRoutes());
</script>

<svelte:head>
	<title>Boyle County Trails - Discover Your Next Ride</title>
	<meta name="description" content="Discover popular cycling routes for road, gravel, and mountain biking." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-forest-50 via-white to-earth-50">
	<!-- Hero Section -->
	<div class="relative bg-gradient-to-br from-forest-800 via-forest-700 to-earth-800 text-white overflow-hidden">
		<!-- Decorative background pattern -->
		<div class="absolute inset-0 opacity-10">
			<svg class="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
						<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#grid)" />
			</svg>
		</div>
		
		<!-- Decorative gradient orbs with animation -->
		<div class="absolute -top-24 -right-24 w-96 h-96 bg-forest-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
		<div class="absolute -bottom-24 -left-24 w-96 h-96 bg-trail-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-delayed"></div>
		
		<!-- Decorative tree silhouettes on left side -->
		<div class="absolute left-0 bottom-0 opacity-15 hidden md:block">
			<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
				<!-- Row of pine trees - varying heights -->
				<path d="M40,350 L50,320 L30,320 L40,290 L25,290 L40,250 L55,290 L40,290 L50,320 L60,320 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M80,370 L90,340 L70,340 L80,310 L65,310 L80,270 L95,310 L80,310 L90,340 L100,340 Z" fill="currentColor" class="text-forest-500"/>
				<path d="M120,360 L130,330 L110,330 L120,300 L105,300 L120,260 L135,300 L120,300 L130,330 L140,330 Z" fill="currentColor" class="text-forest-700"/>
				<path d="M160,345 L170,315 L150,315 L160,285 L145,285 L160,245 L175,285 L160,285 L170,315 L180,315 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M200,365 L210,335 L190,335 L200,305 L185,305 L200,265 L215,305 L200,305 L210,335 L220,335 Z" fill="currentColor" class="text-forest-500"/>
				<path d="M240,355 L250,325 L230,325 L240,295 L225,295 L240,255 L255,295 L240,295 L250,325 L260,325 Z" fill="currentColor" class="text-forest-700"/>
				<!-- Second row - smaller trees in front -->
				<path d="M60,380 L65,365 L55,365 L60,350 L52,350 L60,330 L68,350 L60,350 L65,365 L70,365 Z" fill="currentColor" class="text-forest-800"/>
				<path d="M140,385 L145,370 L135,370 L140,355 L132,355 L140,335 L148,355 L140,355 L145,370 L150,370 Z" fill="currentColor" class="text-forest-800"/>
				<path d="M220,382 L225,367 L215,367 L220,352 L212,352 L220,332 L228,352 L220,352 L225,367 L230,367 Z" fill="currentColor" class="text-forest-900"/>
			</svg>
		</div>
		
		<!-- Decorative tree silhouettes on right side -->
		<div class="absolute right-0 bottom-0 opacity-15 hidden md:block">
			<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
				<!-- Row of pine trees - varying heights -->
				<path d="M240,350 L250,320 L230,320 L240,290 L225,290 L240,250 L255,290 L240,290 L250,320 L260,320 Z" fill="currentColor" class="text-forest-700"/>
				<path d="M200,370 L210,340 L190,340 L200,310 L185,310 L200,270 L215,310 L200,310 L210,340 L220,340 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M160,360 L170,330 L150,330 L160,300 L145,300 L160,260 L175,300 L160,300 L170,330 L180,330 Z" fill="currentColor" class="text-forest-500"/>
				<path d="M120,345 L130,315 L110,315 L120,285 L105,285 L120,245 L135,285 L120,285 L130,315 L140,315 Z" fill="currentColor" class="text-forest-700"/>
				<path d="M80,365 L90,335 L70,335 L80,305 L65,305 L80,265 L95,305 L80,305 L90,335 L100,335 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M40,355 L50,325 L30,325 L40,295 L25,295 L40,255 L55,295 L40,295 L50,325 L60,325 Z" fill="currentColor" class="text-forest-500"/>
				<!-- Second row - smaller trees in front -->
				<path d="M220,380 L225,365 L215,365 L220,350 L212,350 L220,330 L228,350 L220,350 L225,365 L230,365 Z" fill="currentColor" class="text-forest-900"/>
				<path d="M140,385 L145,370 L135,370 L140,355 L132,355 L140,335 L148,355 L140,355 L145,370 L150,370 Z" fill="currentColor" class="text-forest-800"/>
				<path d="M60,382 L65,367 L55,367 L60,352 L52,352 L60,332 L68,352 L60,352 L65,367 L70,367 Z" fill="currentColor" class="text-forest-800"/>
			</svg>
		</div>
		
		<!-- Scattered trees in background - mobile visible -->
		<div class="absolute left-4 top-1/2 opacity-10">
			<svg width="60" height="80" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
				<path d="M30,70 L35,55 L25,55 L30,40 L22,40 L30,20 L38,40 L30,40 L35,55 L40,55 Z" fill="currentColor" class="text-forest-600"/>
			</svg>
		</div>
		<div class="absolute right-8 top-1/3 opacity-10">
			<svg width="70" height="90" viewBox="0 0 70 90" xmlns="http://www.w3.org/2000/svg">
				<path d="M35,80 L40,65 L30,65 L35,50 L27,50 L35,30 L43,50 L35,50 L40,65 L45,65 Z" fill="currentColor" class="text-forest-700"/>
			</svg>
		</div>
		<div class="absolute left-1/4 top-20 opacity-8 hidden sm:block">
			<svg width="50" height="70" viewBox="0 0 50 70" xmlns="http://www.w3.org/2000/svg">
				<path d="M25,60 L30,45 L20,45 L25,30 L17,30 L25,10 L33,30 L25,30 L30,45 L35,45 Z" fill="currentColor" class="text-forest-500"/>
			</svg>
		</div>
		<div class="absolute right-1/4 top-16 opacity-8 hidden sm:block">
			<svg width="55" height="75" viewBox="0 0 55 75" xmlns="http://www.w3.org/2000/svg">
				<path d="M27,65 L32,50 L22,50 L27,35 L19,35 L27,15 L35,35 L27,35 L32,50 L37,50 Z" fill="currentColor" class="text-forest-600"/>
			</svg>
		</div>
		
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 z-10">
			<div class="text-center">
				<!-- Cyclist Icon/Badge -->
				<div class="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-forest-500/60 backdrop-blur-sm border border-forest-300/40 shadow-lg hero-icon">
					<span class="text-5xl">🚴</span>
				</div>
				
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
					<span class="block hero-text-1">Discover Your Next</span>
					<span class="block hero-text-2">
						<span class="bg-gradient-to-r from-forest-200 via-trail-100 to-forest-100 bg-clip-text text-transparent">
							Adventure in <span class="font-extrabold">Boyle County</span>
						</span>
					</span>
				</h1>
				
				<p class="text-lg md:text-xl text-forest-50 max-w-3xl mx-auto leading-relaxed mb-8 hero-text-3">
					Curated cycling routes across Boyle and surrounding counties
				</p>
				
				<!-- Stats or features -->
				<div class="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base hero-features">
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-forest-300 animate-pulse-slow"></div>
						<span class="text-forest-100">Road</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-trail-300 animate-pulse-slow" style="animation-delay: 0.5s;"></div>
						<span class="text-forest-100">Gravel</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-forest-400 animate-pulse-slow" style="animation-delay: 1s;"></div>
						<span class="text-forest-100">Mountain</span>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Mountain and nature silhouettes at bottom -->
		<div class="absolute bottom-0 left-0 right-0">
			<!-- Mountains -->
			<svg class="w-full h-32 md:h-40" viewBox="0 0 1200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
				<!-- Back mountain range -->
				<path d="M0,120 L200,60 L400,100 L600,40 L800,80 L1000,60 L1200,100 L1200,200 L0,200 Z" 
					fill="rgba(45, 110, 78, 0.3)" class="animate-mountain-1"/>
				<!-- Front mountain range -->
				<path d="M0,150 L150,90 L300,130 L500,70 L700,110 L900,90 L1050,120 L1200,140 L1200,200 L0,200 Z" 
					fill="rgba(45, 110, 78, 0.5)" class="animate-mountain-2"/>
				<!-- Foreground trees/forest -->
				<path d="M0,160 L50,140 L80,155 L150,135 L200,150 L280,130 L350,145 L450,125 L550,140 L650,130 L750,145 L850,135 L950,150 L1050,140 L1150,155 L1200,145 L1200,200 L0,200 Z" 
					fill="rgba(45, 110, 78, 0.7)"/>
			</svg>
		</div>
		
		<!-- Subtle gradient fade that blends mountains into content -->
		<div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-forest-50/60 pointer-events-none"></div>
	</div>

	<!-- Featured Routes Section (Full Width) -->
	<FeaturedRoutes routes={data.routes} />

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		
		<!-- Error Message -->
		{#if data.error}
			<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
				<p class="font-medium">Unable to load routes</p>
				<p class="text-sm">{data.error}</p>
			</div>
		{/if}

		<!-- Category Tabs -->
		<div class="mb-6">
			<div class="border-b border-forest-200">
				<nav class="flex space-x-8" aria-label="Route categories">
					{#each tabs as tab}
						<button
							onclick={() => activeTab = tab.id}
							class="
								py-4 px-1 border-b-2 font-medium text-sm transition-colors
								{activeTab === tab.id 
									? 'border-forest-500 text-forest-700' 
									: 'border-transparent text-earth-500 hover:text-forest-600 hover:border-forest-300'}
							"
						>
							<span class="mr-2">{tab.icon}</span>
							{tab.label}
							<span class="ml-2 py-0.5 px-2 rounded-full text-xs bg-forest-100 text-forest-700">
								{#if tab.id === 'all'}
									{data.routes.road.length + data.routes.gravel.length + data.routes.mountain.length}
								{:else}
									{data.routes[tab.id]?.length || 0}
								{/if}
							</span>
						</button>
					{/each}
				</nav>
			</div>
		</div>

		<!-- Search and Filter Section -->
		<div class="mb-8">
			<!-- Search Bar -->
			<div class="flex flex-col sm:flex-row gap-4 mb-4">
				<div class="flex-1 relative">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<svg class="h-5 w-5 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search routes by name, location, or description..."
						class="block w-full pl-10 pr-3 py-3 border border-forest-300 bg-white text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
					/>
				</div>
				
				<button
					onclick={() => showFilters = !showFilters}
					class="inline-flex items-center justify-center px-4 py-3 border border-forest-300 bg-white text-forest-700 font-medium hover:bg-forest-50 focus:outline-none focus:ring-2 focus:ring-forest-500 transition-colors"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
					</svg>
					Filter by Badges
					{#if selectedBadges.length > 0}
						<span class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-forest-600 rounded-full">
							{selectedBadges.length}
						</span>
					{/if}
				</button>

				{#if hasActiveFilters}
					<button
						onclick={clearFilters}
						class="inline-flex items-center justify-center px-4 py-3 border border-earth-300 bg-white text-earth-600 font-medium hover:bg-earth-50 transition-colors"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
						Clear
					</button>
				{/if}
			</div>

			<!-- Badge Filters -->
			{#if showFilters}
				<div class="p-4 border border-forest-200 bg-forest-50/40">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold text-forest-900">Filter by Badge</h3>
						<span class="text-xs text-earth-600">Select badges to show routes with ALL selected badges</span>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each availableBadges as badgeInfo}
							<button
								onclick={() => toggleBadgeFilter(badgeInfo.type)}
								class="inline-flex items-center px-3 py-1.5 border text-sm font-medium transition-all {
									selectedBadges.includes(badgeInfo.type)
										? 'border-forest-600 bg-forest-600 text-white shadow-sm'
										: `${badgeInfo.color} hover:opacity-80`
								}"
							>
								{#if selectedBadges.includes(badgeInfo.type)}
									<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
								{/if}
								{badgeInfo.label}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Results Count -->
			{#if hasActiveFilters}
				<div class="mt-4 text-sm text-earth-600">
					{#if activeTab === 'all'}
						Showing {filteredRoutes.length} of {data.routes.road.length + data.routes.gravel.length + data.routes.mountain.length} routes
					{:else}
						Showing {filteredRoutes.length} of {data.routes[activeTab]?.length || 0} {activeTab} routes
					{/if}
				</div>
			{/if}
		</div>

		<!-- Routes Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#if filteredRoutes.length === 0}
				<!-- Empty State -->
				<div class="col-span-full text-center py-16">
					{#if hasActiveFilters}
						<!-- No results for filters -->
						<svg class="w-16 h-16 mx-auto mb-4 text-earth-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<h3 class="text-xl font-medium text-earth-900 mb-2">
							No routes match your filters
						</h3>
						<p class="text-earth-600 mb-4">
							Try adjusting your search or removing some badge filters.
						</p>
						<button
							onclick={clearFilters}
							class="inline-flex items-center px-4 py-2 bg-forest-600 text-white font-medium hover:bg-forest-700 transition-colors"
						>
							Clear All Filters
						</button>
					{:else}
						<!-- No routes in category -->
						<div class="text-6xl mb-4">{tabs.find(t => t.id === activeTab)?.icon}</div>
						<h3 class="text-xl font-medium text-earth-900 mb-2">
							{#if activeTab === 'all'}
								No routes available
							{:else}
								No {activeTab} routes yet
							{/if}
						</h3>
						<p class="text-earth-600">
							{#if activeTab === 'all'}
								Check back soon for new routes!
							{:else}
								Add routes to your {activeTab} collection to see them here.
							{/if}
						</p>
					{/if}
				</div>
			{:else}
				{#each filteredRoutes as route, i (route.id)}
					<RouteCard {route} index={i} showCategory={activeTab === 'all'} />
				{/each}
			{/if}
		</div>

		<!-- View More (if there are more routes) -->
		{#if filteredRoutes.length >= 10 && !hasActiveFilters && activeTab !== 'all'}
			<div class="mt-12 text-center">
				<a 
					href="/routes/{activeTab}"
					class="inline-flex items-center px-6 py-3 border border-forest-600 text-base font-medium rounded-md text-forest-700 bg-white hover:bg-forest-50 transition-colors"
				>
					View All {tabs.find(t => t.id === activeTab)?.label} Routes
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Hero animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(20px, -20px);
		}
	}

	@keyframes pulseSlow {
		0%, 100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
	}

	@keyframes mountainSway1 {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	@keyframes mountainSway2 {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	/* Apply animations to hero elements */
	:global(.hero-icon) {
		animation: fadeInUp 0.8s ease-out 0.2s both;
	}

	:global(.hero-text-1) {
		animation: fadeInUp 0.8s ease-out 0.4s both;
	}

	:global(.hero-text-2) {
		animation: fadeInUp 0.8s ease-out 0.6s both;
	}

	:global(.hero-text-3) {
		animation: fadeInUp 0.8s ease-out 0.8s both;
	}

	:global(.hero-features) {
		animation: fadeInUp 0.8s ease-out 1s both;
	}

	:global(.animate-float) {
		animation: float 20s ease-in-out infinite;
	}

	:global(.animate-float-delayed) {
		animation: float 20s ease-in-out infinite 10s;
	}

	:global(.animate-pulse-slow) {
		animation: pulseSlow 3s ease-in-out infinite;
	}

	:global(.animate-mountain-1) {
		animation: mountainSway1 15s ease-in-out infinite;
	}

	:global(.animate-mountain-2) {
		animation: mountainSway2 12s ease-in-out infinite;
	}
</style>
