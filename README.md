# Trails App 🚴

A web application for aggregating and displaying popular cycling routes from RideWithGPS, designed for the Danville/Boyle County Trails Alliance.

## Features

- **Route Aggregation**: Display top routes across three categories (road, gravel, mountain)
- **Interactive Maps**: Leaflet-powered maps showing route details and boundaries
- **Route Details**: View maps, elevation profiles, and key characteristics
- **Badge System**: Tag routes with metadata (difficulty, terrain, certifications)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Server-Side Rendering**: Fast initial loads and SEO-friendly

## Tech Stack

- **Framework**: [SvelteKit 2.x](https://kit.svelte.dev/) with Svelte 5 & TypeScript
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/) with custom nature/trail color palette
- **Maps**: [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles
- **Data Source**: [RideWithGPS API](https://ridewithgps.com/api)
- **Data Storage**: JSON-based configuration (no database required for MVP)

## Getting Started

### Prerequisites

- Node.js 22.12+ or 24.0+ (we recommend using [asdf](https://asdf-vm.com/) or [nvm](https://github.com/nvm-sh/nvm))
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd trails
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your RideWithGPS API credentials:

```
RIDEWITHGPS_API_KEY=your-api-key-here
RIDEWITHGPS_API_SECRET=your-api-secret-here
```

> **Note**: To obtain API credentials, visit [RideWithGPS API Documentation](https://ridewithgps.com/api)

4. **Configure route lists**

Edit `data/route-lists.json` to specify which RideWithGPS lists to display for each category:

```json
{
  "road": "your-road-list-id",
  "gravel": "your-gravel-list-id",
  "mountain": "your-mountain-list-id"
}
```

5. **Start the development server**

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see your app!

## Configuration

### Badge Management

Badges are managed through JSON configuration files in the `data/` directory:

#### `data/route-badges.json`

Assign badges to specific routes:

```json
{
  "route-id-123": ["beginner", "scenic", "flat"],
  "route-id-456": ["intermediate", "hilly", "popular"]
}
```

#### `data/badge-info.json`

Define badge types and their visual styling:

```json
[
  {
    "type": "beginner",
    "label": "Beginner",
    "color": "bg-green-100 text-green-800 border-green-200"
  }
]
```

### Color Palette

The app uses a custom nature-inspired color palette defined in `tailwind.config.js`:

- **Forest**: Deep greens for primary elements
- **Earth**: Browns and tans for secondary elements
- **Trail**: Muted greens for backgrounds and accents

## Project Structure

```
trails/
├── src/
│   ├── lib/
│   │   ├── api/          # RideWithGPS API integration
│   │   ├── components/   # Reusable Svelte components
│   │   ├── stores/       # Svelte stores for state management
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   ├── routes/           # SvelteKit pages and API routes
│   │   ├── +page.svelte          # Main page (route aggregation)
│   │   └── routes/[id]/          # Route detail pages
│   ├── app.css           # Global styles with Tailwind
│   └── app.html          # HTML template
├── data/                 # JSON configuration files
│   ├── route-lists.json
│   ├── route-badges.json
│   └── badge-info.json
├── static/               # Static assets
└── docs/                 # Documentation
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript type checking
- `npm run check:watch` - Run type checking in watch mode

### Adding New Routes

Routes are automatically pulled from RideWithGPS lists. To feature new routes:

1. Add routes to your RideWithGPS list (on ridewithgps.com)
2. The app will fetch them automatically on the next load

### Adding Badges to Routes

1. Open `data/route-badges.json`
2. Add an entry with the route ID and desired badges:

```json
{
  "123456": ["beginner", "scenic", "certified"]
}
```

3. Commit and deploy

### Creating Custom Badge Types

1. Add the badge type to `src/lib/types/route.ts`:

```typescript
export type BadgeType = 'beginner' | 'your-new-badge' | ...;
```

2. Add badge info to `data/badge-info.json`:

```json
{
  "type": "your-new-badge",
  "label": "Your Label",
  "color": "bg-blue-100 text-blue-800 border-blue-200"
}
```

## Deployment

### Recommended Platforms

- **[Vercel](https://vercel.com/)**: Zero-config deployment for SvelteKit
- **[Netlify](https://netlify.com/)**: Easy deployment with automatic builds
- **[Cloudflare Pages](https://pages.cloudflare.com/)**: Fast global CDN

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts and make sure to add your environment variables in the Vercel dashboard.

### Environment Variables in Production

Make sure to set these in your hosting platform:

- `RIDEWITHGPS_API_KEY`
- `RIDEWITHGPS_API_SECRET`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE) - feel free to use this project for your local trails alliance!

## Support

For questions or issues, please [open an issue](https://github.com/joshuabaird/trails/issues) on GitHub.

---

Built with ❤️ for the cycling community
