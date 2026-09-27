# Day 8 Laravel API integration

The Angular `FacilityApiService` consumes the existing Day 8 API. This folder documents the integration and supplies the Angular development-server proxy; it does not duplicate the Laravel backend.

## Local development

The Angular development server proxies `/api/**` and `/up` to `http://127.0.0.1:8000` using [`proxy.conf.json`](./proxy.conf.json). Start Laravel from `day-08/laravel-api` with `php artisan serve`, then start Angular from `day-09/angular-app` with `npm start`. The browser calls the same-origin Angular URL and does not need cross-origin headers during local development.

The backend must have its Day 8 database configured and migrated/seeded before resource pages can show records. The proxy does not create or substitute facility data.

## Endpoints consumed

The base URL comes from `src/environments/environment.ts` and is `/api` by default. The production build replaces it with `src/environments/environment.production.ts`; set that `apiBaseUrl` to the deployed API base URL or a same-origin reverse-proxy path.

| Method | Endpoint | Use |
| --- | --- | --- |
| `GET` | `/api/facilities` | Dashboard, facility search/filter/sort, and inspection form facility options |
| `GET` | `/api/facilities/{id}` | Facility detail view |
| `GET` | `/api/inspections` | Dashboard metrics, facility history, and inspection history |
| `POST` | `/api/inspections` | Submit a validated inspection |
| `GET` | `/api/complaints` | Dashboard open complaint metric |

List endpoints use Laravel pagination (`data` and `meta`); the typed service follows all pages rather than silently limiting the UI to the first 15 results. Resource responses are unwrapped from their `data` envelope. Laravel `422` validation messages, server errors and network/unavailable API errors are surfaced in the UI.

## Production deployment and security

The Day 8 API intentionally has no authentication and does not define a CORS allow-list. Do not expose it to untrusted networks. For a separate-origin frontend deployment, configure Laravel CORS to allow only the deployed frontend origin and the required `/api/*` paths, or place the API behind a same-origin reverse proxy. The local Angular proxy is a development convenience and is not used by the production build.

The inspection create request sends `facility_id`, `rating` (1–5), `inspected_at` and `findings`; the API allows the inspector ID to be omitted. Facility and inspection lists honor the Laravel `current_page`/`last_page` metadata and account for the backend's 15-item page size.
