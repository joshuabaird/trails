<!-- Featured Routes Section -->
<script lang="ts">
	import type { EnhancedRoute } from '$lib/types';
	import RouteCard from './RouteCard.svelte';

	interface Props {
		routes: {
			road: EnhancedRoute[];
			gravel: EnhancedRoute[];
			mountain: EnhancedRoute[];
		};
	}

	let { routes }: Props = $props();

	// Get all featured routes from all categories
	const featuredRoutes = $derived(() => {
		const allRoutes = [
			...routes.road,
			...routes.gravel,
			...routes.mountain
		];
		
		// Filter to only routes with "featured" badge
		const featured = allRoutes.filter(route => 
			route.badges.includes('featured')
		);

		// Limit to 6 routes
		return featured.slice(0, 6);
	});

	const hasFeaturedRoutes = $derived(featuredRoutes().length > 0);
</script>

{#if hasFeaturedRoutes}
	<section class="mb-12">
		<!-- Full-width background container with earthy brown tones -->
		<div class="w-full bg-gradient-to-br from-earth-100 via-earth-50 to-trail-100 border-y border-earth-300/40 py-10 md:py-12 relative overflow-hidden">
			
			<!-- Upside-down mountain silhouettes at top -->
			<div class="absolute top-0 left-0 right-0">
				<svg class="w-full h-16 md:h-20" viewBox="0 0 1200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="transform: scaleY(-1);">
					<!-- Single subtle mountain range -->
					<path d="M0,60 L150,40 L300,55 L500,30 L700,50 L900,35 L1050,45 L1200,55 L1200,100 L0,100 Z" 
						fill="rgba(45, 110, 78, 0.08)"/>
					<!-- Foreground hills -->
					<path d="M0,70 L200,65 L400,75 L600,60 L800,70 L1000,65 L1200,72 L1200,100 L0,100 Z" 
						fill="rgba(45, 110, 78, 0.12)"/>
				</svg>
			</div>
			
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<!-- Section Header with enhanced typography -->
				<div class="mb-8 text-center">
					<!-- Star icon badge -->
					<div class="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-forest-500 via-trail-600 to-forest-600 shadow-lg">
						<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					</div>
					
					<!-- Title with better typography -->
					<h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-forest-800 via-earth-900 to-forest-800 bg-clip-text text-transparent mb-3 tracking-tight">
						Featured Routes
					</h2>
					
					<!-- Subtitle with accent -->
					<div class="max-w-2xl mx-auto">
						<p class="text-base md:text-lg text-earth-700 leading-relaxed">
							Hand-picked routes showcasing the best of Boyle County
						</p>
						<div class="mt-3 flex items-center justify-center gap-2 text-sm text-forest-700">
							<div class="w-12 h-px bg-gradient-to-r from-transparent via-forest-400 to-transparent"></div>
							<span>{featuredRoutes().length} {featuredRoutes().length === 1 ? 'route' : 'routes'}</span>
							<div class="w-12 h-px bg-gradient-to-r from-transparent via-forest-400 to-transparent"></div>
						</div>
					</div>
				</div>

				<!-- Featured Routes Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each featuredRoutes() as route (route.id)}
						<RouteCard {route} featured={true} showCategory={true} />
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}
