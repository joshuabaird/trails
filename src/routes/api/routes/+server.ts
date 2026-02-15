/**
 * API Route: Get all routes by category
 * 
 * GET /api/routes
 * 
 * Query params:
 * - limit: number (optional) - limit routes per category
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllRoutes } from '$lib/api/routes';
import { RIDEWITHGPS_API_KEY, RIDEWITHGPS_AUTH_TOKEN } from '$env/static/private';

// Cache duration: 15 minutes
const CACHE_MAX_AGE = 60 * 15;

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	try {
		// Check if API key is configured
		if (!RIDEWITHGPS_API_KEY) {
			throw error(500, 'RideWithGPS API key not configured');
		}

		// Get limit from query params
		const limit = url.searchParams.get('limit');
		const options = { 
			limit: limit ? parseInt(limit, 10) : undefined,
			apiKey: RIDEWITHGPS_API_KEY,
			authToken: RIDEWITHGPS_AUTH_TOKEN
		};

		// Fetch routes
		const routes = await getAllRoutes(options);

		// Set cache headers
		setHeaders({
			'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
		});

		return json(routes);
	} catch (err) {
		console.error('Error in /api/routes:', err);
		const message = err instanceof Error ? err.message : 'Failed to fetch routes';
		throw error(500, message);
	}
};
