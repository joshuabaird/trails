/**
 * Test script for RideWithGPS API integration
 * 
 * Run with: npx tsx scripts/test-api.ts
 */

import { RideWithGPSClient } from '../src/lib/api/ridewithgps';

async function testAPI() {
	console.log('🧪 Testing RideWithGPS API Integration\n');

	// Check for API key
	const apiKey = process.env.RIDEWITHGPS_API_KEY;
	if (!apiKey) {
		console.error('❌ RIDEWITHGPS_API_KEY environment variable is not set');
		console.log('Please create a .env file with your API key:');
		console.log('RIDEWITHGPS_API_KEY=your-key-here\n');
		process.exit(1);
	}

	console.log('✅ API key found');
	console.log(`   Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}\n`);

	const client = new RideWithGPSClient({ apiKey });

	// Test 1: Fetch a sample route (use a known public route ID)
	console.log('📍 Test 1: Fetching sample route...');
	try {
		// This is a test - you'll need to replace with an actual route ID
		const route = await client.getRoute(1);
		console.log('✅ Successfully fetched route:');
		console.log(`   Name: ${route.name}`);
		console.log(`   Distance: ${route.distance}m`);
		console.log(`   Elevation: ${route.elevation_gain}m\n`);
	} catch (error) {
		console.error('❌ Failed to fetch route:', error);
		console.log('   This might be expected if route ID 1 doesn\'t exist\n');
	}

	// Test 2: Try fetching from a collection
	console.log('📚 Test 2: Testing collection endpoint...');
	console.log('   (This will fail until you configure a valid collection ID in data/route-lists.json)\n');

	console.log('✅ API client setup complete!');
	console.log('\n📝 Next steps:');
	console.log('   1. Configure your route list IDs in data/route-lists.json');
	console.log('   2. Add some route IDs to data/route-badges.json');
	console.log('   3. Start the dev server: npm run dev');
	console.log('   4. Test the API routes: http://localhost:5173/api/routes\n');
}

testAPI().catch(console.error);
