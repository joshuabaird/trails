// Load routes data server-side
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch all routes from our API
		const response = await fetch('/api/routes?limit=10');
		
		if (!response.ok) {
			throw new Error('Failed to fetch routes');
		}

		const routes = await response.json();
		
		return {
			routes,
			error: null
		};
	} catch (error) {
		console.error('Error loading routes:', error);
		return {
			routes: { road: [], gravel: [], mountain: [] },
			error: error instanceof Error ? error.message : 'Failed to load routes'
		};
	}
};
