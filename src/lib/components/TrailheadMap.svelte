<!-- Trailhead Map Component using Leaflet.js -->
<!--
	SSR safety:
	- Leaflet CSS is imported globally in app.css (avoids Vite SSR CSS handling issues)
	- Leaflet JS is imported dynamically inside onMount (requires window, never runs on server)
-->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Trailhead } from '$lib/types';

	interface Props {
		trailheads: Trailhead[];
		selectedId?: string | null;
		onselect?: (id: string) => void;
	}

	let { trailheads, selectedId = null, onselect }: Props = $props();

	let mapEl: HTMLDivElement;
	let leaflet: typeof import('leaflet') | null = null;
	let map: import('leaflet').Map | null = null;
	let markerMap = new Map<string, import('leaflet').Marker>();
	let initialBounds: import('leaflet').LatLngBounds | null = null;

	// --- Icon factory ---
	// Uses inline SVG divIcon to avoid Leaflet's default image path issues in SvelteKit builds.
	function makeIcon(active: boolean) {
		if (!leaflet) return null;
		const bg = active ? '#15803d' : '#166534'; // forest-600 : forest-800
		const ring = active ? '#dcfce7' : '#ffffff'; // forest-100 : white
		const w = active ? 38 : 30;
		const h = active ? 48 : 38;
		return leaflet.divIcon({
			html: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 30 38">
				<path d="M15 0C8.37 0 3 5.37 3 12c0 9 12 26 12 26S27 21 27 12C27 5.37 21.63 0 15 0z"
					fill="${bg}" stroke="${ring}" stroke-width="2"/>
				<circle cx="15" cy="12" r="5" fill="${ring}" opacity="0.9"/>
			</svg>`,
			className: '',
			iconSize: [w, h],
			iconAnchor: [w / 2, h],
			popupAnchor: [0, -h]
		});
	}

	function updateMarkerIcon(id: string, active: boolean) {
		const marker = markerMap.get(id);
		const icon = makeIcon(active);
		if (marker && icon) marker.setIcon(icon);
	}

	// --- React to selectedId changes ---
	// De-highlight the previous selection, highlight and pan to the new one.
	let previousSelectedId: string | null = null;

	$effect(() => {
		// Read selectedId FIRST so Svelte always registers it as a dependency,
		// even when the early return below fires on the initial render (before
		// onMount has initialised the map).
		const id = selectedId;

		if (!map || !leaflet) return;

		if (previousSelectedId && previousSelectedId !== id) {
			updateMarkerIcon(previousSelectedId, false);
		}

		if (id) {
			const marker = markerMap.get(id);
			if (marker) {
				updateMarkerIcon(id, true);
				map.panTo(marker.getLatLng(), { animate: true });
				marker.openPopup();
			}
		} else if (previousSelectedId) {
			// Deselected — zoom back out to show all markers
			if (initialBounds) {
				map.fitBounds(initialBounds, { padding: [48, 48], maxZoom: 14, animate: true });
			}
		}

		previousSelectedId = id ?? null;
	});

	// --- Map initialisation (client-only) ---
	onMount(async () => {
		leaflet = await import('leaflet');

		// Centre on Boyle County, KY; fitBounds below will adjust once markers are placed
		map = leaflet.map(mapEl, { zoomControl: true }).setView([37.645, -84.779], 12);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
				maxZoom: 19
			})
			.addTo(map);

		// Add a marker for every trailhead
		for (const trailhead of trailheads) {
			const icon = makeIcon(trailhead.id === selectedId);
			if (!icon) continue;

			const marker = leaflet
				.marker([trailhead.lat, trailhead.lng], { icon })
				.bindPopup(`<strong class="text-sm font-semibold">${trailhead.name}</strong>`)
				.addTo(map);

			marker.on('click', () => onselect?.(trailhead.id));
			markerMap.set(trailhead.id, marker);
		}

		// Fit viewport to show all markers with padding; store bounds for "Show all" reset
		if (trailheads.length > 0) {
			initialBounds = leaflet.latLngBounds(
				trailheads.map((t) => [t.lat, t.lng] as [number, number])
			);
			map.fitBounds(initialBounds, { padding: [48, 48], maxZoom: 14 });
		}
	});

	onDestroy(() => {
		map?.remove();
		map = null;
	});
</script>

<div bind:this={mapEl} class="w-full h-full min-h-[300px] lg:min-h-[520px] rounded-lg z-0"></div>
