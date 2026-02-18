/**
 * API Route: Get all trailheads
 *
 * GET /api/trailheads
 *
 * Returns all trailheads from src/lib/data/trailheads.json.
 * Data is static between deploys so a long cache TTL is appropriate.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllTrailheads } from '$lib/utils/data';

// Cache duration: 1 hour (data only changes on deploy)
const CACHE_MAX_AGE = 60 * 60;

export const GET: RequestHandler = async ({ setHeaders }) => {
	try {
		const trailheads = getAllTrailheads();

		setHeaders({
			'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`
		});

		return json(trailheads);
	} catch (err) {
		console.error('Error in /api/trailheads:', err);
		const message = err instanceof Error ? err.message : 'Failed to fetch trailheads';
		throw error(500, message);
	}
};
