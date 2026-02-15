/**
 * API Route: Get routes by category
 * 
 * GET /api/routes/[category]
 * 
 * Params:
 * - category: 'road' | 'gravel' | 'mountain'
 * 
 * Query params:
 * - limit: number (optional)
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRoutesByCategory } from '$lib/api/routes';
import type { RouteCategory } from '$lib/types';
import { RIDEWITHGPS_API_KEY, RIDEWITHGPS_AUTH_TOKEN } from '$env/static/private';

// Cache duration: 15 minutes
const CACHE_MAX_AGE = 60 * 15;

const VALID_CATEGORIES: RouteCategory[] = ['road', 'gravel', 'mountain'];

export const GET: RequestHandler = async ({ params, url, setHeaders }) => {
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

		// Get limit from query params
		const limit = url.searchParams.get('limit');
		const options = {
			limit: limit ? parseInt(limit, 10) : undefined,
			apiKey: RIDEWITHGPS_API_KEY,
			authToken: RIDEWITHGPS_AUTH_TOKEN
		};

		// Fetch routes for this category
		const routes = await getRoutesByCategory(category, options);

		// Set cache headers
		setHeaders({
			'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
		});

		return json(routes);
	} catch (err) {
		console.error(`Error in /api/routes/${params.category}:`, err);
		const message = err instanceof Error ? err.message : 'Failed to fetch routes';
		const status = err instanceof Error && err.message.includes('Invalid') ? 400 : 500;
		throw error(status, message);
	}
};
