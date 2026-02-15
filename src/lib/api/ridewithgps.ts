/**
 * RideWithGPS API Client
 * 
 * Documentation: https://ridewithgps.com/api/v1/doc/endpoints/routes
 * 
 * API Base: https://ridewithgps.com/api/v1
 * 
 * Available Endpoints:
 * - Routes: Get, create, update route information
 * - Collections: Group routes together (what we'll use for categories)
 * - Users: User information and their routes
 * - Trips: Recorded rides
 * - POIs: Points of interest
 */

import type { Route } from '$lib/types';

const API_BASE_URL = 'https://ridewithgps.com/api/v1';

interface RideWithGPSConfig {
	apiKey: string;
	authToken?: string; // Optional: for Basic Auth (api_key:auth_token)
	version?: string;
}

interface RideWithGPSResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	results?: T[];
}

interface RouteListResponse {
	routes: Route[];
	total: number;
	page: number;
	per_page: number;
}

export class RideWithGPSClient {
	private apiKey: string;
	private authToken?: string;
	private baseUrl: string;

	constructor(config: RideWithGPSConfig) {
		this.apiKey = config.apiKey;
		this.authToken = config.authToken;
		this.baseUrl = config.version ? `https://ridewithgps.com/api/${config.version}` : API_BASE_URL;
	}

	/**
	 * Make authenticated request to RideWithGPS API
	 * 
	 * RideWithGPS supports two authentication methods:
	 * 1. Basic Auth: api_key:auth_token
	 * 2. Custom headers: x-rwgps-api-key and x-rwgps-auth-token
	 */
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = new URL(`${this.baseUrl}${endpoint}`);
		
		// Build authentication headers
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			...options.headers,
		};

		if (this.authToken) {
			// Method 1: Basic Authentication with api_key:auth_token
			const credentials = `${this.apiKey}:${this.authToken}`;
			const authHeader = `Basic ${btoa(credentials)}`;
			headers['Authorization'] = authHeader;
		} else {
			// Method 2: Alternative header format (if only API key provided)
			headers['x-rwgps-api-key'] = this.apiKey;
		}

		try {
			const response = await fetch(url.toString(), {
				...options,
				headers,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`RideWithGPS API Error: ${response.status} ${response.statusText} - ${errorText}`);
			}

			const data = await response.json();
			return data as T;
		} catch (error) {
			console.error('RideWithGPS API request failed:', error);
			throw error;
		}
	}

	/**
	 * Get a single route by ID
	 * https://ridewithgps.com/api/v1/doc/endpoints/routes
	 */
	async getRoute(routeId: string | number): Promise<Route> {
		const response = await this.request<any>(`/routes/${routeId}.json`);
		// RideWithGPS API returns { route: {...} } for single route
		return response.route || response;
	}

	/**
	 * Get routes from a user
	 */
	async getUserRoutes(userId: string | number, options?: {
		limit?: number;
		offset?: number;
	}): Promise<RouteListResponse> {
		const params = new URLSearchParams();
		if (options?.limit) params.append('limit', options.limit.toString());
		if (options?.offset) params.append('offset', options.offset.toString());
		
		const query = params.toString() ? `?${params.toString()}` : '';
		return this.request<RouteListResponse>(`/users/${userId}/routes${query}`);
	}

	/**
	 * Get routes from a collection/list
	 * Collections are how RideWithGPS groups routes together
	 */
	async getCollectionRoutes(collectionId: string | number): Promise<Route[]> {
		try {
			// Collections endpoint returns: { collection: { routes: [...] } }
			const response = await this.request<{ collection: { routes: Route[] } }>(
				`/collections/${collectionId}.json`
			);
			return response.collection?.routes || [];
		} catch (error) {
			console.error(`Failed to fetch collection ${collectionId}:`, error);
			return [];
		}
	}

	/**
	 * Search for routes with filters
	 */
	async searchRoutes(params: {
		query?: string;
		userId?: string | number;
		limit?: number;
		offset?: number;
	}): Promise<Route[]> {
		const searchParams = new URLSearchParams();
		if (params.query) searchParams.append('q', params.query);
		if (params.userId) searchParams.append('user_id', params.userId.toString());
		if (params.limit) searchParams.append('limit', params.limit.toString());
		if (params.offset) searchParams.append('offset', params.offset.toString());

		const response = await this.request<RouteListResponse>(
			`/routes/search?${searchParams.toString()}`
		);
		return response.routes || [];
	}

	/**
	 * Get multiple routes by IDs (batch request optimization)
	 */
	async getRoutes(routeIds: (string | number)[]): Promise<Route[]> {
		// Make parallel requests for better performance
		const promises = routeIds.map(id => this.getRoute(id).catch(err => {
			console.error(`Failed to fetch route ${id}:`, err);
			return null;
		}));
		
		const results = await Promise.all(promises);
		return results.filter((route): route is Route => route !== null);
	}
}

/**
 * Create a singleton instance using environment variables
 */
let clientInstance: RideWithGPSClient | null = null;

export function getRideWithGPSClient(apiKey?: string, authToken?: string): RideWithGPSClient {
	if (!clientInstance) {
		const key = apiKey || process.env.RIDEWITHGPS_API_KEY;
		const token = authToken || process.env.RIDEWITHGPS_AUTH_TOKEN;
		
		if (!key) {
			throw new Error('RideWithGPS API key is required. Set RIDEWITHGPS_API_KEY environment variable.');
		}
		
		clientInstance = new RideWithGPSClient({ 
			apiKey: key,
			authToken: token 
		});
	}
	return clientInstance;
}
