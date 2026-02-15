<!-- Map Component using Leaflet -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { EnhancedRoute } from '$lib/types';
	import 'leaflet/dist/leaflet.css';

	interface Props {
		route: EnhancedRoute;
	}

	let { route }: Props = $props();
	let mapContainer: HTMLDivElement;
	let map: any;
	let hasMapData = $state(true);

	onMount(async () => {
		// Check if we have coordinate data
		if (!route.sw_lat || !route.sw_lng || !route.ne_lat || !route.ne_lng) {
			console.warn('Route missing coordinate data for map display');
			hasMapData = false;
			return;
		}

		// Dynamically import Leaflet (client-side only)
		const L = await import('leaflet');

		// Fix Leaflet's default icon paths
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
			iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
			shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
		});

		// Calculate map center
		const centerLat = (route.sw_lat + route.ne_lat) / 2;
		const centerLng = (route.sw_lng + route.ne_lng) / 2;

		// Initialize map
		map = L.map(mapContainer).setView([centerLat, centerLng], 13);

		// Add tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 18,
		}).addTo(map);

		// Add start marker if coordinates available
		if (route.first_lat && route.first_lng) {
			L.marker([route.first_lat, route.first_lng])
				.bindPopup('<b>Start</b>')
				.addTo(map);
		}

		// Fit bounds
		const bounds = L.latLngBounds(
			[route.sw_lat, route.sw_lng],
			[route.ne_lat, route.ne_lng]
		);
		map.fitBounds(bounds, { padding: [50, 50] });

		return () => {
			if (map) {
				map.remove();
			}
		};
	});
</script>

{#if hasMapData}
	<div class="w-full h-full rounded-lg overflow-hidden border border-trail-300 shadow-md">
		<div bind:this={mapContainer} class="w-full h-full min-h-[400px]"></div>
	</div>
{:else}
	<div class="w-full min-h-[400px] rounded-lg overflow-hidden border border-trail-300 bg-trail-50 flex items-center justify-center">
		<div class="text-center p-8">
			<svg class="w-16 h-16 mx-auto mb-4 text-trail-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
			</svg>
			<p class="text-earth-600">Map data not available for this route</p>
			<p class="text-sm text-earth-500 mt-2">View on RideWithGPS to see the full route map</p>
		</div>
	</div>
{/if}
