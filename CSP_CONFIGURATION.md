# Content Security Policy (CSP) Configuration

## Overview
This document explains the Content Security Policy configuration in the AMHSJ application and how to troubleshoot CSP-related issues.

## What is CSP?
Content Security Policy (CSP) is a security standard that helps prevent cross-site scripting (XSS), clickjacking, and other code injection attacks by controlling which resources can be loaded on your website.

## Current Configuration

### Location
The CSP configuration is defined in `next.config.mjs` under the `headers()` function.

### CSP Directives

#### `default-src 'self'`
- **Purpose**: Default policy for fetching resources
- **Value**: Only allow resources from the same origin

#### `script-src 'self' 'unsafe-eval' 'unsafe-inline'`
- **Purpose**: Control where scripts can be loaded from
- **Value**: 
  - `'self'`: Scripts from same origin
  - `'unsafe-eval'`: Allows `eval()` and similar methods (needed for React/Next.js)
  - `'unsafe-inline'`: Allows inline scripts (needed for React/Next.js)

#### `style-src 'self' 'unsafe-inline'`
- **Purpose**: Control where stylesheets can be loaded from
- **Value**: 
  - `'self'`: Styles from same origin
  - `'unsafe-inline'`: Allows inline styles (needed for styled-components/CSS-in-JS)

#### `img-src 'self' data: https: blob:`
- **Purpose**: Control where images can be loaded from
- **Value**: 
  - `'self'`: Images from same origin
  - `data:`: Data URIs (base64 images)
  - `https:`: Any HTTPS source
  - `blob:`: Blob URLs (for generated images)

#### `font-src 'self' data:`
- **Purpose**: Control where fonts can be loaded from
- **Value**: 
  - `'self'`: Fonts from same origin
  - `data:`: Data URIs (base64 fonts)

#### `connect-src 'self' [API_URLS]`
- **Purpose**: Control where XMLHttpRequest, fetch, and WebSocket connections can be made
- **Value**: 
  - `'self'`: Same origin
  - API URLs (DigitalOcean App and localhost)

#### `frame-src 'self' https://github.com https://raw.githubusercontent.com https://*.github.io https://octopus-app-3jhrw.ondigitalocean.app blob: data:`
- **Purpose**: Control where iframes can be embedded from
- **Value**: 
  - `'self'`: Same origin iframes
  - `https://github.com`: GitHub embeds
  - `https://raw.githubusercontent.com`: Raw GitHub content
  - `https://*.github.io`: GitHub Pages
  - Backend API domain
  - `blob:`: Blob URLs (for PDF preview)
  - `data:`: Data URIs

#### `object-src 'none'`
- **Purpose**: Disallow plugins like Flash
- **Value**: No plugins allowed

#### `base-uri 'self'`
- **Purpose**: Restrict the URLs that can be used in a document's `<base>` element
- **Value**: Only same origin

## Common CSP Errors and Solutions

### Error: "Refused to frame 'https://...' because it violates CSP directive"

**Problem**: The URL you're trying to embed in an iframe is not allowed by CSP.

**Solution**: Add the domain to the `frame-src` directive in `next.config.mjs`:

```javascript
"frame-src 'self' https://allowed-domain.com",
```

### Error: "Refused to load the script because it violates CSP directive"

**Problem**: Script source is not allowed.

**Solution**: Add the domain to the `script-src` directive or use a nonce/hash for inline scripts.

### Error: "Refused to connect to ... because it violates CSP directive"

**Problem**: API endpoint is not allowed for fetch/XHR requests.

**Solution**: Add the API domain to `connect-src`:

```javascript
"connect-src 'self' https://your-api.com",
```

## Development vs Production

### Development Mode
- CSP is applied but less strict
- Allows localhost connections
- Easier debugging

### Production Mode
- Full CSP enforcement
- Additional security headers (X-Frame-Options, HSTS, etc.)
- Stricter policies

## Adding New Domains

When you need to embed content from a new domain:

1. **Open** `frontend/next.config.mjs`
2. **Find** the appropriate CSP directive
3. **Add** the new domain to the directive
4. **Restart** the development server

Example:
```javascript
"frame-src 'self' https://github.com https://new-domain.com",
```

## Allowed Domains by Use Case

### For PDF/Document Embedding
```javascript
"frame-src 'self' blob: data:",
```

### For External Content
```javascript
"frame-src 'self' https://trusted-domain.com",
```

### For API Calls
```javascript
"connect-src 'self' https://api.trusted-domain.com",
```

### For Images
```javascript
"img-src 'self' data: https: blob:",
```

## Testing CSP Configuration

### Browser Console
1. Open Developer Tools (F12)
2. Check the Console tab for CSP violations
3. Errors will show which directive is blocking the resource

### CSP Violation Reports
CSP violations are logged to the browser console with details about:
- Which directive was violated
- What resource was blocked
- Where the violation occurred

## Best Practices

1. **Be Specific**: Only allow domains you trust
2. **Avoid 'unsafe-inline'**: When possible, use nonces or hashes instead
3. **Test Thoroughly**: Test all features after changing CSP
4. **Monitor Violations**: Check browser console regularly
5. **Use HTTPS**: Always use HTTPS for external resources

## Debugging Tips

### Check Current CSP
1. Open Network tab in DevTools
2. Inspect the HTML document response headers
3. Look for `Content-Security-Policy` header

### Temporarily Disable CSP (Development Only)
In `next.config.mjs`, comment out the CSP header:
```javascript
// {
//   key: 'Content-Security-Policy',
//   value: ...
// },
```

**⚠️ Never disable CSP in production!**

## Resources

- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Content Security Policy Reference](https://content-security-policy.com/)

## Troubleshooting Checklist

- [ ] Is the domain using HTTPS?
- [ ] Is the domain listed in the correct CSP directive?
- [ ] Have you restarted the dev server after changes?
- [ ] Are there any typos in the domain name?
- [ ] Is the resource actually available at that URL?
- [ ] Check browser console for specific CSP violation details
