# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

XGrid Campers Ambassador Map - An embeddable web application that displays Ambassador program participants on an interactive map. The application is designed to be embedded into dealer websites via script tags and provides customers with the ability to discover and schedule viewings with Ambassador Campers, Dealers, and Events.

## Technology Stack

- **Frontend**: Next.js 15.5.2 (JavaScript)
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps JavaScript API
- **Styling**: Tailwind CSS with custom XGrid theme
- **Deployment**: AWS Amplify
- **Embedding**: Direct DOM injection via script tag (CORS compliant, no iframe)

## Development Commands

### Initial Setup
```bash
npx create-next-app@latest ambassador-map --js --tailwind --app --no-src-dir --import-alias "@/*"
npm install @supabase/supabase-js @googlemaps/js-api-loader
```

### Development
```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Testing
```bash
npm test           # Run test suite
npm run test:watch # Run tests in watch mode
npm run test:e2e   # Run end-to-end tests
```

## Project Architecture

### Key Directories
- `/app` - Next.js App Router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/public` - Static assets and embed.js script

### Core Components Structure
- `MapContainer` - Main map component with Google Maps integration
- `FilterPanel` - Handles manufacturer/model, type, and location filters
- `ResultsTable` - Displays ambassadors in table format with pagination
- `ScheduleModal` - Viewing request form with validation
- `EmbedScript` - Generates the embeddable widget

### API Routes
- `/api/ambassadors` - GET ambassadors with filters
- `/api/ambassadors/[id]` - GET single ambassador details
- `/api/cases` - POST viewing requests
- `/api/settings` - GET system settings
- `/api/camper-models` - GET camper models list

## Database Schema

Key tables from Supabase:
- `ambassadors` - Main ambassador data with GPS locations
- `camper_models` - Manufacturer and model information
- `ambassador_models` - Junction table linking ambassadors to models
- `cases` - Viewing request submissions
- `system_settings` - Dynamic content configuration

## Supabase MCP Server

This project uses the Supabase MCP server for direct database operations. The MCP server is configured and available for:
- Direct SQL queries to the Supabase database
- Schema inspection and table management
- Real-time database operations
- Database migrations and updates

Use the MCP server tools when you need to:
- Query or update database tables directly
- Inspect database schema
- Test database operations
- Debug database-related issues

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_BASE_URL=https://map.galvanic.ai
```

## AWS Deployment

### AWS SSO Configuration
This project uses AWS SSO with the profile `claude-dev-profile` which has administrator permissions.

### AWS CLI Commands
```bash
# Configure AWS SSO (if not already done)
aws configure sso

# Login to AWS SSO
aws sso login --profile claude-dev-profile

# Verify access
aws sts get-caller-identity --profile claude-dev-profile

# Deploy to Amplify
aws amplify push --profile claude-dev-profile
```

### AWS Amplify Setup
```bash
# Initialize Amplify in the project
amplify init --profile claude-dev-profile

# Add hosting
amplify add hosting

# Deploy
amplify publish --profile claude-dev-profile
```

### Important AWS Notes
- Always use `--profile claude-dev-profile` for AWS CLI commands
- The profile has administrator permissions for all AWS services
- Amplify deployment is configured for automatic builds from the main branch
- CloudFront distribution is set up for global CDN delivery

## Key Implementation Notes

### CORS Compliance
The application must be fully CORS compliant for embedding. Configure headers in `next.config.js`:
```javascript
headers: async () => [
  {
    source: '/embed.js',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET' }
    ]
  }
]
```

### Map Pin Distribution
When an ambassador has multiple campers, distribute pins evenly around the ambassador's GPS location at a 0.5 mile radius to prevent overlapping.

### Performance Requirements
- Initial load < 3 seconds on 3G
- Filter response < 500ms
- Support 1000+ ambassadors
- Cache static data for 5 minutes

### Security Considerations
- Implement reCAPTCHA v3 for form submissions
- Rate limiting: 5 submissions per IP per hour
- Sanitize all user inputs to prevent XSS
- Use parameterized queries for database operations
- Store sensitive keys in environment variables only

### Styling Guidelines
Follow XGrid brand colors:
- Primary: #000000 (black), #FFFFFF (white)
- Gray scale: #F5F5F5, #E0E0E0, #666666
- Accent: #0066CC (blue)
- Status: #28A745 (green), #DC3545 (red)

### Testing Priorities
1. Filter logic and distance calculations
2. Form validation and submission
3. Map interaction and responsiveness
4. API endpoint responses
5. Cross-browser compatibility