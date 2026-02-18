# Trailheads Feature — Implementation Plan

## Overview

Add a Trailheads section to the site showcasing Boyle County's trailheads on an interactive map. Users can click a trailhead to see detailed information (parking, water, restrooms, surface type, address, etc.) and discover nearby cycling routes.

The feature follows the same patterns already established in the codebase: a local JSON "database", a SvelteKit API endpoint, server-side data loading, and Svelte page components. The primary new element is an **interactive Leaflet.js map** for displaying multiple clickable trailhead pins.

---

## Map Library Decision
    
**Leaflet.js** — See `docs/features/trailheads/map-library-options.md` for the full comparison.

**Why Leaflet over Google Maps / Mapbox:**
- Free and open source — no billing account or credit card required
- OpenStreetMap tiles are free with attribution and excellent quality for rural Kentucky
- No API key needed — nothing to manage, rotate, or accidentally expose
- Lightweight (~42KB gzipped) — fast page loads
- Sufficient for a simple multi-pin trailhead locator
- Already the documented decision in `docs/plan.md`

If the site eventually needs satellite imagery or scales significantly, **Mapbox** is the natural upgrade path.

---

## Architecture

```
src/lib/data/trailheads.json          ← our "database" of trailhead records
src/lib/types/route.ts                ← add Trailhead interface
src/lib/utils/data.ts                 ← add getAllTrailheads(), getTrailheadById()
src/routes/api/trailheads/+server.ts  ← GET /api/trailheads
src/lib/components/TrailheadMap.svelte← Leaflet map with clickable pins
src/routes/trailheads/+page.server.ts ← server-side data loading
src/routes/trailheads/+page.svelte    ← main Trailheads page
src/lib/components/Navigation.svelte  ← add "Trailheads" nav link
```

---

## Step-by-Step Implementation

### Step 1 — TypeScript Interface

**File:** `src/lib/types/route.ts`

Add a `Trailhead` interface alongside the existing `Route` types:

```typescript
export interface Trailhead {
  id: string;                         // slug, e.g. "perryville-battlefield"
  name: string;                       // display name
  lat: number;                        // WGS84 latitude
  lng: number;                        // WGS84 longitude
  address?: string;                   // street address
  parking: 'none' | 'limited' | 'ample';
  water: boolean;                     // potable water available?
  restrooms: boolean;                 // restrooms on-site?
  surfaceType?: string;               // e.g. "paved", "gravel", "dirt", "mixed"
  description?: string;
  nearbyRouteIds?: number[];          // RideWithGPS route IDs
}
```

**File:** `src/lib/types/index.ts`

Export `Trailhead` from the types barrel file.

---

### Step 2 — JSON Data File

**File:** `src/lib/data/trailheads.json` _(create new)_

An array of trailhead objects. This is the primary place the team maintains trailhead data. Example structure:

```json
[
  {
    "id": "example-trailhead",
    "name": "Example Trailhead",
    "lat": 37.6464,
    "lng": -84.7722,
    "address": "123 Main St, Danville, KY 40422",
    "parking": "ample",
    "water": true,
    "restrooms": true,
    "surfaceType": "paved",
    "description": "A great starting point for road and gravel rides.",
    "nearbyRouteIds": [1234567, 2345678]
  }
]
```

**Fields reference:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | `string` | ✅ | URL-safe slug, unique |
| `name` | `string` | ✅ | Display name |
| `lat` | `number` | ✅ | Decimal degrees |
| `lng` | `number` | ✅ | Decimal degrees |
| `address` | `string` | — | Full street address |
| `parking` | `'none' \| 'limited' \| 'ample'` | ✅ | |
| `water` | `boolean` | ✅ | Potable water on-site |
| `restrooms` | `boolean` | ✅ | |
| `surfaceType` | `string` | — | e.g. `"paved"`, `"gravel"`, `"dirt"`, `"mixed"` |
| `description` | `string` | — | Short description |
| `nearbyRouteIds` | `number[]` | — | RideWithGPS route IDs to highlight |

---

### Step 3 — Data Utility Functions

**File:** `src/lib/utils/data.ts`

Add two helper functions alongside the existing route helpers:

```typescript
import trailheadsData from '$lib/data/trailheads.json';
import type { Trailhead } from '$lib/types';

export function getAllTrailheads(): Trailhead[] {
  return trailheadsData as Trailhead[];
}

export function getTrailheadById(id: string): Trailhead | undefined {
  return (trailheadsData as Trailhead[]).find(t => t.id === id);
}
```

---

### Step 4 — API Endpoint

**File:** `src/routes/api/trailheads/+server.ts` _(create new)_

A `GET /api/trailheads` handler. Since the data is local JSON (no external API calls), this is straightforward. Use a long cache TTL since data only changes on deploy.

```typescript
// GET /api/trailheads
// Returns all trailheads from src/lib/data/trailheads.json
// Cache: 1 hour (data is static between deploys)
```

Pattern mirrors the existing `/api/routes/+server.ts`.

---

### Step 5 — Install Leaflet.js

```bash
npm install leaflet
npm install --save-dev @types/leaflet
```

Leaflet requires `window` and cannot run server-side. All Leaflet usage must be inside `onMount` or use a dynamic `import()`. See Step 6 for the SSR-safe pattern.

---

### Step 6 — TrailheadMap Component

**File:** `src/lib/components/TrailheadMap.svelte` _(create new)_

The interactive map showing all trailheads as clickable pins.

**Props:**
- `trailheads: Trailhead[]` — all trailheads to display as markers
- `selectedId: string | null` — ID of the currently-selected trailhead

**Behavior:**
- Initializes a Leaflet map instance inside `onMount` (SSR-safe)
- Uses OpenStreetMap raster tiles (free, no API key)
- Centers on the Boyle County area; fits bounds to all markers on load
- Renders a custom styled marker for each trailhead
- Dispatches a `select` event with the trailhead ID when a marker is clicked
- Watches `selectedId` — when it changes, pans/zooms to that marker and opens its popup

**Marker style:** Forest-green circle icon consistent with the site's design system, with a 📍 or map-pin SVG. Active/selected marker uses a distinct highlight color.

**Map tiles:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` with required OSM attribution.

---

### Step 7 — Trailheads Page (Server)

**File:** `src/routes/trailheads/+page.server.ts` _(create new)_

Loads all trailheads server-side. For nearby routes, we fetch route data only for the routes referenced in `nearbyRouteIds` — but to keep the initial load simple, this can be done client-side on demand when a trailhead is selected (avoids fetching all nearby route data upfront for every trailhead).

```typescript
export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/trailheads');
  if (!res.ok) throw error(500, 'Failed to load trailheads');
  const trailheads = await res.json();
  return { trailheads };
};
```

---

### Step 8 — Trailheads Page (UI)

**File:** `src/routes/trailheads/+page.svelte` _(create new)_

**Page layout:**

```
┌─────────────────────────────────────────────────────┐
│  HERO BANNER                                        │
│  "Explore Boyle County Trailheads"                  │
│  Subtitle + trailhead count stat                    │
└─────────────────────────────────────────────────────┘
┌──────────────────────────┬──────────────────────────┐
│                          │  DETAIL PANEL            │
│  TRAILHEADMAP            │  (hidden until a pin     │
│  (Leaflet, ~60% width)   │   is selected)           │
│                          │                          │
│  [clickable pins for     │  • Name                  │
│   each trailhead]        │  • Address               │
│                          │  • Amenity icons:        │
│                          │    🅿 Parking level      │
│                          │    💧 Water (yes/no)     │
│                          │    🚻 Restrooms (yes/no) │
│                          │  • Surface type          │
│                          │  • Description           │
│                          │  • Nearby Routes list    │
│                          │    (linked to route      │
│                          │     detail pages)        │
└──────────────────────────┴──────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  TRAILHEAD CARDS (responsive grid)                  │
│  One card per trailhead:                            │
│  • Name + surface type                              │
│  • Amenity icon row (parking / water / restrooms)   │
│  • Short description excerpt                        │
│  • "View on map" button → sets selectedTrailhead    │
└─────────────────────────────────────────────────────┘
```

**State:**
- `selectedTrailhead: Trailhead | null` — drives the detail panel and map highlight
- Clicking a map pin or a card's "View on map" button sets `selectedTrailhead`
- Map pans to the selected trailhead automatically (via `selectedId` prop on `TrailheadMap`)

**Nearby Routes:**
- The detail panel lists nearby route names as links to `/routes/[category]/[id]`
- Route data for `nearbyRouteIds` is fetched client-side when a trailhead is selected (lazy, on demand)
- Uses the existing `/api/routes/[category]/[id]` endpoint

**Mobile layout:**
- Map stacks above the detail panel (full width)
- Cards appear in a single column below
- Detail panel slides in below the map when a pin is tapped

**SEO:**
```html
<title>Trailheads — Boyle County Trails</title>
<meta name="description" content="Find trailheads across Boyle County..." />
```

---

### Step 9 — Navigation Update

**File:** `src/lib/components/Navigation.svelte`

Add `{ href: '/trailheads', label: 'Trailheads' }` to the `navLinks` array. The existing active-tab highlight logic handles the rest automatically.

---

## Nearby Routes Strategy

**Chosen approach: Manual curation in JSON** (Option A)

Store `nearbyRouteIds` (RideWithGPS route IDs) directly in `trailheads.json`. This is consistent with how the badge system works — editorial control over what gets shown.

The alternative (auto-proximity calculation using `first_lat`/`first_lng` from the API) was considered but rejected: it requires pulling the full routes list into the server load, adds complexity, and the automatic results may not always reflect the best routes to highlight from a particular trailhead.

Route links in the detail panel navigate to existing pages at `/routes/[category]/[id]` — no new pages needed.

---

## Implementation Checklist

### Data & Types
- [ ] Add `Trailhead` interface to `src/lib/types/route.ts`
- [ ] Export `Trailhead` from `src/lib/types/index.ts`
- [ ] Create `src/lib/data/trailheads.json` with initial trailhead records
- [ ] Add `getAllTrailheads()` and `getTrailheadById()` to `src/lib/utils/data.ts`

### API
- [ ] Create `src/routes/api/trailheads/+server.ts` (`GET /api/trailheads`)

### Map Library
- [ ] `npm install leaflet`
- [ ] `npm install --save-dev @types/leaflet`

### Components & Pages
- [ ] Create `src/lib/components/TrailheadMap.svelte`
- [ ] Create `src/routes/trailheads/+page.server.ts`
- [ ] Create `src/routes/trailheads/+page.svelte`

### Navigation
- [ ] Add "Trailheads" link to `src/lib/components/Navigation.svelte`

### Content
- [ ] Populate `trailheads.json` with real Boyle County trailhead data (lat/lng, amenities, descriptions)
- [ ] Add `nearbyRouteIds` for each trailhead linking to relevant RideWithGPS routes

---

## Implementation Order

Dependencies flow in this order — implement in sequence:

1. **Types** → `Trailhead` interface + export
2. **JSON data file** → even a stub with one trailhead is enough to develop against
3. **Utility functions** → depend on types + JSON
4. **API endpoint** → depends on utilities
5. **Install Leaflet**
6. **`TrailheadMap` component** → depends on Leaflet + types
7. **`+page.server.ts`** → depends on API
8. **`+page.svelte`** → depends on all of the above
9. **Navigation** → last, after the page route exists
