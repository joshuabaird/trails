#!/usr/bin/env tsx
/**
 * Verification Script for Phase 3
 * 
 * Tests the RideWithGPS API integration and verifies all components work
 * 
 * Usage: npm run verify
 */

import { getRideWithGPSClient } from '../src/lib/api/ridewithgps';
import { getAllRoutes, getRoutesByCategory, getRouteById } from '../src/lib/api/routes';
import { getRouteListId } from '../src/lib/utils/data';
import 'dotenv/config';

const API_KEY = process.env.RIDEWITHGPS_API_KEY;
const AUTH_TOKEN = process.env.RIDEWITHGPS_AUTH_TOKEN;

console.log('🧪 Phase 3 Verification Script\n');
console.log('================================\n');

if (!API_KEY) {
	console.error('❌ ERROR: RIDEWITHGPS_API_KEY not found in .env file');
	console.error('Please add your API key to the .env file');
	process.exit(1);
}

if (!AUTH_TOKEN) {
	console.warn('⚠️  WARNING: RIDEWITHGPS_AUTH_TOKEN not found in .env file');
	console.warn('Some API calls may fail without the auth token\n');
}

async function verify() {
	try {
		console.log('✅ API credentials loaded\n');

		// Test 1: Check route list configuration
		console.log('📋 Test 1: Checking route list configuration...');
		const roadListId = getRouteListId('road');
		const gravelListId = getRouteListId('gravel');
		const mountainListId = getRouteListId('mountain');

		console.log(`   Road list ID: ${roadListId}`);
		console.log(`   Gravel list ID: ${gravelListId}`);
		console.log(`   Mountain list ID: ${mountainListId}\n`);

		if (gravelListId.includes('your-')) {
			console.warn('⚠️  Gravel list ID not configured yet');
		}
		if (mountainListId.includes('your-')) {
			console.warn('⚠️  Mountain list ID not configured yet\n');
		}

		// Test 2: Fetch routes from configured categories
		console.log('🚴 Test 2: Fetching routes from RideWithGPS...');
		
		const options = { 
			limit: 3,
			apiKey: API_KEY,
			authToken: AUTH_TOKEN
		};

		console.log('   Fetching road routes...');
		const roadRoutes = await getRoutesByCategory('road', options);
		console.log(`   ✅ Found ${roadRoutes.length} road routes`);
		
		if (roadRoutes.length > 0) {
			const firstRoute = roadRoutes[0];
			console.log(`      - ${firstRoute.name}`);
			console.log(`        Distance: ${(firstRoute.distance * 0.000621371).toFixed(1)} mi`);
			console.log(`        Elevation: ${Math.round(firstRoute.elevation_gain * 3.28084)} ft`);
			console.log(`        Badges: ${firstRoute.badges.length > 0 ? firstRoute.badges.join(', ') : 'none'}`);
		}
		console.log();

		// Test 3: Fetch single route details
		if (roadRoutes.length > 0) {
			console.log('🔍 Test 3: Fetching single route details...');
			const testRoute = roadRoutes[0];
			const routeDetails = await getRouteById(testRoute.id, 'road', API_KEY, AUTH_TOKEN);
			
			console.log(`   ✅ Route details loaded for: ${routeDetails.name}`);
			console.log(`      Location: ${routeDetails.locality || 'N/A'}, ${routeDetails.administrative_area || 'N/A'}`);
			console.log(`      Has map data: ${routeDetails.sw_lat ? 'Yes' : 'No'}`);
			console.log(`      Has start coordinates: ${routeDetails.first_lat ? 'Yes' : 'No'}`);
			console.log(`      External URL: ${routeDetails.html_url || 'N/A'}`);
			console.log();
		}

		// Test 4: Test getAllRoutes (parallel fetch)
		console.log('⚡ Test 4: Testing parallel route fetching...');
		const startTime = Date.now();
		const allRoutes = await getAllRoutes({ limit: 2, apiKey: API_KEY, authToken: AUTH_TOKEN });
		const endTime = Date.now();
		
		console.log(`   ✅ Fetched all categories in ${endTime - startTime}ms`);
		console.log(`      Road: ${allRoutes.road.length} routes`);
		console.log(`      Gravel: ${allRoutes.gravel.length} routes`);
		console.log(`      Mountain: ${allRoutes.mountain.length} routes`);
		console.log();

		// Summary
		console.log('================================');
		console.log('🎉 All tests passed!\n');
		console.log('Your Phase 3 setup is working correctly.');
		console.log('Run `npm run dev` to start the development server.\n');

		// Recommendations
		console.log('📝 Recommendations:');
		if (gravelListId.includes('your-') || mountainListId.includes('your-')) {
			console.log('   - Update data/route-lists.json with your gravel and mountain collection IDs');
		}
		if (roadRoutes.length > 0 && roadRoutes[0].badges.length === 0) {
			console.log('   - Add badges to your routes in data/route-badges.json');
		}
		console.log('   - Visit http://localhost:5173 after starting the dev server');
		console.log();

	} catch (error) {
		console.error('\n❌ Verification failed!');
		console.error('Error:', error instanceof Error ? error.message : error);
		console.error('\nPlease check:');
		console.error('1. Your API credentials are correct');
		console.error('2. Your route list IDs exist and are public');
		console.error('3. You have network connectivity');
		process.exit(1);
	}
}

// Run verification
verify();
