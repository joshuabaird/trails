<!-- Badge Component - displays route metadata badges -->
<script lang="ts">
	import type { BadgeType } from '$lib/types';
	import { getBadgeInfo } from '$lib/utils';

	interface Props {
		type: BadgeType;
		size?: 'sm' | 'md' | 'lg';
	}

	let { type, size = 'md' }: Props = $props();
	
	const sizeClasses = {
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-3 py-1',
		lg: 'text-base px-4 py-1.5'
	};

	// Use $derived to make it reactive
	const badgeInfo = $derived(getBadgeInfo(type));
</script>

{#if badgeInfo}
	<span 
		class="inline-flex items-center border font-medium {badgeInfo.color} {sizeClasses[size]}"
		title={badgeInfo.label}
	>
		{badgeInfo.label}
	</span>
{/if}
