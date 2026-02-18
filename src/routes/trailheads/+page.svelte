<!-- Trailheads Page -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { Trailhead } from '$lib/types';
	import TrailheadMap from '$lib/components/TrailheadMap.svelte';

	let { data }: { data: PageData } = $props();

	let selectedTrailhead = $state<Trailhead | null>(null);

	function selectTrailhead(id: string) {
		selectedTrailhead = data.trailheads.find((t: Trailhead) => t.id === id) ?? null;
	}

	function clearSelection() {
		selectedTrailhead = null;
	}

	// --- Amenity display helpers ---
	const parkingConfig: Record<string, { label: string; color: string }> = {
		none: { label: 'No Parking', color: 'text-red-600 bg-red-50 border-red-200' },
		limited: { label: 'Limited Parking', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
		ample: { label: 'Ample Parking', color: 'text-green-700 bg-green-50 border-green-200' }
	};

	const surfaceConfig: Record<string, string> = {
		paved: 'bg-blue-100 text-blue-800 border-blue-200',
		gravel: 'bg-earth-100 text-earth-800 border-earth-200',
		dirt: 'bg-amber-100 text-amber-800 border-amber-200',
		mixed: 'bg-trail-100 text-trail-800 border-trail-200'
	};
</script>

<svelte:head>
	<title>Trailheads — Boyle County Trails</title>
	<meta
		name="description"
		content="Find trailheads across Boyle County with parking, water, and restroom information."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-forest-50 via-white to-earth-50">
	<!-- Hero Banner -->
	<div class="relative bg-gradient-to-br from-forest-700 via-forest-600 to-earth-700 text-white">
		<!-- Dot pattern overlay -->
		<div class="absolute inset-0 opacity-10">
			<div
				class="absolute inset-0"
				style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;"
			></div>
		</div>

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
			<div class="text-center">
				<div
					class="inline-flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-forest-500/60 backdrop-blur-sm border border-forest-300/40 shadow-lg"
				>
					<span class="text-4xl">🥾</span>
				</div>
				<h1 class="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
					Boyle County Trailheads
				</h1>
				<p class="text-lg text-forest-100 max-w-2xl mx-auto mb-6">
					Find your starting point. Each trailhead includes parking, water, and restroom
					information so you can plan your ride with confidence.
				</p>
				<div class="inline-flex items-center gap-2 text-sm text-forest-200">
					<span class="w-2 h-2 rounded-full bg-forest-300"></span>
					{data.trailheads.length}
					{data.trailheads.length === 1 ? 'trailhead' : 'trailheads'} in Boyle County
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

		<!-- Error State -->
		{#if data.error}
			<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
				<p class="font-medium">Unable to load trailheads</p>
				<p class="text-sm">{data.error}</p>
			</div>
		{/if}

		<!-- Map + Detail Panel -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

			<!-- Map (takes 2/3 on desktop) -->
			<div class="lg:col-span-2">
				<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-forest-200/50 overflow-hidden h-full min-h-[420px]">
					<TrailheadMap
						trailheads={data.trailheads}
						selectedId={selectedTrailhead?.id ?? null}
						onselect={selectTrailhead}
					/>
				</div>
			</div>

			<!-- Detail Panel (takes 1/3 on desktop) -->
			<div class="lg:col-span-1">
				<div class="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-forest-200/50 h-full min-h-[420px] flex flex-col">
					{#if selectedTrailhead}
						<!-- Trailhead Detail -->
						<div class="p-6 flex flex-col gap-5 h-full">

							<!-- Header -->
							<div class="flex items-start justify-between gap-3">
								<h2 class="text-xl font-bold text-forest-900 leading-snug">
									{selectedTrailhead.name}
								</h2>
								<button
									onclick={clearSelection}
									class="shrink-0 p-1 rounded text-earth-400 hover:text-earth-700 hover:bg-earth-100 transition-colors"
									aria-label="Close"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							<!-- Address -->
							{#if selectedTrailhead.address}
								<div class="flex items-start gap-2 text-sm text-earth-700">
									<svg class="w-4 h-4 mt-0.5 shrink-0 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span>{selectedTrailhead.address}</span>
								</div>
							{/if}

							<!-- Amenities -->
							<div class="space-y-2">
								<h3 class="text-xs font-semibold uppercase tracking-wide text-earth-500">Amenities</h3>
								<div class="flex flex-wrap gap-2">
									<!-- Parking -->
									{@const parking = parkingConfig[selectedTrailhead.parking]}
									<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium {parking.color}">
										<span>🅿</span>
										{parking.label}
									</span>

									<!-- Water -->
									<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium {selectedTrailhead.water ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-earth-500 bg-earth-50 border-earth-200'}">
										<span>💧</span>
										{selectedTrailhead.water ? 'Water' : 'No Water'}
									</span>

									<!-- Restrooms -->
									<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium {selectedTrailhead.restrooms ? 'text-forest-700 bg-forest-50 border-forest-200' : 'text-earth-500 bg-earth-50 border-earth-200'}">
										<span>🚻</span>
										{selectedTrailhead.restrooms ? 'Restrooms' : 'No Restrooms'}
									</span>

									<!-- Surface Type -->
									{#if selectedTrailhead.surfaceType}
										{@const surfaceClass = surfaceConfig[selectedTrailhead.surfaceType] ?? 'bg-gray-100 text-gray-800 border-gray-200'}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium capitalize {surfaceClass}">
											{selectedTrailhead.surfaceType} Surface
										</span>
									{/if}
								</div>
							</div>

							<!-- Description -->
							{#if selectedTrailhead.description}
								<div>
									<h3 class="text-xs font-semibold uppercase tracking-wide text-earth-500 mb-1.5">About</h3>
									<p class="text-sm text-earth-700 leading-relaxed">{selectedTrailhead.description}</p>
								</div>
							{/if}

							<!-- Nearby Routes -->
							{#if selectedTrailhead.nearbyRouteIds && selectedTrailhead.nearbyRouteIds.length > 0}
								<div>
									<h3 class="text-xs font-semibold uppercase tracking-wide text-earth-500 mb-2">Nearby Routes</h3>
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
						<div class="flex flex-col items-center justify-center h-full min-h-[420px] px-6 text-center text-earth-400">
							<svg class="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<p class="text-sm font-medium text-earth-500">Select a trailhead</p>
							<p class="text-xs text-earth-400 mt-1">Click any pin on the map or a card below</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Trailhead Cards Grid -->
		{#if data.trailheads.length > 0}
			<div>
				<h2 class="text-xl font-semibold text-forest-900 mb-5">All Trailheads</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{#each data.trailheads as trailhead (trailhead.id)}
						{@const isSelected = selectedTrailhead?.id === trailhead.id}
						<div
							class="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border transition-all {isSelected ? 'border-forest-500 shadow-md ring-1 ring-forest-400' : 'border-forest-200/50 hover:shadow-md hover:border-forest-300'}"
						>
							<div class="p-5 flex flex-col gap-3 h-full">

								<!-- Card Header -->
								<div>
									<h3 class="font-semibold text-forest-900 leading-snug">{trailhead.name}</h3>
									{#if trailhead.address}
										<p class="text-xs text-earth-500 mt-0.5">{trailhead.address}</p>
									{/if}
								</div>

								<!-- Amenity Icons Row -->
								<div class="flex flex-wrap gap-2">
									<!-- Parking -->
									{@const parking = parkingConfig[trailhead.parking]}
									<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs {parking.color}">
										🅿 {parking.label}
									</span>

									<!-- Water -->
									{#if trailhead.water}
										<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs text-blue-700 bg-blue-50 border-blue-200">
											💧 Water
										</span>
									{/if}

									<!-- Restrooms -->
									{#if trailhead.restrooms}
										<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs text-forest-700 bg-forest-50 border-forest-200">
											🚻 Restrooms
										</span>
									{/if}

									<!-- Surface -->
									{#if trailhead.surfaceType}
										{@const surfaceClass = surfaceConfig[trailhead.surfaceType] ?? 'bg-gray-100 text-gray-700 border-gray-200'}
										<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs capitalize {surfaceClass}">
											{trailhead.surfaceType}
										</span>
									{/if}
								</div>

								<!-- Description excerpt -->
								{#if trailhead.description}
									<p class="text-sm text-earth-600 leading-relaxed line-clamp-2 flex-1">
										{trailhead.description}
									</p>
								{/if}

								<!-- View on Map Button -->
								<button
									onclick={() => selectTrailhead(trailhead.id)}
									class="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors {isSelected ? 'bg-forest-600 text-white' : 'bg-forest-50 text-forest-700 hover:bg-forest-100 border border-forest-200'}"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
									</svg>
									{isSelected ? 'Selected' : 'View on Map'}
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

	</div>
</div>
