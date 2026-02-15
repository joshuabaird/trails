/**
 * API Route: Get a single route by ID
 * 
 * GET /api/routes/[category]/[id]
 * 
 * Params:
 * - category: 'road' | 'gravel' | 'mountain'
 * - id: route ID
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRouteById } from '$lib/api/routes';
import type { RouteCategory } from '$lib/types';
import { RIDEWITHGPS_API_KEY, RIDEWITHGPS_AUTH_TOKEN } from '$env/static/private';

// Cache duration: 1 hour (route details change less frequently)
const CACHE_MAX_AGE = 60 * 60;

const VALID_CATEGORIES: RouteCategory[] = ['road', 'gravel', 'mountain'];

export const GET: RequestHandler = async ({ params, setHeaders }) => {
	try {
		// Check if API key is configured
		if (!RIDEWITHGPS_API_KEY) {
			throw error(500, 'RideWithGPS API key not configured');
		}

		// Validate category
		const category = params.category as RouteCategory;
		if (!VALID_CATEGORIES.includes(category)) {
			throw error(400, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
		}

		// Validate route ID
		const routeId = params.id;
		if (!routeId) {
			throw error(400, 'Route ID is required');
		}

		// Fetch route
		const route = await getRouteById(routeId, category, RIDEWITHGPS_API_KEY, RIDEWITHGPS_AUTH_TOKEN);

		// Set cache headers
		setHeaders({
			'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
		});

		return json(route);
	} catch (err) {
		console.error(`Error in /api/routes/${params.category}/${params.id}:`, err);
		const message = err instanceof Error ? err.message : 'Failed to fetch route';
		const status = err instanceof Error && err.message.includes('Invalid') ? 400 : 500;
		throw error(status, message);
	}
};
