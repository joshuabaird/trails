<!-- About Page -->
<script lang="ts">
	export const prerender = true;
</script>

<svelte:head>
	<title>About - Boyle County Trails</title>
	<meta name="description" content="Learn about Boyle County Trails and our mission to connect cyclists with the best routes in the region." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-forest-50 via-white to-earth-50">
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
		<div class="absolute -top-24 -right-24 w-96 h-96 bg-forest-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
		<div class="absolute -bottom-24 -left-24 w-96 h-96 bg-trail-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
		
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
			<div class="text-center">
				<!-- Back button -->
				<a 
					href="/"
					class="inline-flex items-center text-sm text-forest-100 hover:text-white mb-6 transition-colors"
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Back to Routes
				</a>
				
				<!-- Icon/Badge -->
				<div class="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-forest-500/60 backdrop-blur-sm border border-forest-300/40 shadow-lg">
					<span class="text-5xl">ℹ️</span>
				</div>
				
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
					<span class="block">About</span>
					<span class="block bg-gradient-to-r from-forest-200 via-trail-100 to-forest-100 bg-clip-text text-transparent">
						Boyle County Trails
					</span>
				</h1>
				
				<p class="text-lg md:text-xl text-forest-50 max-w-3xl mx-auto leading-relaxed">
					Connecting cyclists with the best routes across Boyle County
				</p>
			</div>
		</div>
		
		<!-- Mountain and nature silhouettes at bottom -->
		<div class="absolute bottom-0 left-0 right-0">
			<svg class="w-full h-32 md:h-40" viewBox="0 0 1200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0,120 L200,60 L400,100 L600,40 L800,80 L1000,60 L1200,100 L1200,200 L0,200 Z" 
					fill="rgba(45, 110, 78, 0.3)"/>
				<path d="M0,150 L150,90 L300,130 L500,70 L700,110 L900,90 L1050,120 L1200,140 L1200,200 L0,200 Z" 
					fill="rgba(45, 110, 78, 0.5)"/>
				<path d="M0,160 L50,140 L80,155 L150,135 L200,150 L280,130 L350,145 L450,125 L550,140 L650,130 L750,145 L850,135 L950,150 L1050,140 L1150,155 L1200,145 L1200,200 L0,200 Z" 
					fill="rgba(45, 110, 78, 0.7)"/>
			</svg>
		</div>
		
		<!-- Subtle gradient fade that blends mountains into content -->
		<div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-forest-50/60 pointer-events-none"></div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="max-w-4xl mx-auto">
		
		<!-- Mission Section -->
		<section class="mb-12">
			<h2 class="text-3xl font-bold text-forest-900 mb-4">Our Mission</h2>
			<div class="text-lg text-earth-700 leading-relaxed space-y-4">
				<p>
					Boyle County Trails is dedicated to showcasing the incredible cycling opportunities 
					available throughout Boyle County. Whether you're looking for a leisurely road ride, 
					an adventurous gravel exploration, or challenging mountain bike trails, we've curated 
					the best routes to help you discover your next adventure.
				</p>
				<p>
					Our goal is to make cycling more accessible and enjoyable for everyone—from beginners 
					taking their first ride to experienced cyclists seeking new challenges.
				</p>
			</div>
		</section>

		<!-- What We Offer Section -->
		<section class="mb-12 bg-earth-50 rounded-lg p-8">
			<h2 class="text-3xl font-bold text-forest-900 mb-6">What We Offer</h2>
			<div class="grid md:grid-cols-2 gap-6">
				<div>
					<h3 class="text-xl font-semibold text-forest-800 mb-2 flex items-center gap-2">
						<span class="text-2xl">🚴</span>
						Curated Routes
					</h3>
					<p class="text-earth-700">
						Hand-picked cycling routes across road, gravel, and mountain biking categories, 
						each with detailed maps and elevation profiles.
					</p>
				</div>
				<div>
					<h3 class="text-xl font-semibold text-forest-800 mb-2 flex items-center gap-2">
						<span class="text-2xl">🗺️</span>
						Detailed Information
					</h3>
					<p class="text-earth-700">
						Comprehensive route details including distance, elevation gain, difficulty ratings, 
						and terrain information to help you plan your ride.
					</p>
				</div>
				<div>
					<h3 class="text-xl font-semibold text-forest-800 mb-2 flex items-center gap-2">
						<span class="text-2xl">📥</span>
						Easy Downloads
					</h3>
					<p class="text-earth-700">
						Download GPX files for use with your favorite GPS device or cycling app, 
						making navigation simple and reliable.
					</p>
				</div>
				<div>
					<h3 class="text-xl font-semibold text-forest-800 mb-2 flex items-center gap-2">
						<span class="text-2xl">⭐</span>
						Featured Routes
					</h3>
					<p class="text-earth-700">
						Discover our specially selected featured routes that showcase the best of 
						what Boyle County has to offer.
					</p>
				</div>
			</div>
		</section>

		<!-- Community Section -->
		<section class="mb-12">
			<h2 class="text-3xl font-bold text-forest-900 mb-4">Join Our Community</h2>
			<div class="text-lg text-earth-700 leading-relaxed space-y-4">
				<p>
					We're more than just a route directory—we're a community of cyclists who love 
					exploring Boyle County's beautiful landscapes. Connect with us on social media 
					to share your rides, discover new routes, and stay updated on cycling events 
					in the area.
				</p>
				<div class="flex gap-4 pt-4">
					<a 
						href="#" 
						class="inline-flex items-center gap-2 px-6 py-3 bg-forest-600 text-white font-medium rounded-lg hover:bg-forest-700 transition-colors"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
						</svg>
						Follow on Facebook
					</a>
					<a 
						href="#" 
						class="inline-flex items-center gap-2 px-6 py-3 border-2 border-forest-600 text-forest-700 font-medium rounded-lg hover:bg-forest-50 transition-colors"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
						</svg>
						Follow on Instagram
					</a>
				</div>
			</div>
		</section>

		<!-- Powered By Section -->
		<section class="border-t border-earth-200 pt-8">
			<h2 class="text-2xl font-bold text-forest-900 mb-4">Powered By RideWithGPS</h2>
			<p class="text-earth-700 leading-relaxed">
				All our route data is sourced from <a href="https://ridewithgps.com" target="_blank" rel="noopener noreferrer" class="text-forest-600 hover:text-forest-700 underline">RideWithGPS</a>, 
				the leading platform for route planning and navigation. RideWithGPS provides detailed 
				mapping, elevation profiles, and turn-by-turn navigation to help you make the most of 
				every ride.
			</p>
		</section>

		<!-- Call to Action -->
		<div class="mt-12 text-center bg-gradient-to-br from-forest-100 to-earth-100 rounded-lg p-8">
			<h2 class="text-2xl font-bold text-forest-900 mb-4">Ready to Ride?</h2>
			<p class="text-earth-700 mb-6">
				Browse our collection of routes and start planning your next adventure today.
			</p>
			<a 
				href="/"
				class="inline-flex items-center gap-2 px-8 py-3 bg-forest-600 text-white font-medium rounded-lg hover:bg-forest-700 transition-colors shadow-md"
			>
				Explore Routes
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
		</div>

		</div>

	</div>
</div>
