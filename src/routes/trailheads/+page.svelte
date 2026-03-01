<!-- Trailheads Page -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { Trailhead } from '$lib/types';
	import TrailheadMap from '$lib/components/TrailheadMap.svelte';
	import { fly, fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	let selectedTrailhead = $state<Trailhead | null>(null);
	let copiedCoords = $state(false);

	function selectTrailhead(id: string) {
		selectedTrailhead = data.trailheads.find((t: Trailhead) => t.id === id) ?? null;
		copiedCoords = false;
	}

	function selectFromCard(id: string) {
		selectTrailhead(id);
		document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function clearSelection() {
		selectedTrailhead = null;
		copiedCoords = false;
	}

	async function copyCoords(lat: number, lng: number) {
		const text = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
		try {
			await navigator.clipboard.writeText(text);
			copiedCoords = true;
			setTimeout(() => (copiedCoords = false), 2000);
		} catch {
			// clipboard not available — silently ignore
		}
	}

	// --- Amenity display helpers ---
	const surfaceConfig: Record<string, string> = {
		paved:  'bg-blue-100 text-blue-800 border-blue-200',
		gravel: 'bg-earth-100 text-earth-800 border-earth-200',
		dirt:   'bg-amber-100 text-amber-800 border-amber-200',
		mixed:  'bg-trail-100 text-trail-800 border-trail-200'
	};
	const surfaceIcon: Record<string, string> = {
		paved:  '🛣️',
		gravel: '🪨',
		dirt:   '🌿',
		mixed:  '⛰️'
	};
</script>

<svelte:head>
	<title>Trailheads — Boyle County Trails</title>
	<meta
		name="description"
		content="Explore Boyle County's trailheads"
	/>
</svelte:head>

<!-- Hero Section -->
	<div class="relative bg-gradient-to-b from-forest-700 to-earth-800 text-white overflow-hidden">
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
				<path d="M40,350 L50,320 L30,320 L40,290 L25,290 L40,250 L55,290 L40,290 L50,320 L60,320 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M80,370 L90,340 L70,340 L80,310 L65,310 L80,270 L95,310 L80,310 L90,340 L100,340 Z" fill="currentColor" class="text-forest-500"/>
				<path d="M120,360 L130,330 L110,330 L120,300 L105,300 L120,260 L135,300 L120,300 L130,330 L140,330 Z" fill="currentColor" class="text-forest-700"/>
				<path d="M160,345 L170,315 L150,315 L160,285 L145,285 L160,245 L175,285 L160,285 L170,315 L180,315 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M200,365 L210,335 L190,335 L200,305 L185,305 L200,265 L215,305 L200,305 L210,335 L220,335 Z" fill="currentColor" class="text-forest-500"/>
				<path d="M240,355 L250,325 L230,325 L240,295 L225,295 L240,255 L255,295 L240,295 L250,325 L260,325 Z" fill="currentColor" class="text-forest-700"/>
				<path d="M60,380 L65,365 L55,365 L60,350 L52,350 L60,330 L68,350 L60,350 L65,365 L70,365 Z" fill="currentColor" class="text-forest-800"/>
				<path d="M140,385 L145,370 L135,370 L140,355 L132,355 L140,335 L148,355 L140,355 L145,370 L150,370 Z" fill="currentColor" class="text-forest-800"/>
				<path d="M220,382 L225,367 L215,367 L220,352 L212,352 L220,332 L228,352 L220,352 L225,367 L230,367 Z" fill="currentColor" class="text-forest-900"/>
			</svg>
		</div>

		<!-- Decorative tree silhouettes on right side -->
		<div class="absolute right-0 bottom-0 opacity-15 hidden md:block">
			<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
				<path d="M240,350 L250,320 L230,320 L240,290 L225,290 L240,250 L255,290 L240,290 L250,320 L260,320 Z" fill="currentColor" class="text-forest-700"/>
				<path d="M200,370 L210,340 L190,340 L200,310 L185,310 L200,270 L215,310 L200,310 L210,340 L220,340 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M160,360 L170,330 L150,330 L160,300 L145,300 L160,260 L175,300 L160,300 L170,330 L180,330 Z" fill="currentColor" class="text-forest-500"/>
				<path d="M120,345 L130,315 L110,315 L120,285 L105,285 L120,245 L135,285 L120,285 L130,315 L140,315 Z" fill="currentColor" class="text-forest-700"/>
				<path d="M80,365 L90,335 L70,335 L80,305 L65,305 L80,265 L95,305 L80,305 L90,335 L100,335 Z" fill="currentColor" class="text-forest-600"/>
				<path d="M40,355 L50,325 L30,325 L40,295 L25,295 L40,255 L55,295 L40,295 L50,325 L60,325 Z" fill="currentColor" class="text-forest-500"/>
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
				<!-- Icon/Badge -->
				<div class="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-forest-500/60 backdrop-blur-sm border border-forest-300/40 shadow-lg hero-icon">
					<span class="text-5xl">🥾</span>
				</div>

				<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
					<span class="block hero-text-1">Find Your</span>
					<span class="block hero-text-2">
						<span class="bg-gradient-to-r from-forest-200 via-trail-100 to-forest-100 bg-clip-text text-transparent">
							Starting Point
						</span>
					</span>
				</h1>

				<p class="text-lg md:text-xl text-forest-50 max-w-3xl mx-auto leading-relaxed mb-8 hero-text-3">
					Explore Boyle County's Trailheads
				</p>

				<!-- Feature pills -->
				<div class="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base hero-features">
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-forest-300 animate-pulse-slow"></div>
						<span class="text-forest-100">🅿 Parking</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-trail-300 animate-pulse-slow" style="animation-delay: 0.5s;"></div>
						<span class="text-forest-100">💧 Water</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-2 h-2 rounded-full bg-forest-400 animate-pulse-slow" style="animation-delay: 1s;"></div>
						<span class="text-forest-100">🚻 Facilities</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Mountain and nature silhouettes at bottom -->
		<div class="absolute bottom-0 left-0 right-0">
			<svg class="w-full h-32 md:h-40" viewBox="0 0 1200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0,120 L200,60 L400,100 L600,40 L800,80 L1000,60 L1200,100 L1200,200 L0,200 Z"
					fill="rgba(45, 110, 78, 0.3)" class="animate-mountain-1"/>
				<path d="M0,150 L150,90 L300,130 L500,70 L700,110 L900,90 L1050,120 L1200,140 L1200,200 L0,200 Z"
					fill="rgba(45, 110, 78, 0.5)" class="animate-mountain-2"/>
				<path d="M0,160 L50,140 L80,155 L150,135 L200,150 L280,130 L350,145 L450,125 L550,140 L650,130 L750,145 L850,135 L950,150 L1050,140 L1150,155 L1200,145 L1200,200 L0,200 Z"
					fill="rgba(45, 110, 78, 0.7)"/>
			</svg>
		</div>

		<!-- Subtle gradient fade that blends mountains into content -->
		<div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-forest-50/60 pointer-events-none"></div>
	</div>

<!-- Map + Detail Section (Featured-style full-width background) -->
<section id="map-section">
	<div class="w-full bg-gradient-to-br from-earth-100 via-earth-50 to-trail-100 border-y border-earth-300/40 py-16 md:py-24 relative overflow-hidden">

		<!-- Upside-down mountain silhouettes at top -->
		<div class="absolute top-0 left-0 right-0">
			<svg class="w-full h-16 md:h-20" viewBox="0 0 1200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="transform: scaleY(-1);">
				<path d="M0,60 L150,40 L300,55 L500,30 L700,50 L900,35 L1050,45 L1200,55 L1200,100 L0,100 Z"
					fill="rgba(45, 110, 78, 0.08)"/>
				<path d="M0,70 L200,65 L400,75 L600,60 L800,70 L1000,65 L1200,72 L1200,100 L0,100 Z"
					fill="rgba(45, 110, 78, 0.12)"/>
			</svg>
		</div>

		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

			<!-- Section header -->
			<div class="mb-6 flex items-center gap-3">
				<div class="flex items-center justify-center w-10 h-10 rounded-full bg-forest-600/20 border border-forest-300/40">
					<svg class="w-5 h-5 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
					</svg>
				</div>
				<div>
					<h2 class="text-lg font-semibold text-forest-900 leading-tight">Interactive Map</h2>
					<p class="text-sm text-earth-600">Click a pin or card to explore a trailhead</p>
				</div>
			</div>

			<!-- Error State -->
			{#if data.error}
				<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
					<p class="font-medium">Unable to load trailheads</p>
					<p class="text-sm">{data.error}</p>
				</div>
			{/if}

			<!-- Map + Detail Panel -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

				<!-- Map (takes 2/3 on desktop) -->
				<div class="lg:col-span-2 relative">
					<!-- Show all button — only visible when a trailhead is selected -->
					{#if selectedTrailhead}
						<button
							onclick={clearSelection}
							class="absolute top-3 left-3 z-[1000] inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-forest-200 rounded shadow-sm text-xs font-semibold text-forest-700 hover:bg-forest-50 hover:border-forest-300 transition-colors"
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
							</svg>
							Show all
						</button>
					{/if}
					<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-forest-200/50 overflow-hidden h-full min-h-[300px] lg:min-h-[520px]">
						<TrailheadMap
							trailheads={data.trailheads}
							selectedId={selectedTrailhead?.id ?? null}
							onselect={selectTrailhead}
						/>
					</div>
				</div>

				<!-- Detail Panel (takes 1/3 on desktop; hidden on mobile when nothing selected) -->
				<div class="lg:col-span-1 {!selectedTrailhead ? 'hidden lg:block' : ''}">
					<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-forest-200/50 h-full lg:min-h-[520px] flex flex-col">
					{#if selectedTrailhead}
						<!-- Trailhead Detail -->
						<div class="p-5 flex flex-col h-full overflow-y-auto" transition:fly={{ y: 10, duration: 200, opacity: 0 }}>

								<!-- Header -->
								<div class="flex items-start justify-between gap-3 mb-4">
									<h2 class="text-lg font-bold text-forest-900 leading-snug">
										{selectedTrailhead.name}
									</h2>
									<button
										onclick={clearSelection}
										class="shrink-0 p-1 rounded text-earth-300 hover:text-earth-600 hover:bg-earth-100 transition-colors"
										aria-label="Close"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								<!-- Location block: address, coords, directions all together -->
								<div class="mb-4 space-y-2">
									{#if selectedTrailhead.address}
										<div class="flex items-start gap-2 text-sm text-earth-600">
											<svg class="w-4 h-4 mt-0.5 shrink-0 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
											<span class="leading-snug">{selectedTrailhead.address}</span>
										</div>
									{/if}

									<!-- Coords + Directions on one row -->
									<div class="flex items-center gap-3 pl-6">
										<button
											onclick={() => copyCoords(selectedTrailhead!.lat, selectedTrailhead!.lng)}
											class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs font-mono transition-colors {copiedCoords ? 'bg-forest-50 border-forest-300 text-forest-700' : 'bg-earth-50 border-earth-200 text-earth-400 hover:text-earth-600'}"
											title="Copy coordinates"
										>
											{#if copiedCoords}
												<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
												</svg>
												Copied!
											{:else}
												<svg class="w-3 h-3 text-earth-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
												{selectedTrailhead.lat.toFixed(4)}, {selectedTrailhead.lng.toFixed(4)}
											{/if}
										</button>

										{#if selectedTrailhead.address}
											<a
												href="https://maps.google.com/?q={encodeURIComponent(selectedTrailhead.address)}"
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-forest-800 hover:underline"
											>
												<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
												</svg>
												Get directions
											</a>
										{/if}
									</div>
								</div>

								<div class="border-t border-earth-100 mb-4"></div>

								<!-- Amenity badges — no label needed -->
								<div class="flex flex-wrap gap-2 mb-4">
									{#if selectedTrailhead.parking}
										<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 text-forest-700 bg-forest-50 border-forest-200">
											<span>🅿</span>Parking
										</span>
									{/if}
									<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 {selectedTrailhead.water ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-earth-400 bg-earth-50 border-earth-200'}">
										<span>💧</span>{selectedTrailhead.water ? 'Water' : 'No Water'}
									</span>
									<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 {selectedTrailhead.restrooms ? 'text-forest-700 bg-forest-50 border-forest-200' : 'text-earth-400 bg-earth-50 border-earth-200'}">
										<span>🚻</span>{selectedTrailhead.restrooms ? 'Restrooms' : 'No Restrooms'}
									</span>
								{#if selectedTrailhead.surfaceType}
									{@const surfaceClass = surfaceConfig[selectedTrailhead.surfaceType] ?? 'bg-gray-100 text-gray-800 border-gray-200'}
									{@const icon = surfaceIcon[selectedTrailhead.surfaceType] ?? '🏔️'}
									<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 {surfaceClass}">
										<span>{icon}</span>{selectedTrailhead.surfaceType}
									</span>
								{/if}
								</div>

								<!-- Description — no label -->
								{#if selectedTrailhead.description}
									<p class="text-sm text-earth-600 leading-relaxed mb-4">{selectedTrailhead.description}</p>
								{/if}

								<!-- Nearby Routes -->
								{#if selectedTrailhead.nearbyRouteIds && selectedTrailhead.nearbyRouteIds.length > 0}
									<div class="border-t border-earth-100 pt-4">
										<p class="text-xs font-semibold uppercase tracking-wide text-earth-400 mb-2">Nearby Routes</p>
										<ul class="space-y-1.5">
											{#each selectedTrailhead.nearbyRouteIds as routeId}
												<li>
													<a
														href="https://ridewithgps.com/routes/{routeId}"
														target="_blank"
														rel="noopener noreferrer"
														class="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-900 hover:underline"
													>
														<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
														</svg>
														Route #{routeId}
													</a>
												</li>
											{/each}
										</ul>
									</div>
								{/if}

							</div>
						{:else}
						<!-- Empty state — nothing selected -->
						<div class="flex flex-col items-center justify-center h-full lg:min-h-[520px] py-16 px-6 text-center" transition:fade={{ duration: 150 }}>
								<div class="w-16 h-16 mb-4 rounded-full bg-forest-50 border border-forest-200/60 flex items-center justify-center">
									<svg class="w-8 h-8 text-forest-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								</div>
								<p class="text-base font-semibold text-earth-700 mb-1">
									{data.trailheads.length} trailhead{data.trailheads.length === 1 ? '' : 's'} in Boyle County
								</p>
								<p class="text-sm text-earth-400 max-w-[200px] leading-relaxed">
									Select a pin on the map or a card below to see details
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- All Trailheads Section (plain, like "All Routes" on home page) -->
{#if data.trailheads.length > 0}
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<h2 class="text-xl font-semibold text-forest-900 mb-6">All Trailheads</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.trailheads as trailhead (trailhead.id)}
				{@const isSelected = selectedTrailhead?.id === trailhead.id}
				<!-- Full card is the click target -->
				<div
					role="button"
					tabindex="0"
					onclick={() => selectFromCard(trailhead.id)}
					onkeydown={(e) => e.key === 'Enter' && selectFromCard(trailhead.id)}
					class="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border transition-all flex flex-col {isSelected ? 'border-forest-500 shadow-md ring-1 ring-forest-400' : 'border-forest-200/50 hover:shadow-md hover:border-forest-300'}"
				>
					<div class="p-5 flex flex-col gap-3 flex-1">

						<!-- Card Header -->
						<div>
							<h3 class="font-semibold text-forest-900 leading-snug group-hover:text-forest-700 transition-colors">{trailhead.name}</h3>
							{#if trailhead.address}
								<p class="text-xs text-earth-500 mt-0.5">{trailhead.address}</p>
							{/if}
						</div>

						<!-- Amenity Badges -->
						<div class="flex flex-wrap gap-2">
							{#if trailhead.parking}
								<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 text-forest-700 bg-forest-50 border-forest-200">
									<span>🅿</span>Parking
								</span>
							{/if}
							{#if trailhead.water}
								<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 text-blue-700 bg-blue-50 border-blue-200">
									<span>💧</span>Water
								</span>
							{/if}
							{#if trailhead.restrooms}
								<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 text-forest-700 bg-forest-50 border-forest-200">
									<span>🚻</span>Restrooms
								</span>
							{/if}
						{#if trailhead.surfaceType}
							{@const surfaceClass = surfaceConfig[trailhead.surfaceType] ?? 'bg-gray-100 text-gray-700 border-gray-200'}
							{@const icon = surfaceIcon[trailhead.surfaceType] ?? '🏔️'}
							<span class="inline-flex items-center gap-1 border font-semibold uppercase tracking-wide text-xs px-2 py-0.5 {surfaceClass}">
								<span>{icon}</span>{trailhead.surfaceType}
							</span>
						{/if}
						</div>

						<!-- Description excerpt -->
						{#if trailhead.description}
							<p class="text-sm text-earth-600 leading-relaxed line-clamp-2">
								{trailhead.description}
							</p>
						{/if}
					</div>

					<!-- Card footer — selected state or hover hint -->
					<div class="px-5 py-3 border-t border-earth-100 flex items-center gap-1.5 text-xs font-medium transition-colors {isSelected ? 'text-forest-600' : 'text-earth-400 group-hover:text-forest-500'}">
						{#if isSelected}
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
							</svg>
							Showing on map
						{:else}
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
							</svg>
							View on map
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Hero animations — mirrors +page.svelte so they fire on direct navigation to /trailheads */
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
		0%, 100% { transform: translate(0, 0); }
		50%       { transform: translate(20px, -20px); }
	}

	@keyframes pulseSlow {
		0%, 100% { opacity: 0.4; transform: scale(1); }
		50%       { opacity: 1;   transform: scale(1.2); }
	}

	@keyframes mountainSway1 {
		0%, 100% { transform: translateY(0); }
		50%       { transform: translateY(-3px); }
	}

	@keyframes mountainSway2 {
		0%, 100% { transform: translateY(0); }
		50%       { transform: translateY(-5px); }
	}

	:global(.hero-icon)      { animation: fadeInUp 0.8s ease-out 0.2s both; }
	:global(.hero-text-1)    { animation: fadeInUp 0.8s ease-out 0.4s both; }
	:global(.hero-text-2)    { animation: fadeInUp 0.8s ease-out 0.6s both; }
	:global(.hero-text-3)    { animation: fadeInUp 0.8s ease-out 0.8s both; }
	:global(.hero-features)  { animation: fadeInUp 0.8s ease-out 1s both; }

	:global(.animate-float)         { animation: float 20s ease-in-out infinite; }
	:global(.animate-float-delayed) { animation: float 20s ease-in-out infinite 10s; }
	:global(.animate-pulse-slow)    { animation: pulseSlow 3s ease-in-out infinite; }
	:global(.animate-mountain-1)    { animation: mountainSway1 15s ease-in-out infinite; }
	:global(.animate-mountain-2)    { animation: mountainSway2 12s ease-in-out infinite; }
</style>
