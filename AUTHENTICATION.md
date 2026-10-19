# Django authentication integration

Set `DJANGO_API_URL` in the frontend environment to the Django origin (for example,
`http://127.0.0.1:8000` for local development). Next.js server routes proxy
registration, login, organization onboarding, and authenticated API requests to
Django; browser JavaScript never receives the JWTs. The access and refresh tokens
and active organization ID are stored in `HttpOnly`, `SameSite=Lax` cookies, with
the `Secure` flag enabled in production.

The flow is:

1. `/register` creates a Django user and issues the JWT cookies.
2. `/onboarding/organization` creates the organization and owner membership.
3. `/app` validates the JWT against Django and redirects users without an
   organization back to onboarding.

In production, serve the frontend and backend over HTTPS and set
`SECURE_SSL_REDIRECT=true` for Django. Configure `SECRET_KEY` with a unique,
random value of at least 32 bytes; SimpleJWT uses Django's signing key unless a
separate JWT signing key is configured. Authentication endpoints are rate-limited
by DRF. Protected Django API calls can be made through `/api/backend/<path>`,
which adds the bearer token and active organization on the server.
