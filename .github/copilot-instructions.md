# Copilot Instructions for Modex Booking System

## Architecture Overview

**Modex** is a full-stack event booking application with two independently deployable layers:

- **Backend** (`/backend`): Express.js server (port 4000) providing REST APIs for show management and seat booking
- **Frontend** (`/frontend`): React + Vite SPA consuming backend APIs

### Data Model & Critical Pattern: Optimistic Locking via Unique Constraints

The key architectural decision preventing race conditions is documented in `prisma/schema.prisma`:

```prisma
model BookingSeat {
  @@unique([showId, seatNumber]) // prevents overbooking
}
```

- Each `BookingSeat` record represents a booked seat with a **composite unique constraint** on `(showId, seatNumber)`
- Concurrent booking requests for the same seat will trigger a database constraint violation—Prisma wraps this in `P2002`
- Controllers handle this by catching the error and returning HTTP 409 (Conflict) with user-friendly message
- **See**: `backend/src/booking.controller.js` lines 35-40 for error handling pattern

### Backend Architecture: MVC Pattern with Route-Controller Separation

Routes delegate business logic to controllers following a strict separation:

- **Routes** (`show.routes.js`, `booking.routes.js`): Define HTTP methods, map to controller actions
- **Controllers** (`show.controller.js`, `booking.controller.js`): Implement request handling, Prisma queries, error catching
- **Prisma Client** (`prismaClient.js`): Centralized singleton exported to all controllers

**Example flow**: `POST /bookings` → `booking.routes.js` → `createBooking()` controller → transaction + unique constraint check

## Critical Developer Workflows

### Backend Development

**Start Dev Server**:
```bash
cd backend && npm run dev
```
Server runs on port 4000 (hardcoded in `server.js`). Uses dotenv—create `.env` with `PORT` and `DATABASE_URL`.

**Prisma Migrations** (when schema changes):
```bash
cd backend && npx prisma migrate dev --name <migration_name>
```

**Database Reset** (if needed):
```bash
npx prisma migrate reset  # resets + re-seeds
```

### Frontend Development

**Start Dev Server**:
```bash
cd frontend && npm run dev
```
Runs on port 5173 (Vite default). Calls backend at hardcoded `http://localhost:4000` (see `frontend/src/api.js`).

**Build for Production**:
```bash
cd frontend && npm run build
```
Outputs to `dist/`. Consider externalizing backend URL from `api.js` for environment-specific deployments.

### Common Development Tasks

**Add New API Endpoint**:
1. Define Prisma model changes in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <feature>`
3. Create controller method in `backend/src/<feature>.controller.js`
4. Create routes in `backend/src/<feature>.routes.js`
5. Import and mount router in `server.js` under appropriate path (`/admin/*` for admin, `/` for user)

## Project-Specific Conventions

### Naming & Path Patterns

- **Admin routes**: Mount under `/admin/*` (e.g., `POST /admin/shows`)
- **User/public routes**: Mount directly under `/` (e.g., `GET /shows`)
- **Shared routes**: Can be mounted twice (e.g., `GET /shows` and `GET /admin/shows` both route to `listShows()`)

### Error Handling Conventions

Controllers throw/catch errors and respond with:
- `400`: Missing/invalid request body parameters
- `409`: Database constraint violations (overbooking scenario)
- `500`: Unexpected server errors

Pattern:
```javascript
try {
  // business logic
} catch (err) {
  console.error('Error describing action:', err);
  res.status(statusCode).json({ error: 'User-friendly message' });
}
```

### Transaction Safety Pattern

Booking uses Prisma transactions (`prisma.$transaction()`) to atomically:
1. Create `Booking` record with `PENDING` status
2. Create multiple `BookingSeat` records (may fail due to unique constraint)
3. Update `Booking` to `CONFIRMED` on success, `FAILED` on seat conflict

See `booking.controller.js` lines 8-45 for implementation.

## External Dependencies & Integration Points

### Backend Stack
- **Express.js**: HTTP server, routing, middleware (CORS enabled)
- **Prisma**: ORM for PostgreSQL, migrations, schema validation
- **PostgreSQL**: Primary datastore (configured via `DATABASE_URL` env var)
- **dotenv**: Loads environment variables from `.env`

### Frontend Stack
- **React 19**: UI framework (currently boilerplate)
- **Vite**: Build tool, dev server with HMR
- **Axios**: HTTP client configured in `frontend/src/api.js` with `baseURL: http://localhost:4000`
- **ESLint**: Linting rules in `eslint.config.js`

### No External Auth/Services
- System assumes single admin + multiple concurrent users
- No authentication layer (scope out for future)
- No payment/email integrations

## Key Files by Role

- **Prisma Schema** (`prisma/schema.prisma`): Source of truth for data model and unique constraints
- **Show Management** (`backend/src/show.*`): Endpoints for admin and user show listing
- **Booking Logic** (`backend/src/booking.controller.js`): Transaction + concurrency handling
- **API Client** (`frontend/src/api.js`): Backend URL; centralize env config here for production
- **Server Entry** (`backend/src/server.js`): Port, CORS, route mounting

## Implementation Tips for AI Agents

1. **Before adding features**: Check the unique constraint pattern in Prisma schema—it prevents overbooking at DB level.
2. **Cross-layer consistency**: When modifying a model, update schema.prisma first, generate migration, then update corresponding controller queries.
3. **Testing concurrency**: Booking endpoint is most likely to surface race conditions; consider concurrent requests to same seat.
4. **Environment config**: Backend port hardcoded in `server.js` (4000); frontend hardcoded in `api.js`. Plan for environment-specific overrides.
5. **Frontend bootstrap**: `App.jsx` is boilerplate—implement feature components separately and integrate via imports.
