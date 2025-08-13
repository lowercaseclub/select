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
│   │   ├── bizzabo/          # Bizzabo API integration routes
│   │   │   ├── speakers/     # Speaker data endpoint
│   │   │   └── schedule/     # Schedule data endpoint
│   │   └── csrf/             # CSRF token endpoint
│   └── page.tsx              # Main landing page
├── components/               # React components
│   ├── application-form.tsx  # Application form component
│   ├── speakers-section.tsx  # Speaker display component
│   ├── schedule-section.tsx  # Schedule display component
│   └── ...
├── lib/
│   ├── bizzabo-api.ts        # Bizzabo API client
│   ├── customerio.ts         # Customer.io API clients
│   ├── rate-customer.ts      # Customer rating system
│   ├── csrf.ts              # CSRF protection utilities
│   ├── security.ts          # Security validation functions
│   └── data-fetcher.ts      # Client-side data fetching
└── types/                    # TypeScript type definitions
    ├── bizzabo.ts            # Raw API types
    ├── bizzabo-locations.ts  # Location mapping
    └── fallback-data.ts      # Fallback data types
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
```

3. **Start the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## ⚙️ Configuration

### 🔧 Required Configuration Changes

#### 1. Set the Correct Event ID

Update `BIZZABO_EVENT_ID` in your `.env.local` file to match your specific Bizzabo event:

```env
BIZZABO_EVENT_ID=756187  # Replace with your actual event ID
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

## 🎯 Customer Rating System

The application includes an intelligent customer rating system that analyzes applicants based on their Customer.io segments.

### Rating Tiers

- **Tier 1** (60+ points): High-value customers (Enterprise, Team plans, active engagement)
- **Tier 2** (40-59 points): Engaged customers (Pro plans, event participation)
- **Tier 3** (20-39 points): Moderate engagement (Free plans, basic activity)
- **Tier 4** (0-19 points): New or low-engagement customers

### Scoring Factors

#### Plan-Based Scoring (Highest Value)

- **Enterprise Plan**: 40 points
- **Team Plan**: 25 points
- **Pro Plan**: 15 points
- **Free Plan**: 5 points

#### Engagement Indicators

- **Event Participation**: 10 points each (applied/registered for Supabase events)
- **Launch Week Signups**: 8 points each (previous/current)
- **Service Activation**: 3 points per activated Supabase service
- **Organization Status**: 15-20 points (owners, active status)

### Application Process

1. **Customer Intelligence**: Fetches customer segments from Customer.io App API
2. **Rating Analysis**: Calculates customer score and tier based on segments
3. **Profile Update**: Updates customer profile in Customer.io Track API
4. **Event Tracking**: Records application event with rating data
5. **Data Storage**: Stores application and rating data (Supabase integration planned)

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Testing API Endpoints

```bash
# Test schedule endpoint
curl http://localhost:3000/api/bizzabo/schedule

# Test speakers endpoint
curl http://localhost:3000/api/bizzabo/speakers

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

### Debug Endpoints

_No debug endpoints are currently available. The application uses fallback data when the Bizzabo API is unavailable._

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **API Integration**: Bizzabo Partner API
- **Authentication**: OAuth 2.0 + API Key
- **Package Manager**: pnpm

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential.
