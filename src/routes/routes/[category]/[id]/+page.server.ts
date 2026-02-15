// Load single route data server-side
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { category, id } = params;

	try {
		const response = await fetch(`/api/routes/${category}/${id}`);
		
		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Route not found');
			}
			throw error(500, 'Failed to load route');
		}

		const route = await response.json();
		
		return {
			route
		};
	} catch (err) {
		console.error('Error loading route:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to load route');
	}
};
