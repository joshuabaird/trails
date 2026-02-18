// Route category types
export type RouteCategory = 'road' | 'gravel' | 'mountain';

// Badge types
export type BadgeType =
	| 'beginner'
	| 'intermediate'
	| 'advanced'
	| 'hilly'
	| 'flat'
	| 'rolling'
	| 'certified'
	| 'popular'
	| 'featured'
	| 'scenic'
	| 'family-friendly'
	| 'knobs';

// Route data from RideWithGPS API
export interface Route {
	id: number;
	name: string;
	distance: number; // in meters
	elevation_gain: number; // in meters
	elevation_loss?: number; // in meters
	description?: string;
	created_at: string;
	updated_at: string;
	visibility: number;
	user_id: number;
	track_id?: string;
	track_type?: string; // e.g., 'loop', 'out_and_back'
	track_download_url?: string; // GPX download URL if provided by API
	terrain?: string;
	surface?: string;
	difficulty?: string;
	locality?: string;
	administrative_area?: string;
	country_code?: string;
	postal_code?: string;
	bounding_box?: number[];
	sw_lat?: number;
	sw_lng?: number;
	ne_lat?: number;
	ne_lng?: number;
	first_lat?: number; // starting point latitude
	first_lng?: number; // starting point longitude
	html_url?: string; // URL to view route on RideWithGPS
	// Add other fields as needed from RideWithGPS API
}

// Enhanced route with local metadata
export interface EnhancedRoute extends Route {
	category: RouteCategory;
	badges: BadgeType[];
}

// Configuration for route lists
export interface RouteListConfig {
	road: string; // RideWithGPS list ID
	gravel: string; // RideWithGPS list ID
	mountain: string; // RideWithGPS list ID
}

// Badge configuration
export interface RouteBadges {
	[routeId: string]: BadgeType[];
}

// Badge metadata for display
export interface BadgeInfo {
	type: BadgeType;
	label: string;
	color: string; // Tailwind color class
	icon?: string;
}

// Trailhead data (stored in src/lib/data/trailheads.json)
export interface Trailhead {
	id: string;               // URL-safe slug, e.g. "perryville-battlefield"
	name: string;             // Display name
	lat: number;              // WGS84 latitude
	lng: number;              // WGS84 longitude
	address?: string;         // Street address
	parking: 'none' | 'limited' | 'ample';
	water: boolean;           // Potable water available on-site?
	restrooms: boolean;       // Restrooms on-site?
	surfaceType?: string;     // e.g. "paved", "gravel", "dirt", "mixed"
	description?: string;
	nearbyRouteIds?: number[]; // RideWithGPS route IDs to show as "nearby routes"
}
