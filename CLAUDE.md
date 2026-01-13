# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chat Community is a full-stack social platform with separate client and server projects:
- **Server**: Fastify + TypeScript + Mongoose (MongoDB)
- **Client**: Vite + React + TanStack Router + TypeScript

The server provides a REST API with WebSocket support for real-time chat, and the client is a responsive React application.

## Common Commands

### Server (from `/server` directory)
```bash
# Development
npm run dev              # Start dev server with hot reload (tsx watch)

# Build & Production
npm run build            # Compile TypeScript to dist/ with path aliases
npm start                # Run production build

# Code Quality
npm run format           # Format and lint with BiomeJS
```

### Client (from `/client` directory)
```bash
# Development
npm run dev              # Start Vite dev server

# Build & Production
npm run build            # Type-check and build for production
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Lint with BiomeJS
npm run format           # Format and lint with BiomeJS
```

### Docker
```bash
# From project root
docker-compose up --build    # Build and run full stack (frontend + backend + MongoDB)
```

When running with Docker:
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:3333/api/docs

## Architecture

### Server Architecture

**Domain-Driven Structure**: Each domain module in `server/src/app/` contains:
- `*.routes.ts` - Route registration
- `*.controller.ts` - Request handlers and route definitions
- `*.service.ts` - Business logic
- `*.schema.ts` - Zod schemas for validation and DTOs
- `*.model.ts` - Mongoose models

**Main domains**: `auth`, `user`, `community`, `chat`

**WebSocket Connection Managers** (`server/src/app/websockets/`):
- `chat.websocket.ts` - `ChatsConnectionManager` class that manages WebSocket connections per community chat room (tracks connected users per community)
- `user.websocket.ts` - `UserStatusManager` class that tracks user online/offline status and broadcasts status changes to relevant chat rooms

**Key patterns**:
- **Type-safe validation**: Uses `fastify-type-provider-zod` with Zod schemas for automatic request/response validation
- **Path aliases**: TypeScript paths use `@/` prefix for `src/` directory
- **Plugin system**: Fastify plugins auto-loaded from `server/src/plugins/` (JWT, CORS, WebSocket, Swagger, etc.)
- **Authentication**: JWT tokens stored in HTTP-only cookies, validated via `authenticate` middleware in `server/src/lib/auth.ts`
- **Error handling**: Custom error classes (`DomainError`, `NotFoundError`, `UnauthorizedError`) in `server/src/lib/errors.ts` with centralized `errorHandler`
- **Settings**: Environment variables validated with Zod in `server/src/settings.ts`

**WebSocket**: Real-time chat uses `@fastify/websocket`. WebSocket routes defined in controllers, error handling via `websocketErrorHandler`. Connection state managed by singleton managers in `server/src/app/websockets/`.

**Database**: MongoDB with Mongoose. Connection established in `server/src/server.ts` during app initialization.

### Client Architecture

**File-based routing**: Uses TanStack Router with routes in `client/src/app/`:
- `__root.tsx` - Root layout with providers (QueryClient, AuthProvider, ThemeProvider)
- `(public)/` - Unauthenticated routes (sign-in, sign-up, home, about)
- `(private)/` - Authenticated routes (communities, chat)
  - `(private)/route.tsx` sets up unauthorized handler and refetches user

**Module structure**: Feature modules in `client/src/modules/` (auth, user, community, home):
- `pages/` - Page components
- `components/` - Module-specific components
- `*.service.ts` - API calls
- `*.schema.ts` - Zod schemas matching server DTOs
- `*.context.tsx` - React context for shared state (auth, chat)

**Key patterns**:
- **State management**: TanStack Query for server state, React Context for auth/chat state
- **API client**: Axios instance in `client/src/lib/api.ts` with interceptors for error handling and unauthorized redirects
- **Authentication flow**:
  - `AuthProvider` in `client/src/modules/auth/auth.context.tsx` manages user state
  - `setUnauthorizedHandler` in private layout triggers logout on 401 responses
  - User query fetched in `AuthProvider`, cached in TanStack Query
- **Forms**: React Hook Form with Zod resolver for validation
- **UI components**: Radix UI primitives + TailwindCSS in `client/src/components/ui/`
- **Styling**: TailwindCSS with `cn()` utility from `lib/utils.ts` for class merging

**WebSocket chat**:
- Chat context in `client/src/modules/community/chat.context.tsx` manages WebSocket connection
- Messages state synchronized with server via WebSocket events

## Environment Setup

### Server `.env` (from `.env.example`)
```
IS_PROD=false
JWT_SECRET='supersecretkey'
MONGODB_URL='mongodb://localhost:27017/chat-community'
```

### Client `.env` (from `.env.example`)
```
VITE_API_URL="http://localhost:3333/api"
```

## Development Workflow

1. **Adding a new feature domain**:
   - Server: Create folder in `server/src/app/<domain>/` with routes → controller → service → schema → model
   - Register routes in `server/src/routes.ts`
   - Client: Create module in `client/src/modules/<domain>/` with service → schema → pages → components
   - Create route file in `client/src/app/` (TanStack Router generates `routeTree.gen.ts` automatically)

2. **Authentication-required endpoints**: Add `onRequest: authenticate` in route options (server) and ensure route is under `(private)/` (client)

3. **WebSocket endpoints**: Define in controller, register in routes, use `websocketErrorHandler` for error handling

4. **Shared types**: Keep server and client schemas in sync manually (Zod schemas in both `*.schema.ts` files)

## API Documentation

Server automatically generates OpenAPI/Swagger documentation available at `/api/docs` using `@scalar/fastify-api-reference`.

## Code Quality

Both projects use **BiomeJS** for linting and formatting. Run `npm run format` before committing.

**No emojis**: Never use emojis in code, console logs, comments, or any other output.
