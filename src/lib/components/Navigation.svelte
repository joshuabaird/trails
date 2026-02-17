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

<nav class="sticky top-0 z-50 bg-white shadow-sm">
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

			<!-- Desktop Navigation (Right-aligned) -->
			<div class="hidden md:flex items-center gap-1 h-full ml-auto">
				{#each navLinks as link}
					<a
						href={link.href}
						class="relative h-full flex items-center px-6 text-sm font-medium transition-all {
							$page.url.pathname === link.href
								? 'text-white'
								: 'text-earth-700 hover:text-forest-700 hover:bg-forest-100'
						}"
					>
						<!-- Tab background for active link -->
						{#if $page.url.pathname === link.href}
							<div class="absolute inset-0 bg-gradient-to-b from-forest-600 to-forest-700 rounded-t-lg -mb-px"></div>
						{/if}
						<span class="relative z-10">{link.label}</span>
					</a>
				{/each}
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
			</div>
		</div>
	{/if}
</nav>
