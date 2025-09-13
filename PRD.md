# Product Requirements Document (PRD)
# XGrid Campers Ambassador Map - Embeddable Web Application

## 1. Executive Summary

### Product Overview
A single-page, embeddable web application that displays XGrid Campers' Ambassador program participants on an interactive map. This application will be embedded into dealer websites via script tags and provide customers with the ability to discover and schedule viewings with Ambassador Campers, Dealers, and Events.

### Key Business Objectives
- Enable customers to discover Ambassador Campers near their location
- Facilitate scheduling of camper viewings
- Provide seamless integration with dealer websites
- Enhance the Ambassador program visibility and engagement

## 2. Technical Architecture

### Technology Stack
- **Frontend Framework**: Next.js 15.5.2 (JavaScript)
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps JavaScript API
- **Styling**: Tailwind CSS with custom XGrid theme
- **Deployment**: AWS Amplify
- **Version Control**: GitHub

### Embedding Mechanism
```html
<script src="https://[domain]/embed.js" 
        data-container-id="ambassador-map"
        data-base-url="https://[domain]">
</script>
```

## 3. Database Schema

### Tables and Relationships

#### camper_models (CONFIRMED)
- `id` (primary key)
- `created_at` (timestamp)
- `manufacturer` (string) - e.g., "Opus"
- `model_name` (string) - e.g., "OP4 LE"
- `trim_name` (string) - e.g., "Limited Edition"
- `year` (number) - e.g., 2024
- `hero_image_url` (text) - Base64 encoded or URL for model image

#### ambassadors
- `id` (primary key)
- `public_name` (string) - Display name for public viewing
- `ambassador_type` (enum: 'ambassador', 'dealer', 'event')
- `gps_location` (json) - Format: `{"lat": 32.7767, "lng": -96.7970}`
- `zip_code` (string) - For location display
- `city` (string)
- `state` (string)
- `hero_image_url` (string) - Main camper image
- `is_active` (boolean) - Whether to show on map
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### ambassador_models (Junction Table)
- `id` (primary key)
- `ambassador_id` (foreign key → ambassadors.id)
- `camper_model_id` (foreign key → camper_models.id)
- `image_url_1` (string) - Additional camper image
- `image_url_2` (string) - Additional camper image
- `image_url_3` (string) - Additional camper image
- `created_at` (timestamp)

#### system_settings
- `id` (primary key)
- `settings_key` (string) - Unique key identifier
- `settings_value` (text) - HTML/text content
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### cases (Existing Table for Viewing Requests)
- `id` (primary key)
- `ambassador_id` (foreign key → ambassadors.id)
- `name` (string, required)
- `email` (string, required)
- `phone` (string, required)
- `message` (text) - "Tell us what you're looking for"
- `ip_address` (string) - For security/spam prevention
- `user_agent` (string) - Browser information
- `created_at` (timestamp)
- `status` (enum: 'pending', 'contacted', 'completed', 'spam')

## 4. Feature Requirements

**Overview**
This MUST be a CORS compliant page that's responsive on the hosted site, so NO iframe.

### 4.1 Header Section
**Description**: Dynamic HTML content section at the top of the page
**Implementation**:
- Fetch content from `system_settings` where `settings_key = 'map_config_headertext'`
- Render as HTML with proper sanitization
- Support responsive design
- Cache for performance

### 4.2 Filter System

#### 4.2.1 Manufacturer & Model Filter
- **Type**: Dropdown/Select
- **Data Source**: Join `camper_models` table
- **Format**: "Manufacturer - Model Name - Trim Name" (e.g., "Opus - OP4 LE - Limited Edition")
- **Behavior**: 
  - Default: "All Campers"
  - Updates map pins and table in real-time
  - Maintains selection across other filter changes

#### 4.2.2 Type Filter
- **Type**: Radio buttons or dropdown
- **Options**:
  - All Types (default)
  - Ambassadors Only
  - Dealers Only
  - Events Only
- **Data Source**: `ambassadors.ambassador_type` field
- **Visual Indicators**:
  - Ambassador: Red pin/indicator
  - Dealer: Blue pin/indicator
  - Event: Green pin/indicator

#### 4.2.3 Location-Based Filter
- **Components**:
  1. **Zip Code Input**:
     - Text input with validation (5 digits)
     - Placeholder: "Enter Zip Code"
     - Auto-complete suggestions (optional)
  
  2. **Distance Selector**:
     - Dropdown with options:
       - 25 miles
       - 50 miles
       - 100 miles
       - 250 miles
       - 500 miles
       - 1000 miles
       - Anywhere (default)
     - Only active when zip code is entered

- **Behavior**:
  - Calculate distance using Haversine formula
  - Filter results within radius
  - Center map on entered zip code
  - Show radius circle on map (optional)

### 4.3 Interactive Map

#### 4.3.1 Map Configuration
- **Default View**: Continental United States (lower 48)
- **Default Center**: `{lat: 39.8283, lng: -98.5795}`
- **Default Zoom**: 4
- **Controls**:
  - Zoom in/out
  - Street/Satellite view toggle
  - Fullscreen option
  - Pan/drag enabled

#### 4.3.2 Map Pins
- **Data Source**: 
  - Ambassador Details: `ambassadors` table with `status = 'active'`
  - Camper Details: `ambassador_models` table with `status = 'active'`, joined with `ambassadors` on `ambassador_id`
- **Pin Colors**:
  - Red: Ambassadors (`ambassador_type = 'Ambassador'`)
  - Blue: Dealers (`ambassador_type = 'Dealer'`)
  - Green: Events (`ambassador_type = 'Event'`)
- **Position**: From `ambassadors.gps_location` JSON
- **Clustering**: Enable for better performance with many pins
- **Additional Logic**: If the Ambassador has more than one camper, evenly distribute the pins around the ambassador.gps_location at a .5 mile radius. 

#### 4.3.3 Pin Popup/InfoWindow
- **Trigger**: Click on pin
- **Content Layout**:
  ```
  [Hero Image from camper_models]
  [Manufacturer] [Model Name] - [Trim Name]
  [Public Name]
  Location: [City], [State] [Zip]
  [Schedule Viewing Button]
  ```
- **Image**: Thumbnail from `hero_image_url` (150x100px) joined from `ambassador_models` on `model_id`
- **Auto-close**: When clicking another pin

### 4.4 Results Table

#### 4.4.1 Table Structure
| Image | Details | Gallery | Action |
|-------|---------|---------|--------|
| Hero Image from camper_models | Manufacturer Model Name - Trim Name<br>Public Name<br>City, State ZIP | 3 Photo Thumbnails | Schedule Viewing |

#### 4.4.2 Table Features
- **Responsive Design**: Stack on mobile, horizontal on desktop
- **Pagination**: 20 items per page
- **Sorting**: By distance (if zip entered), name, or location
- **Loading State**: Skeleton loader while fetching

#### 4.4.3 Image Gallery
- **Thumbnails**: 3 images from `ambassador_models` table (photo1_id, photo2_id, photo3_id)
- **Size**: thumbnails should be 80% the height of the row
- **Click Action**: Open lightbox with full-size image
- **Navigation**: Previous/Next arrows in lightbox
- **Close**: ESC key or X button

### 4.5 Schedule Viewing Modal

#### 4.5.1 Modal Trigger
- "Schedule Viewing" button in:
  - Map pin popup
  - Table row action column
  
#### 4.5.2 Form Fields
1. **Name** (required)
   - Type: Text input
   - Validation: Min 2 characters, max 100
   - Placeholder: "Your Full Name"

2. **Email** (required)
   - Type: Email input
   - Validation: Valid email format
   - Placeholder: "your.email@example.com"

3. **Phone** (required)
   - Type: Tel input
   - Validation: 10-digit US phone
   - Format: (xxx) xxx-xxxx
   - Placeholder: "(555) 123-4567"

4. **Message** (required)
   - Type: Textarea
   - Label: "Tell us what you're looking for"
   - Validation: Min 10 characters, max 500
   - Rows: 4

#### 4.5.3 Security Features
- **CAPTCHA**: Google reCAPTCHA v3
- **Rate Limiting**: Max 5 submissions per IP per hour
- **Input Sanitization**: XSS prevention
- **CSRF Protection**: Token validation
- **Honeypot Field**: Hidden field to catch bots

#### 4.5.4 Form Submission
- **Success Message**: "Thank you! We'll contact you within 24 hours."
- **Case Creation**: Creates new record in `cases` table with `created_by = 'system'`, incrementing case_number by 1 greater than the current largest case_number in the format of `C-00002`
- **Error Handling**: User-friendly error messages
- **Data Storage**: Creates new record in `cases` table with `created_by = 'system'`, incrementing case_number by 1 greater than the current largest case_number in the format of `C-00002`
- **Email Notification**: Send to dealer/ambassador (future phase)

## 5. Design Specifications

### 5.1 XGrid Brand Alignment
Based on analysis of xgridcampers.com:

#### Color Palette
```css
:root {
  --primary-black: #000000;
  --primary-white: #FFFFFF;
  --gray-light: #F5F5F5;
  --gray-medium: #E0E0E0;
  --gray-dark: #666666;
  --accent-blue: #0066CC;
  --success-green: #28A745;
  --warning-red: #DC3545;
}
```

#### Typography
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-heading-weight: 600;
--font-body-weight: 400;
--font-size-base: 16px;
--font-size-small: 14px;
--font-size-large: 18px;
--font-size-h1: 32px;
--font-size-h2: 24px;
--font-size-h3: 20px;
```

#### Component Styles
- **Buttons**: Rounded corners (4px), subtle shadows, hover states
- **Cards**: White background, light border, 8px padding
- **Inputs**: 1px border, 8px padding, focus outline
- **Modal**: Dark overlay (rgba(0,0,0,0.5)), centered, max-width 500px

### 5.2 Responsive Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* Tablet */ }
@media (min-width: 768px) { /* Small Desktop */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

## 6. Performance Requirements

### 6.1 Loading Performance
- **Initial Load**: < 3 seconds on 3G
- **Time to Interactive**: < 5 seconds
- **Map Render**: < 2 seconds after data load
- **Image Optimization**: WebP with fallback, lazy loading

### 6.2 Runtime Performance
- **Filter Response**: < 500ms
- **Map Pan/Zoom**: 60fps
- **Table Pagination**: < 300ms
- **Modal Open/Close**: < 200ms

### 6.3 Scalability
- Support 1000+ ambassadors
- Handle 100+ concurrent users
- Cache static data for 5 minutes
- Implement database query optimization

## 7. Security Requirements

### 7.1 Input Validation
- Server-side validation for all form inputs
- SQL injection prevention via parameterized queries
- XSS protection through content sanitization
- File upload restrictions (if implemented)

### 7.2 Data Protection
- CORS Compliance
- HTTPS only communication
- Environment variables for sensitive data
- No PII exposed in client-side code
- Secure session management

### 7.3 Rate Limiting & Abuse Prevention
- API rate limiting (100 requests/minute)
- Form submission throttling
- IP-based blocking for abuse
- Monitoring and alerting system

### 7.4 Compliance
- GDPR compliance for EU visitors
- CCPA compliance for California residents
- ADA/WCAG 2.1 AA accessibility standards
- Cookie consent banner (if cookies used)

## 8. Browser & Device Support

### 8.1 Browsers (Last 2 Versions)
- Chrome (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Firefox (Desktop)
- Edge (Desktop)

### 8.2 Devices
- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: 320px - 767px

### 8.3 Accessibility
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Sufficient color contrast (WCAG AA)

## 9. Integration Requirements

### 9.1 Supabase Integration
- Real-time subscriptions for data updates
- Row-level security policies
- Connection pooling for performance
- Automatic reconnection handling

### 9.2 Google Maps API
- API key management
- Usage quota monitoring
- Geocoding service for zip codes
- Places API for location search

### 9.3 AWS Amplify
- CORS Compliant
- Environment variables configuration
- Build settings optimization
- Custom domain setup
- SSL certificate management

## 10. Testing Requirements

### 10.1 Unit Tests
- Component rendering tests
- Filter logic validation
- Distance calculation accuracy
- Form validation rules

### 10.2 Integration Tests
- Database query performance
- API endpoint responses
- Map interaction flows
- Form submission process

### 10.3 E2E Tests
- Complete user journey
- Cross-browser compatibility
- Mobile responsiveness
- Error handling scenarios

### 10.4 Performance Tests
- Load testing (100+ concurrent users)
- Stress testing (1000+ pins)
- Memory leak detection
- Bundle size optimization

## 11. Monitoring & Analytics

### 11.1 Application Monitoring
- Error tracking (Sentry or similar)
- Performance monitoring
- Uptime monitoring
- API response times

### 11.2 User Analytics
- Page views and unique visitors
- Filter usage patterns
- Viewing request conversion rate
- Geographic distribution

### 11.3 Business Metrics
- Number of viewing requests
- Most viewed ambassadors
- Popular search filters
- User engagement time

## 12. Deployment & Maintenance

### 12.1 Deployment Process
1. Development environment (localhost)
3. Production deployment (main branch) to AWS Amplify through Github push
4. Rollback procedures


## 16. Documentation Requirements

### 16.1 Technical Documentation
- API documentation
- Database schema documentation
- Deployment guide
- Troubleshooting guide

### 16.2 User Documentation
- Embedding instructions for dealers
- Admin panel user guide
- FAQ section
- Video tutorials

### 16.3 Developer Documentation
- Code style guide
- Component library documentation
- Testing guidelines
- Contribution guidelines

## Appendix A: Sample Embed Code

### Direct DOM Injection (No iFrame) - Recommended for Responsive Design

```html
<!-- Basic Implementation -->
<script src="https://map.galvanic.ai/embed.js" 
        data-container-id="ambassador-map"
        data-base-url="https://map.galvanic.ai">
</script>

<!-- With Specific Container -->
<div id="xgrid-ambassador-map"></div>
<script src="https://map.galvanic.ai/embed.js" 
        data-container-id="xgrid-ambassador-map"
        data-base-url="https://map.galvanic.ai">
</script>
```

### How It Works
1. The script creates a container div if not specified
2. Loads required CSS styles directly into the page
3. Injects the widget HTML into the container
4. Initializes Google Maps and event handlers
5. Loads ambassador data from the API
6. All content is responsive and flows with the host page layout

### Benefits of Direct DOM Injection
- **Fully Responsive**: Widget adapts to container width and reflows with page
- **Native Performance**: No iframe overhead or communication delays
- **SEO Friendly**: Content is directly in the page DOM
- **Better Mobile Experience**: Touch events and scrolling work naturally
- **Easier Styling**: Host page can override styles if needed

## Appendix B: Database Query Examples

```sql
-- Get all active ambassadors with their models
SELECT 
  a.*,
  cm.manufacturer,
  cm.model_name,
  cm.trim_name,
  cm.hero_image_url,
  am.photo1_id,
  am.photo2_id,
  am.photo3_id,
  am.camper_description
FROM ambassadors a
JOIN ambassador_models am ON a.id = am.ambassador_id
JOIN camper_models cm ON am.model_id = cm.id
WHERE a.status = 'active'
  AND am.status = 'active';

-- Get ambassadors within radius of zip code
SELECT *,
  (3959 * acos(
    cos(radians(?)) * cos(radians(gps_location->>'lat')) * 
    cos(radians(gps_location->>'lng') - radians(?)) + 
    sin(radians(?)) * sin(radians(gps_location->>'lat'))
  )) AS distance
FROM ambassadors
WHERE status = 'active'
HAVING distance < ?
ORDER BY distance;
```

## Appendix C: API Endpoints

```javascript
// API Structure (Next.js App Router)
/api/ambassadors
  GET - List all ambassadors with filters
  
/api/ambassadors/[id]
  GET - Get single ambassador details
  
/api/cases
  POST - Submit viewing request (creates case)
  
/api/settings
  GET - Get system settings
  
/api/camper-models
  GET - List all camper models
```

---

*Document Version: 1.0*  
*Last Updated: November 2024*  
*Status: Draft - Pending Review*