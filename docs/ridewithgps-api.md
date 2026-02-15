// RideWithGPS API Documentation Notes
// ===================================
//
// Base URL: https://ridewithgps.com/api/v2
//
// Common Endpoints (to be verified with actual API docs):
// - GET /users/{user_id}/routes - Get routes for a user
// - GET /routes/{route_id} - Get route details
// - GET /users/{user_id}/route_lists - Get user's route lists
// - GET /route_lists/{list_id} - Get routes in a specific list
// - GET /route_lists/{list_id}/routes - Get all routes in a list
//
// Authentication:
// - API key-based authentication (details TBD)
// - May use query params or headers for auth
//
// Rate Limiting:
// - TBD - implement exponential backoff
//
// Response Format:
// - JSON responses
// - Pagination may be required for large lists
//
// TODO: Verify these endpoints with official RideWithGPS API documentation
// Official docs should be at: https://ridewithgps.com/api or similar
