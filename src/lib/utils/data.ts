import type { RouteCategory, RouteBadges, BadgeType } from '$lib/types';
import routeListsData from '$lib/data/route-lists.json';
import routeBadgesData from '$lib/data/route-badges.json';

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
