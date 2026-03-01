import type { RouteCategory, RouteBadges, BadgeType, Trailhead } from '$lib/types';
import routeListsData from '$lib/data/route-lists.json';
import routeBadgesData from '$lib/data/route-badges.json';
import trailheadsData from '$lib/data/trailheads.json';

export function getRouteListId(category: RouteCategory): string {
	return routeListsData[category];
}

export function getRouteBadges(routeId: string | number): BadgeType[] {
	const badges = (routeBadgesData as RouteBadges)[String(routeId)];
	return badges || [];
}

export function getAllRouteBadges(): RouteBadges {
	return routeBadgesData as RouteBadges;
}

export function getAllTrailheads(): Trailhead[] {
	return trailheadsData as Trailhead[];
}

export function getTrailheadById(id: string): Trailhead | undefined {
	return (trailheadsData as Trailhead[]).find(t => t.id === id);
}
