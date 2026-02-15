import type { BadgeType, BadgeInfo } from '$lib/types';
import badgeInfoData from '$lib/data/badge-info.json';

const badgeInfoMap = new Map<BadgeType, BadgeInfo>(
	badgeInfoData.map((badge) => [badge.type as BadgeType, badge as BadgeInfo])
);

export function getBadgeInfo(badgeType: BadgeType): BadgeInfo | undefined {
	return badgeInfoMap.get(badgeType);
}

export function getAllBadgeInfo(): BadgeInfo[] {
	return Array.from(badgeInfoMap.values());
}

export function formatDistance(meters: number): string {
	const miles = meters * 0.000621371;
	return `${miles.toFixed(1)} mi`;
}

export function formatElevation(meters: number): string {
	const feet = meters * 3.28084;
	return `${Math.round(feet).toLocaleString()} ft`;
}
