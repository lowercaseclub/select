# Security Measures for Select 2025 Application API

This document outlines the security measures implemented to protect the application form API endpoints from unauthorized access and abuse.

## Security Layers Implemented

### 1. Rate Limiting

- **Location**: `src/middleware.ts`
- **Configuration**: 5 requests per minute per IP address
- **Scope**: Applied to all API routes except Bizzabo endpoints
- **Storage**: In-memory (consider Redis for production scaling)

### 2. CSRF Protection

- **Location**: `src/lib/csrf.ts` and `src/app/api/csrf/route.ts`
- **Implementation**:
  - Server generates signed CSRF tokens with expiration (1 hour)
  - Frontend fetches token when form dialog opens
  - Token included in `X-CSRF-Token` header for form submission
  - Server validates token signature and expiration
- **Protection**: Prevents cross-site request forgery attacks

### 3. Origin Validation

- **Location**: `src/middleware.ts`
- **Validation**: Checks `Origin` and `Referer` headers
- **Allowed Origins**: Configured via environment variables:
  - `NEXT_PUBLIC_SITE_URL`
  - `VERCEL_URL` (fallback)
  - `localhost:3000` (development)
- **Protection**: Blocks requests from unauthorized domains

### 4. Request Header Validation

- **Location**: `src/lib/security.ts`
- **Checks**:
  - Valid `User-Agent` header (minimum length)
  - `Accept` header includes `application/json`
  - `Accept-Language` header presence
- **Protection**: Blocks automated requests and bots

### 5. Bot Detection

- **Location**: `src/lib/security.ts`
- **Patterns Blocked**:
  - Common bot user agents (bot, crawler, spider, etc.)
  - Development tools (Postman, Insomnia, etc.)
  - Command-line tools (curl, wget, etc.)
- **Protection**: Prevents automated form submissions

### 6. Input Sanitization

- **Location**: `src/lib/security.ts`
- **Measures**:
  - Trims whitespace
  - Removes potential HTML tags (`<`, `>`)
  - Limits input length to 1000 characters
  - Enhanced email validation
  - URL protocol validation (http/https only)
- **Protection**: Prevents XSS and injection attacks

### 7. Security Headers

- **Location**: `src/middleware.ts`
- **Headers Added**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Protection**: Browser-level security enhancements

## Environment Variables Required

```bash
# CSRF Protection
CSRF_SECRET=your-secure-random-secret-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
VERCEL_URL=your-vercel-url (auto-set by Vercel)
```

## API Endpoints Protected

### `/api/apply` (POST)

- **Rate Limiting**: ✅ Yes
- **CSRF Protection**: ✅ Yes
- **Origin Validation**: ✅ Yes
- **Bot Detection**: ✅ Yes
- **Input Sanitization**: ✅ Yes

### `/api/csrf` (GET)

- **Rate Limiting**: ✅ Yes
- **Origin Validation**: ✅ Yes
- **Bot Detection**: ✅ Yes

### `/api/bizzabo/*` (All methods)

- **Rate Limiting**: ❌ No (excluded for integration purposes)
- **Security Headers**: ✅ Yes

## Frontend Integration

The application form automatically:

1. Fetches CSRF token when dialog opens
2. Includes token in form submission headers
3. Handles security-related errors gracefully

## Monitoring and Logging

All security violations are logged to the console. Consider implementing:

- Structured logging (e.g., with Winston or Pino)
- Security event monitoring
- Alert system for repeated violations

## Production Considerations

1. **Rate Limiting**: Replace in-memory storage with Redis
2. **CSRF Secret**: Use a strong, randomly generated secret
3. **Monitoring**: Implement proper logging and alerting
4. **HTTPS**: Ensure all traffic uses HTTPS
5. **CORS**: Configure CORS policies appropriately
6. **Environment Variables**: Use secure environment variable management

## Testing Security

To test the security measures:

```bash
# Test rate limiting
curl -X POST http://localhost:3000/api/apply -H "Content-Type: application/json" -d '{}'

# Test CSRF protection (should fail)
curl -X POST http://localhost:3000/api/apply -H "Content-Type: application/json" -d '{}'

# Test origin validation (should fail from external domain)
curl -X POST http://localhost:3000/api/apply -H "Origin: https://malicious.com" -H "Content-Type: application/json" -d '{}'
```

## Security Headers Verification

You can verify security headers are working by checking the response headers:

```bash
curl -I http://localhost:3000/api/apply
```

This should return security headers like `X-Content-Type-Options`, `X-Frame-Options`, etc.
