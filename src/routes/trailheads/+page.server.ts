// Load trailheads data server-side
import type { PageServerLoad } from './$types';
import type { Trailhead } from '$lib/types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/trailheads');

		if (!response.ok) {
			throw new Error('Failed to fetch trailheads');
		}

		const trailheads: Trailhead[] = await response.json();

		return {
			trailheads,
			error: null
		};
	} catch (err) {
		console.error('Error loading trailheads:', err);
		return {
			trailheads: [] as Trailhead[],
			error: err instanceof Error ? err.message : 'Failed to load trailheads'
		};
	}
};
