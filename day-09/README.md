# Day 9 — Angular Facility Inspection Dashboard

## Project Overview

Day 9 builds a responsive Angular and TypeScript dashboard for facilities and inspections. It demonstrates Angular application architecture, routing, data binding, reusable UI, reactive forms, typed services, dependency injection, RxJS, and live REST API integration. It connects to the existing Laravel backend in [Day 8](../day-08/README.md); no Laravel backend is copied into this deliverable.

## Problem Statement

Facility teams need one place to understand facility condition, find a site, review its inspection history, and record a new inspection. The frontend must use the actual API data, clearly represent loading, empty, success, and error outcomes, and validate records before submission.

## Features

- Dashboard with live facility, inspection, condition-rating, operational-status, and open-complaint metrics.
- Facility list with two-way-bound search across names, categories, locations, and departments; category/status filters; and name/condition sorting.
- Facility details with department, condition, operational status, notes, and linked inspection history.
- Inspection history with linked facilities, findings, date, rating, and inspector.
- Reactive inspection form with required-field, whitespace, rating-range, and API-aligned maximum-length validation; field messages; submission feedback; and unsaved-change confirmation.
- Paginated API data loading with visible loading, empty, retry, validation, network, and server error states.
- Responsive navigation, shared page/state components, a condition pipe, and an operational-status directive.

## Technology Stack

- Angular 20 standalone components and Angular Router
- TypeScript strict typing and API models
- Angular `HttpClient` and environment configuration
- RxJS Observables and operators
- Angular Reactive Forms (and `ngModel` for facility search/filter controls)
- Laravel REST API, accessed through a local development proxy
- SCSS, with no additional UI or icon dependencies

## Architecture

```text
angular-app/src/app/
  core/
    guards/       Unsaved inspection navigation guard
    models/       Typed Laravel resources and request shapes
    services/     REST API and error-message services
  pages/          Dashboard, facilities, facility details, inspections, inspection form
  shared/
    components/   Page header and loading/error/empty state
    directives/   Operational-status attribute directive
    pipes/        Facility condition label
```

The root component owns the responsive application shell and router outlet. Feature pages call the injected `FacilityApiService`; UI controls and labels are shared where appropriate. The API has no authentication, so an authentication guard is not appropriate for this integration.

## API Integration

The app uses the existing Day 8 resources and response contracts:

- `GET /api/facilities` — dashboard, facility table and form options.
- `GET /api/facilities/{id}` — facility detail.
- `GET /api/inspections` — dashboard, facility inspection history and history page.
- `POST /api/inspections` — validated inspection submission.
- `GET /api/complaints` — count of open and in-progress complaints on the dashboard.

Laravel resource envelopes and pagination are modeled with TypeScript interfaces. The service loads each page using `meta.current_page` and `meta.last_page`; it does not invent data or stop after the initial 15 records. The local proxy and production-origin guidance are documented in [`api-integration/README.md`](./api-integration/README.md).

## Installation

Prerequisites: Node.js 20.19+ (or 22.12+) and npm; PHP 8.3+, Composer 2, and a configured Day 8 database for the Laravel API.

1. Install the Day 8 API dependencies and configure/migrate/seed its database by following the [Day 8 setup guide](../day-08/README.md).
2. In `day-09/angular-app`, install the Angular dependencies:

   ```sh
   npm install
   ```

## Environment Variables

The frontend does not contain credentials and does not require secrets. Configure its API base URL in:

- `angular-app/src/environments/environment.ts` for development (default `/api`, routed through the local proxy).
- `angular-app/src/environments/environment.production.ts` for production (default `/api`, suitable for a same-origin deployment; replace it with the deployed API URL when required).

For a separate-origin production API, configure an explicit Laravel CORS allow-list for the frontend origin or use a same-origin reverse proxy. The Day 8 API itself requires its existing Laravel/database environment configuration; do not put those credentials in the Angular app.

## How to Run

Start the Laravel API in one terminal:

```sh
cd day-08/laravel-api
php artisan serve
```

Start Angular in another terminal:

```sh
cd day-09/angular-app
npm start
```

Open the local Angular URL printed by `ng serve` (normally `http://localhost:4200`). The Angular dev server proxies API requests to `http://127.0.0.1:8000`. Use `npm run build` for the production build and `npm test -- --watch=false --browsers=ChromeHeadless` for unit tests where Chrome is installed.

## Testing/Validation

- `npx tsc --noEmit -p tsconfig.app.json` — strict application TypeScript check.
- `npx tsc --noEmit -p tsconfig.spec.json` — strict unit-test TypeScript check.
- `npm run build` — Angular production build.
- `npm test -- --watch=false --browsers=ChromeHeadless` — service and form unit tests.
- `php artisan route:list --path=api` in Day 8 — confirm the API resource routes.
- `php artisan test` in Day 8 — run backend contract tests (requires the PHP SQLite PDO driver in the test environment).
- Run both servers to exercise dashboard loading, facility search/filter/sort/details, API error and empty states, inspection history, and valid/invalid inspection form submission against the configured database.

During this implementation, the Angular production build and both TypeScript checks passed; all four Angular unit tests passed. The running Angular app rendered the live dashboard, and its same-origin proxy returned the Day 8 API payloads (5 facilities, 7 inspections, 5 complaints). Browser checks covered facility search, category/status filtering, condition sorting, facility details and inspection history; an invalid form showed field errors, and a valid form created and displayed an API-backed inspection. That temporary verification record was deleted afterwards. `php artisan route:list --path=api` listed all resource routes. `php artisan test` could not execute its backend assertions because this PHP installation has no SQLite PDO driver (`could not find driver`); the live MySQL-backed API was reachable. No lint script is configured in the Angular package.

## Challenges Faced

- Day 8 paginates list results at 15 records, so a naive first-page-only client would omit resources from search and history.
- Local Angular and Laravel servers have different origins, while the sample Laravel API does not define a CORS allow-list.
- The Laravel API returns JSON resource envelopes and field-level validation failures that need to be represented and surfaced consistently.

## Solutions

- The shared typed API service follows every pagination page and unwraps the Laravel `data` envelope.
- A scoped Angular development proxy avoids local cross-origin requests; production CORS/reverse-proxy requirements are documented rather than changing Day 8.
- A shared error service extracts validation and server messages, and all data pages expose explicit loading, retry, empty, and failure states.
- Reactive form validators align with the Day 8 inspection request rules; failed API submissions keep the form data available for correction.

## Future Improvements

- Add authentication and role-based permissions when the backend supports them.
- Add server-side facility search, filters, and sorting for larger datasets.
- Support inspection update workflows, attachments, and notifications.
- Add end-to-end tests against a disposable, seeded Laravel environment.
