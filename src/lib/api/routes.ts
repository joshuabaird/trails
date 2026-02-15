/**
 * Route Service
 * 
 * Combines RideWithGPS API data with local badge metadata
 */

import type { Route, EnhancedRoute, RouteCategory, BadgeType } from '$lib/types';
import { getRideWithGPSClient } from './ridewithgps';
import { getRouteListId, getRouteBadges } from '$lib/utils/data';

/**
 * Map RideWithGPS API values to badge types
 */
function mapAPIAttributeToBadge(attribute: string, value: string | undefined): BadgeType | null {
	if (!value) return null;
	
	const normalizedValue = value.toLowerCase().trim();
	
	// Map terrain values to badges
	if (attribute === 'terrain') {
		const terrainMap: Record<string, BadgeType> = {
			'hilly': 'hilly',
			'flat': 'flat',
			'rolling': 'rolling',
			'hills': 'hilly',
			'mountainous': 'hilly',
		};
		return terrainMap[normalizedValue] || null;
	}
	
	// Map difficulty values to badges
	if (attribute === 'difficulty') {
		const difficultyMap: Record<string, BadgeType> = {
			'beginner': 'beginner',
			'easy': 'beginner',
			'intermediate': 'intermediate',
			'moderate': 'intermediate',
			'advanced': 'advanced',
			'hard': 'advanced',
			'expert': 'advanced',
			'difficult': 'advanced',
		};
		return difficultyMap[normalizedValue] || null;
	}
	
	return null;
}

/**
 * Generate automatic badges from route attributes
 */
function generateAutoBadges(route: Route): BadgeType[] {
	const autoBadges: BadgeType[] = [];
	
	// Add badge for terrain
	const terrainBadge = mapAPIAttributeToBadge('terrain', route.terrain);
	if (terrainBadge) {
		autoBadges.push(terrainBadge);
	}
	
	// Add badge for difficulty
	const difficultyBadge = mapAPIAttributeToBadge('difficulty', route.difficulty);
	if (difficultyBadge) {
		autoBadges.push(difficultyBadge);
	}
	
	return autoBadges;
}

/**
 * Fetch routes for a specific category (road, gravel, mountain)
 * and enhance them with local badge metadata
 */
export async function getRoutesByCategory(
	category: RouteCategory,
	options?: { limit?: number; apiKey?: string; authToken?: string }
): Promise<EnhancedRoute[]> {
	try {
		const client = getRideWithGPSClient(options?.apiKey, options?.authToken);
		const listId = getRouteListId(category);

		if (!listId || listId === `your-${category}-list-id`) {
			console.warn(`No ${category} list ID configured. Please update data/route-lists.json`);
			return [];
		}

		// Fetch routes from the collection/list
		const routes = await client.getCollectionRoutes(listId);

		// Limit results if specified
		const limitedRoutes = options?.limit ? routes.slice(0, options.limit) : routes;

		// Enhance routes with category and badges
		return limitedRoutes.map(route => enhanceRoute(route, category));
	} catch (error) {
		console.error(`Error fetching ${category} routes:`, error);
		throw new Error(`Failed to fetch ${category} routes: ${error}`);
	}
}

/**
 * Fetch a single route by ID and enhance with metadata
 */
export async function getRouteById(
	routeId: string | number,
	category?: RouteCategory,
	apiKey?: string,
	authToken?: string
): Promise<EnhancedRoute> {
	try {
		const client = getRideWithGPSClient(apiKey, authToken);
		const route = await client.getRoute(routeId);

		// If category not provided, try to infer it (or use a default)
		const routeCategory = category || inferCategory(route);

		return enhanceRoute(route, routeCategory);
	} catch (error) {
		console.error(`Error fetching route ${routeId}:`, error);
		throw new Error(`Failed to fetch route: ${error}`);
	}
}

/**
 * Fetch all routes across all categories
 */
export async function getAllRoutes(options?: {
	limit?: number;
	apiKey?: string;
	authToken?: string;
}): Promise<{
	road: EnhancedRoute[];
	gravel: EnhancedRoute[];
	mountain: EnhancedRoute[];
}> {
	try {
		const [road, gravel, mountain] = await Promise.all([
			getRoutesByCategory('road', options),
			getRoutesByCategory('gravel', options),
			getRoutesByCategory('mountain', options),
		]);

		return { road, gravel, mountain };
	} catch (error) {
		console.error('Error fetching all routes:', error);
		throw new Error(`Failed to fetch routes: ${error}`);
	}
}

/**
 * Enhance a route with category and badge metadata
 * Combines manual badges from JSON with auto-generated badges from API attributes
 */
function enhanceRoute(route: Route, category: RouteCategory): EnhancedRoute {
	// Get manually assigned badges from JSON
	const manualBadges = getRouteBadges(route.id);
	
	// Generate automatic badges from API attributes
	const autoBadges = generateAutoBadges(route);
	
	// Combine badges, removing duplicates (manual badges take precedence)
	const allBadges = [...new Set([...manualBadges, ...autoBadges])];

	return {
		...route,
		category,
		badges: allBadges,
	};
}

/**
 * Try to infer category from route data
 * This is a fallback - ideally category is always provided
 */
function inferCategory(route: Route): RouteCategory {
	// Check route name or description for keywords
	const text = `${route.name} ${route.description || ''}`.toLowerCase();

	if (text.includes('gravel') || text.includes('dirt')) {
		return 'gravel';
	}
	if (text.includes('mountain') || text.includes('mtb') || text.includes('trail')) {
		return 'mountain';
	}

	// Default to road
	return 'road';
}
