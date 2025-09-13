# Implementation Plan - XGrid Campers Ambassador Map

## Overview
This document outlines a phased implementation approach for deploying the XGrid Campers Ambassador Map application. Each phase builds upon the previous one, with comprehensive testing requirements before proceeding to the next phase.

## Architecture Considerations

### Supabase RLS (Row Level Security)
Since Supabase tables have RLS enabled, we need to implement one of these strategies:
1. **Service Role Key (Server-side only)** - Use for read-only operations in API routes
2. **Public Anon Key + RLS Policies** - Configure RLS policies for public read access
3. **JWT Authentication** - Implement if user-specific data access is needed

For this application, we'll use:
- **Service Role Key** in Next.js API routes for write operations (cases table)
- **Anon Key with RLS policies** for public read operations (ambassadors, camper_models)

### AWS Amplify Deployment
- Environment variables will be configured in AWS Amplify Console
- Build settings will be defined in `amplify.yml`
- Custom domain will be configured post-deployment

---

## Phase 1: Hello World Deployment
**Goal**: Establish CI/CD pipeline with GitHub → AWS Amplify

### 1.1 Implementation Tasks
- [x] Create basic Next.js application with "Hello World" page
- [ ] Initialize Git repository
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Connect GitHub repository to AWS Amplify
- [ ] Configure build settings in AWS Amplify
- [ ] Deploy and verify deployment

### 1.2 Required Files
```
amplify.yml
.env.local (for local development)
```

### 1.3 Testing Checklist
- [ ] Local development server runs without errors
- [ ] Build completes successfully (`npm run build`)
- [ ] GitHub repository is accessible
- [ ] AWS Amplify successfully pulls from GitHub
- [ ] Deployment URL shows "Hello World" page
- [ ] HTTPS certificate is active
- [ ] Page loads on mobile and desktop browsers

### 1.4 Success Criteria
- Live URL displays "Hello World" message
- Automatic deployments trigger on git push to main branch
- No console errors in browser

---

## Phase 2: Supabase Integration & Basic Data Display
**Goal**: Connect to Supabase and display ambassador data in a table

### 2.1 Implementation Tasks
- [ ] Configure Supabase environment variables in AWS Amplify
- [ ] Create Supabase client configuration
- [ ] Set up RLS policies for public read access:
  ```sql
  -- For ambassadors table
  CREATE POLICY "Public read access" ON ambassadors
    FOR SELECT USING (is_active = true);
  
  -- For camper_models table
  CREATE POLICY "Public read access" ON camper_models
    FOR SELECT USING (true);
  
  -- For ambassador_models table
  CREATE POLICY "Public read access" ON ambassador_models
    FOR SELECT USING (true);
  ```
- [ ] Create API route `/api/ambassadors` for fetching data
- [ ] Create ResultsTable component
- [ ] Display ambassador data in table format

### 2.2 Testing Checklist
- [ ] Supabase connection successful in local environment
- [ ] API endpoint returns ambassador data
- [ ] Table displays all active ambassadors
- [ ] Pagination works (if > 20 items)
- [ ] Data loads within 3 seconds
- [ ] No CORS errors in console
- [ ] Mobile responsive layout works

### 2.3 Success Criteria
- Live site displays ambassador data from Supabase
- Data refreshes on page reload
- No authentication errors

---

## Phase 3: Google Maps Integration
**Goal**: Display ambassadors on an interactive map

### 3.1 Implementation Tasks
- [ ] Configure Google Maps API key in AWS Amplify
- [ ] Create MapContainer component
- [ ] Implement map initialization with default US view
- [ ] Add map pins for each ambassador location
- [ ] Implement different pin colors by type (Ambassador/Dealer/Event)
- [ ] Add pin clustering for performance
- [ ] Create InfoWindow popup on pin click

### 3.2 Testing Checklist
- [ ] Map loads successfully
- [ ] All ambassadors appear as pins
- [ ] Pin colors match ambassador types
- [ ] Click on pin shows popup with details
- [ ] Map controls (zoom, pan) work
- [ ] Clustering activates with many pins
- [ ] Map is responsive on mobile
- [ ] No API quota errors

### 3.3 Success Criteria
- Map displays all active ambassadors
- Pin interactions work smoothly
- Map performance is acceptable (60fps pan/zoom)

---

## Phase 4: Filter System Implementation
**Goal**: Add filtering capabilities for ambassadors

### 4.1 Implementation Tasks
- [ ] Create FilterPanel component
- [ ] Implement Manufacturer/Model dropdown
- [ ] Add Type filter (All/Ambassador/Dealer/Event)
- [ ] Create Location-based filter with zip code input
- [ ] Implement distance radius selector
- [ ] Add Haversine formula for distance calculations
- [ ] Connect filters to map and table updates

### 4.2 Testing Checklist
- [ ] All filter options populate correctly
- [ ] Manufacturer/Model filter updates results
- [ ] Type filter shows/hides appropriate pins
- [ ] Zip code validation works (5 digits)
- [ ] Distance calculation is accurate
- [ ] Combined filters work together
- [ ] Filter state persists during session
- [ ] Clear filters option works

### 4.3 Success Criteria
- All filters update map and table in real-time
- Filter response time < 500ms
- No data inconsistencies between map and table

---

## Phase 5: Schedule Viewing Modal & Form Submission
**Goal**: Allow users to submit viewing requests

### 5.1 Implementation Tasks
- [ ] Create ScheduleModal component
- [ ] Implement form with validation
- [ ] Add reCAPTCHA v3 integration
- [ ] Create API route `/api/cases` for form submission
- [ ] Implement rate limiting (5 submissions per IP/hour)
- [ ] Add case number generation (C-00001 format)
- [ ] Configure email notifications (future phase)
- [ ] Add success/error messaging

### 5.2 Security Implementation
- [ ] Input sanitization
- [ ] CSRF protection
- [ ] Honeypot field for bot detection
- [ ] Server-side validation
- [ ] IP logging for security

### 5.3 Testing Checklist
- [ ] Form opens from map pin and table
- [ ] All fields validate correctly
- [ ] Phone number formats properly
- [ ] reCAPTCHA loads and validates
- [ ] Form submission creates case in database
- [ ] Case number increments correctly
- [ ] Rate limiting blocks excessive submissions
- [ ] Success message displays
- [ ] Error handling works for failures
- [ ] Modal closes properly

### 5.4 Success Criteria
- Form submissions successfully create cases
- No spam submissions get through
- User receives clear feedback

---

## Phase 6: Embeddable Widget Implementation
**Goal**: Make the application embeddable on dealer websites

### 6.1 Implementation Tasks
- [ ] Create `/public/embed.js` script
- [ ] Implement script loading mechanism
- [ ] Add container injection logic
- [ ] Ensure CORS headers are properly configured
- [ ] Create embed documentation page
- [ ] Test on external domain

### 6.2 Testing Checklist
- [ ] Embed script loads on external site
- [ ] No CORS errors
- [ ] Widget renders correctly
- [ ] All features work in embedded mode
- [ ] Multiple instances can coexist
- [ ] No style conflicts with host page
- [ ] Responsive behavior maintained

### 6.3 Success Criteria
- Widget can be embedded with single script tag
- All functionality works when embedded
- No security warnings in console

---

## Phase 7: Performance Optimization
**Goal**: Meet performance requirements from PRD

### 7.1 Implementation Tasks
- [ ] Implement image optimization (WebP with fallback)
- [ ] Add lazy loading for images
- [ ] Set up data caching (5-minute cache)
- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Add loading skeletons
- [ ] Optimize database queries

### 7.2 Testing Checklist
- [ ] Initial load < 3 seconds on 3G
- [ ] Time to Interactive < 5 seconds
- [ ] Map renders < 2 seconds after data
- [ ] Filter response < 500ms
- [ ] Table pagination < 300ms
- [ ] Modal open/close < 200ms
- [ ] Support 1000+ ambassadors
- [ ] Handle 100+ concurrent users

### 7.3 Success Criteria
- All performance metrics met
- Lighthouse score > 90
- No memory leaks detected

---

## Phase 8: Final Polish & Documentation
**Goal**: Complete remaining features and documentation

### 8.1 Implementation Tasks
- [ ] Add header section with dynamic content
- [ ] Implement image gallery with lightbox
- [ ] Add system settings management
- [ ] Create admin documentation
- [ ] Implement monitoring (Sentry)
- [ ] Add analytics tracking
- [ ] Complete accessibility features (ARIA, keyboard nav)

### 8.2 Testing Checklist
- [ ] Header content loads from system_settings
- [ ] Image gallery navigation works
- [ ] Lightbox opens/closes properly
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] WCAG AA compliance met
- [ ] Analytics tracking working
- [ ] Error monitoring active

### 8.3 Success Criteria
- All PRD requirements implemented
- Documentation complete
- Accessibility standards met

---

## Deployment Commands & Procedures

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run linting
npm run lint
```

### GitHub Setup
```bash
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Phase 1 - Hello World"

# Add remote origin
git remote add origin https://github.com/[username]/ambassador-map.git

# Push to main branch
git push -u origin main
```

### AWS Amplify Build Settings (amplify.yml)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Environment Variables (AWS Amplify Console)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

---

## Testing Protocols

### Browser Testing Matrix
- Chrome (Desktop & Mobile) - Latest 2 versions
- Safari (Desktop & Mobile) - Latest 2 versions  
- Firefox (Desktop) - Latest 2 versions
- Edge (Desktop) - Latest 2 versions

### Device Testing
- Desktop: 1920x1080, 1366x768
- Tablet: iPad (768x1024)
- Mobile: iPhone (375x667), Android (360x640)

### Load Testing Tools
- Lighthouse (Performance metrics)
- WebPageTest (Real-world performance)
- GTmetrix (Page speed analysis)

### Security Testing
- OWASP ZAP (Security scanning)
- SSL Labs (SSL certificate validation)
- Observatory (Security headers check)

---

## Rollback Procedures

### Quick Rollback via AWS Amplify
1. Navigate to AWS Amplify Console
2. Select the app
3. Go to "Deploy" section
4. Click on previous successful deployment
5. Click "Redeploy this version"

### Git-based Rollback
```bash
# View commit history
git log --oneline

# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard [commit-hash]

# Force push to trigger deployment
git push --force origin main
```

---

## Monitoring Checklist

### Daily Monitoring
- [ ] Check AWS Amplify deployment status
- [ ] Monitor Supabase usage/quotas
- [ ] Review Google Maps API usage
- [ ] Check error logs in browser console
- [ ] Verify form submissions are working

### Weekly Monitoring
- [ ] Review performance metrics
- [ ] Check security logs
- [ ] Analyze user analytics
- [ ] Review and address any reported issues
- [ ] Update documentation as needed

---

## Sign-off Requirements

Each phase requires sign-off before proceeding:

### Phase 1 Sign-off
- [ ] Developer testing complete
- [ ] Deployment successful
- [ ] Stakeholder review
- [ ] Approval to proceed

### Phase 2-8 Sign-off
- [ ] All testing checklist items passed
- [ ] Success criteria met
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Stakeholder approval

---

## Risk Mitigation

### Identified Risks
1. **Supabase RLS Configuration**
   - Mitigation: Test RLS policies thoroughly in Supabase dashboard before deployment
   
2. **Google Maps API Quotas**
   - Mitigation: Monitor usage, implement caching, consider backup map provider

3. **CORS Issues with Embedding**
   - Mitigation: Test embedding early, have fallback iframe option

4. **Performance with Large Datasets**
   - Mitigation: Implement pagination, clustering, and caching from the start

5. **Security Vulnerabilities**
   - Mitigation: Regular security audits, implement all security features in Phase 5

---

## Contact & Support

### Development Team
- Lead Developer: [Name]
- DevOps: [Name]
- QA: [Name]

### External Services
- Supabase Support: support@supabase.io
- Google Maps: Google Cloud Console
- AWS Amplify: AWS Support Center

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Next Review: After Phase 1 Completion*