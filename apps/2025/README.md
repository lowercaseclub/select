# Select 2025 Conference Website

A modern conference website built with Next.js, featuring dynamic speaker and schedule data integration with Bizzabo's event management platform.

## 🏗️ Architecture

### Data Flow

```
Bizzabo API → Next.js API Routes → Client Components → React UI
```

### Key Components

- **Client Types** (`src/lib/data-fetcher.ts`): Display-ready data structures for React components
- **Server Types** (`src/types/bizzabo.ts`): Raw Bizzabo API response types
- **Fallback Data** (`src/types/fallback-data.ts`): Hardcoded data when API is unavailable
- **Location Mapping** (`src/types/bizzabo-locations.ts`): Maps Bizzabo location IDs to display names

### File Structure

```
src/
├── app/
│   ├── api/                  # API routes
│   │   ├── apply/            # Application submission endpoint
│   │   ├── csrf/             # CSRF token endpoint
│   │   ├── schedule/         # Schedule data endpoint
│   │   └── speakers/         # Speaker data endpoint
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main landing page
├── components/               # React components
│   ├── application-form.tsx  # Application form component
│   ├── speakers-section.tsx  # Speaker display component
│   ├── schedule-section.tsx  # Schedule display component
│   ├── hero-section.tsx      # Hero landing section
│   ├── about-section.tsx     # About section
│   ├── animated-grid.tsx     # Background animation
│   └── ...                   # Other UI components
├── data/
│   └── schedule.json         # Static schedule data
├── hooks/                    # Custom React hooks
│   ├── use-animation-controls.ts
│   └── use-media-query.ts
├── lib/
│   ├── actions.ts            # Server actions
│   ├── bizzabo-api.ts        # Bizzabo API client
│   ├── bizzabo-transformers.ts # Data transformation utilities
│   ├── customerio.ts         # Customer.io API clients
│   ├── rate-customer.ts      # Customer rating system
│   ├── csrf.ts              # CSRF protection utilities
│   ├── security.ts          # Security validation functions
│   └── debug.ts              # Debug utilities
├── middleware.ts             # Next.js middleware
└── types/                    # TypeScript type definitions
    ├── bizzabo.types.ts      # Raw API types
    └── bizzabo-locations.ts  # Location mapping
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Bizzabo API credentials

### Installation

1. **Clone and install dependencies:**

```bash
cd apps/2025
pnpm install
```

2. **Set up environment variables:**
   Create a `.env.local` file in the `apps/2025` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Bizzabo API Credentials
BIZZABO_CLIENT_ID=your-client-id
BIZZABO_CLIENT_SECRET=your-client-secret
BIZZABO_ACCOUNT_ID=your-account-id
BIZZABO_API_KEY=your-api-key

# Bizzabo Event Configuration
BIZZABO_EVENT_ID=your-event-id

# Customer.io API Credentials
CUSTOMERIO_SITE_ID=your-site-id
CUSTOMERIO_API_KEY=your-api-key
CUSTOMERIO_APP_API_KEY=your-app-api-key

# OpenAI Key
OPENAI_API_KEY=your-openai-key

# MISC
ANNOUNCING_SOON_SPEAKERS=3
NEXT_PUBLIC_SHOW_ANIMATION_CONTROL=true
```

3. **Start the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## ⚙️ Configuration

### 🔄 Caching & Performance

- **Static Regeneration**: Pages are statically generated and revalidated every 5 minutes (`export const revalidate = 300`)
- **Cache Environment Variable**: Optional `CACHE_REVALIDATE_SECONDS` to override default cache duration
- **API Data Freshness**: Speaker and schedule data from Bizzabo API is cached for optimal performance

### 🔧 Required Configuration Changes

#### 1. Set the Correct Event ID

Update `BIZZABO_EVENT_ID` in your `.env.local` file to match your specific Bizzabo event:

```env
BIZZABO_EVENT_ID=123456  # Replace with your actual event ID
```

#### 2. Configure Location Mappings

Edit `src/types/bizzabo-locations.ts` to match your event's location IDs:

```typescript
export const BIZZABO_LOCATIONS: BizzaboLocation[] = [
  {
    id: 131741, // Replace with your Main Stage location ID
    name: "Main Stage",
    nameId: "main-stage",
    description: "HQ Building 1",
  },
  {
    id: 131743, // Replace with your Build Stage location ID
    name: "Build Stage",
    nameId: "build-stage",
    description: "520 YC",
  },
];
```

**Note:** Location IDs must be hardcoded because Bizzabo doesn't provide a locations API endpoint. You'll need to determine the correct location IDs from your Bizzabo event setup.

### 🔍 Finding Your Configuration Values

1. **Event ID**: Found in your Bizzabo event URL or dashboard
2. **Location IDs**: Check your Bizzabo event's session data or contact Bizzabo support
3. **API Credentials**: Available in your Bizzabo Partner API dashboard

## 🎯 Features

- **Dynamic Speaker Data**: Pulls speaker information from Bizzabo API
- **Real-time Schedule**: Displays event schedule with session details
- **Application System**: Secure application form with CSRF protection
- **Customer Intelligence**: Customer.io integration for applicant rating and segmentation
- **Fallback Support**: Graceful degradation when API is unavailable
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## 🔄 API Integration

### Bizzabo API Endpoints Used

- `GET /events/{eventId}/agenda/sessions` - Session data
- `GET /events/{eventId}/speakers` - Speaker information

### Customer.io API Integration

- **Track API**: Used for creating/updating customer profiles and tracking events
- **App API**: Used for fetching customer segments and rating applicants

### Authentication

- **Bizzabo**: OAuth 2.0 Client Credentials flow with fallback to API key authentication
- **Customer.io Track API**: Basic authentication with Site ID and API Key
- **Customer.io App API**: Bearer token authentication with App API Key

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # ts linting
```

### Testing API Endpoints

```bash

# Test CSRF token endpoint
curl http://localhost:3000/api/csrf

# Test application endpoint (POST with CSRF token)
curl -X POST http://localhost:3000/api/apply \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-csrf-token" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **"Sessions/stages not available yet, using fallback data"**

   - Check that `BIZZABO_EVENT_ID` is correct
   - Verify your event has published sessions in Bizzabo
   - Ensure API credentials are valid

2. **"Bizzabo API configuration is missing"**

   - Verify all environment variables are set in `.env.local`
   - Restart the development server after adding environment variables

3. **Location mapping issues**

   - Update location IDs in `src/types/bizzabo-locations.ts`
   - Check that location IDs match your Bizzabo event setup

4. **Customer.io API errors**

   - Verify `CUSTOMERIO_APP_API_KEY` is set for App API access
   - Check that `CUSTOMERIO_SITE_ID` and `CUSTOMERIO_API_KEY` are set for Track API
   - Ensure API keys have correct permissions

5. **CSRF token validation failures**
   - Check that the CSRF token is being sent in the `X-CSRF-Token` header
   - Verify the token hasn't expired (tokens are valid for 1 hour)
