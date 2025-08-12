# AWS Deployment Checklist for Google Maps (Global Access)

## Environment Variables
Make sure these environment variables are set in your AWS deployment:

1. **NEXT_PUBLIC_GOOGLE_MAP_API_KEY** - Your Google Maps API key
2. **NEXT_PUBLIC_BASE_URL** - Your production API URL
3. **NEXT_PUBLIC_SOCKET_URL** - Your production socket URL

## Google Maps API Key Configuration (Global Access)

### 1. Enable Required APIs in Google Cloud Console
- Maps JavaScript API
- Places API (New)
- Geocoding API
- Geolocation API

### 2. Configure API Key Restrictions
- **Application restrictions**: HTTP referrers (web sites)
- **Website restrictions**: Add your domains:
  ```
  https://yourdomain.com/*
  https://*.yourdomain.com/*
  https://your-aws-cloudfront-domain.cloudfront.net/*
  http://localhost:3000/* (for development)
  ```

### 3. API Restrictions
Enable these APIs for your key:
- Maps JavaScript API
- Places API (New)
- Geocoding API
- Geolocation API

### 4. Global Access Configuration
- **No region restrictions**: API key works globally
- **Language**: Default English but maps adapt to user's location
- **Localization**: Maps automatically show local languages and regions
- **Worldwide access**: People from any country can access your website and see maps

## AWS Configuration

### Environment Variables in AWS
Set these in your AWS deployment platform:

**For AWS Amplify:**
```bash
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_BASE_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

**For AWS Lambda/Vercel:**
Add in environment variables section of your deployment platform.

### Build Command
Make sure your build command includes:
```bash
npm run build
```

### Headers and CSP
The Next.js config has been updated to include proper CSP headers for:
- Google Maps resources
- Global font loading
- Swiper component fonts
- Local API connections

## Testing
After deployment, check:
1. Browser console for any Google Maps errors
2. Network tab to ensure Maps API calls are successful
3. Check if markers and custom icons load properly
4. Test from different countries/regions
5. Verify maps show local language and region data

## Common Issues & Solutions

### Issue: "Google Maps JavaScript API error: RefererNotAllowedMapError"
**Solution:** Add your deployed domain to API key restrictions in Google Cloud Console

### Issue: "Loading of this resource was blocked by CSP"
**Solution:** Already fixed in next.config.ts with proper CSP headers

### Issue: Custom markers not showing
**Solution:** Already fixed by adding `optimized: false` to marker icons

### Issue: Maps not loading at all
**Solution:** Check environment variables are properly set in AWS

### Issue: React Hook conditional call error
**Solution:** Already fixed - hooks are now called in consistent order

### Issue: Font loading errors in Swiper
**Solution:** Already fixed with `preventGoogleFontsLoading: true` and proper CSP

## Global Features Enabled
✅ Maps work from any country/region
✅ No region restrictions
✅ Automatic language localization
✅ Local place names and roads
✅ Currency and measurement units based on user location
✅ Right-to-left language support
✅ Local time zones and date formats