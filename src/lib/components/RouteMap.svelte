<!-- Route Map Component using RideWithGPS Embed -->
<script lang="ts">
	import type { EnhancedRoute } from '$lib/types';

	interface Props {
		route: EnhancedRoute;
	}

	let { route }: Props = $props();
	
	// RideWithGPS embed URL with route visualization and elevation profile
	const embedUrl = `https://ridewithgps.com/embeds?type=route&id=${route.id}&sampleGraph=true`;
</script>

<div class="w-full rounded-lg overflow-hidden border border-trail-300 shadow-md bg-white">
	<iframe
		src={embedUrl}
		title="Route map for {route.name}"
		class="w-full h-[500px] border-0"
		loading="lazy"
		allow="fullscreen"
	></iframe>
	
	<!-- Attribution -->
	<div class="px-3 py-2 bg-trail-50 border-t border-trail-200 text-xs text-earth-600">
		Interactive map powered by 
		<a 
			href="https://ridewithgps.com/routes/{route.id}" 
			target="_blank" 
			rel="noopener noreferrer"
			class="text-forest-600 hover:text-forest-700 underline"
		>
			RideWithGPS
		</a>
	</div>
</div>
