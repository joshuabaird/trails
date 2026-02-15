<!-- Site Navigation Header -->
<script lang="ts">
	import { page } from '$app/stores';
	
	let mobileMenuOpen = $state(false);
	
	// Close mobile menu when route changes
	$effect(() => {
		$page.url.pathname;
		mobileMenuOpen = false;
	});
	
	const navLinks = [
		{ href: '/', label: 'Routes' },
		{ href: '/about', label: 'About' },
	];
</script>

<nav class="sticky top-0 z-50 bg-white border-b border-forest-200 shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			
			<!-- Logo / Site Name -->
			<div class="flex-shrink-0">
				<a href="/" class="flex items-center gap-2 group">
					<div class="w-10 h-10 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
						<span class="text-xl">🚴</span>
					</div>
					<div class="hidden sm:block">
						<div class="text-lg font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
							Danville/Boyle Trails Alliance
						</div>
						<div class="text-xs text-earth-600 -mt-0.5">Explore. Ride. Discover.</div>
					</div>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium transition-colors {
							$page.url.pathname === link.href
								? 'text-forest-700 border-b-2 border-forest-600 pb-1'
								: 'text-earth-700 hover:text-forest-600'
						}"
					>
						{link.label}
					</a>
				{/each}
			</div>

			<!-- CTA Button (Desktop) -->
			<div class="hidden md:block">
				<a
					href="/#featured"
					class="inline-flex items-center gap-2 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors shadow-sm"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
					</svg>
					Featured Routes
				</a>
			</div>

			<!-- Mobile Menu Button -->
			<button
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
				class="md:hidden p-2 rounded-lg text-earth-700 hover:bg-forest-50 transition-colors"
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-t border-forest-200 bg-forest-50/50">
			<div class="px-4 py-3 space-y-2">
				{#each navLinks as link}
					<a
						href={link.href}
						class="block px-3 py-2 rounded-lg text-base font-medium transition-colors {
							$page.url.pathname === link.href
								? 'bg-forest-600 text-white'
								: 'text-earth-700 hover:bg-forest-100'
						}"
					>
						{link.label}
					</a>
				{/each}
				
				<!-- Mobile CTA -->
				<a
					href="/#featured"
					class="flex items-center justify-center gap-2 px-3 py-2 mt-2 bg-forest-600 text-white text-base font-medium rounded-lg hover:bg-forest-700 transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
					</svg>
					Featured Routes
				</a>
			</div>
		</div>
	{/if}
</nav>
