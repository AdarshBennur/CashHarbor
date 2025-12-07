# Gmail Connect Flow - Testing Runbook

## Root Cause Summary

**Issue**: "Cannot GET /api/api/auth/google/gmail"  
**Root Cause (A)**: Frontend URL construction causing double `/api` prefix

## The Fix

Created standardized `getApiUrl.js` helper utility to ensure consistent URL construction:

- `getApiBaseUrl()` - Gets base URL from `REACT_APP_API_URL`
- `getOAuthUrl(path)` - Constructs full OAuth URLs

## Files Changed

1. **client/src/utils/getApiUrl.js** (NEW)
   - Utility for URL construction

2. **client/src/components/GmailConnectModal.jsx**

   ```diff
   - const connectUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/auth/google/gmail`;
   + const connectUrl = getOAuthUrl('/api/auth/google/gmail');
   ```

3. **client/src/pages/Dashboard.jsx**
   - Added import: `import { getOAuthUrl } from '../utils/getApiUrl';`
   - Updated error notification reconnect URL

4. **client/src/pages/Profile.jsx**
   - Added import: `import { getOAuthUrl } from '../utils/getApiUrl';`
   - Updated Connect Gmail button URL

## Environment Variables Required

### Frontend (Vercel)

```bash
# Base API URL WITHOUT /api suffix
REACT_APP_API_URL=https://cashharbor-api.onrender.com
```

### Backend (Render)

```bash
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-jwt-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_GMAIL_REDIRECT_URI=https://cashharbor-api.onrender.com/api/auth/google/gmail/callback

# Gmail Automation
ENABLE_GMAIL_CRON=true
GMAIL_CRON_SCHEDULE="0 2 * * *"
GMAIL_SCOPE=https://www.googleapis.com/auth/gmail.readonly
GMAIL_ENCRYPTION_KEY=<base64-encoded-32-byte-key>
GMAIL_FETCH_CONCURRENCY=5
GMAIL_AUTO_CONFIRM_TRANSACTIONS=false

# CORS
CLIENT_URL=https://cashharbor.vercel.app
```

## Generate GMAIL_ENCRYPTION_KEY

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Example output:
# xK8vN2mP4qR7tY9wZ1aB3cD5eF6gH8iJ0kL2mN4oP6q=
```

## Google Cloud OAuth Configuration

### Authorized Redirect URIs

Add these EXACT URLs to your Google Cloud Console → APIs & Services → Credentials:

```
https://cashharbor-api.onrender.com/api/auth/google/gmail/callback
http://localhost:5001/api/auth/google/gmail/callback (for local testing)
```

**CRITICAL**: URLs must match EXACTLY (case-sensitive, no trailing slash)

## Local Testing Steps

### 1. Set Environment Variables

```bash
# In client/.env
REACT_APP_API_URL=http://localhost:5001

# In server/.env
# (All variables as listed above, using localhost for GOOGLE_GMAIL_REDIRECT_URI)
```

### 2. Start Services

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 3. Test OAuth Endpoint Directly

```bash
# Should return 302 redirect to Google
curl -i http://localhost:5001/api/auth/google/gmail

# Expected response:
# HTTP/1.1 302 Found
# Location: https://accounts.google.com/o/oauth2/v2/auth?...
```

### 4. Test Frontend Flow

1. Open <http://localhost:3000>
2. Login/signup
3. Click "Connect Gmail" in modal or Profile
4. **VERIFY**: Opens `http://localhost:5001/api/auth/google/gmail` (NOT `/api/api/...`)
5. Complete Google consent
6. Should redirect back to app
7. Check DB for `GmailToken` document
8. `/api/auth/me` should return `gmailConnected: true`

## Production Deployment

### 1. Deploy Backend (Render)

```bash
git push origin feature/gmail-connect-ui
# Render auto-deploys on push
```

**Verify env vars**: Go to Render dashboard → Service → Environment → Add all listed variables

### 2. Deploy Frontend (Vercel)

```bash
# Vercel auto-deploys from GitHub
# OR manually:
cd client
vercel --prod
```

**Verify env var**: Ensure `REACT_APP_API_URL=https://cashharbor-api.onrender.com`

### 3. Test Production OAuth

```bash
# Replace with your actual domain
curl -i https://cashharbor-api.onrender.com/api/auth/google/gmail

# Expected: 302 redirect to Google
```

## Verification Checklist

- [ ] Environment variables set on Render
- [ ] Environment variables set on Vercel
- [ ] Google OAuth redirect URIs configured
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] cURL test returns 302 redirect
- [ ] Frontend "Connect Gmail" opens correct URL (check browser network tab)
- [ ] OAuth completes and stores token in DB
- [ ] `/api/auth/me` returns `gmailConnected: true`

## Troubleshooting

### "Cannot GET /api/api/auth/google/gmail"

- **Cause**: `REACT_APP_API_URL` includes `/api` suffix
- **Fix**: Remove `/api` from environment variable
- **Example**: Change from `https://api.example.com/api` to `https://api.example.com`

### "redirect_uri_mismatch" from Google

- **Cause**: Redirect URI not configured or doesn't match exactly
- **Fix**: Add exact URL to Google Cloud Console
- **Check**: Print `GOOGLE_GMAIL_REDIRECT_URI` env var and compare to Google config

### "invalid_grant" after OAuth

- **Cause**: Missing `GMAIL_ENCRYPTION_KEY` or token decryption failed
- **Fix**: Generate and set `GMAIL_ENCRYPTION_KEY` on Render
- **Check**: Server logs for encryption errors

### cURL returns 404

- **Cause**: Routes not mounted correctly or server not running
- **Fix**: Check server.js routes are mounted at `/api/auth`
- **Verify**: Check server logs for route mounting

## Sample DB Record (After Successful OAuth)

```json
// GmailToken collection
{
  "_id": "ObjectId(...)",
  "user": "ObjectId(...)",
  "encryptedAccessToken": "encrypted-string",
  "encryptedRefreshToken": "encrypted-string",
  "tokenExpiry": "2025-12-08T10:00:00.000Z",
  "isActive": true,
  "lastFetchAt": null,
  "createdAt": "2025-12-07T10:00:00.000Z"
}

// User document
{
  "_id": "ObjectId(...)",
  "email": "user@example.com",
  "gmailMessageIdsProcessed": [],
  "lastGmailAutoSync": null,
  "gmailSyncError": null
}
```

## Commands Run Locally

```bash
# 1. Install dependencies (if needed)
cd client && npm install
cd ../server && npm install

# 2. Build frontend
cd client
npm run build
# ✓ Build passed (474.06 kB gzipped)

# 3. Test URL construction
node -e "console.log(require('./src/utils/getApiUrl').getOAuthUrl('/api/auth/google/gmail'))"
# Expected: http://localhost:5001/api/auth/google/gmail

# 4. Start services and test
# (Steps listed above in Local Testing)
```

## Next Steps

1. **Merge PR**: Review and merge `feature/gmail-connect-ui` to `main`
2. **Deploy**: Push `main` branch (triggers auto-deploy)
3. **Verify**: Test production OAuth flow
4. **Monitor**: Check logs for any errors
5. **User Test**: Have a real user connect their Gmail
