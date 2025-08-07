# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the DGH (Digital Global Health) platform frontend - a Next.js application that interfaces with a Django REST Framework API gateway. The platform serves healthcare professionals and patients in Cameroon with multi-language support (French, English, and local languages).

## Backend API Integration

The frontend connects to a Django API gateway at `http://localhost:8000` with the following key endpoints:

### Authentication Endpoints
- `POST /api/v1/auth/register/patient/` - Patient registration
- `POST /api/v1/auth/register/professional/` - Professional registration  
- `POST /api/v1/auth/login/` - User login (returns JWT tokens + profile)
- `POST /api/v1/auth/logout/` - Token blacklisting
- `POST /api/v1/auth/token/refresh/` - Refresh access token

### User Roles
- **Patient**: Basic healthcare consumers with feedback capabilities
- **Professional**: Healthcare providers (doctors, nurses) with specialized access
- **Admin**: System administrators

### JWT Token Management
- Access tokens: 24-hour lifetime
- Refresh tokens: 7-day lifetime with rotation
- Authorization header: `Bearer {access_token}`

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Technology Stack

- **Framework**: Next.js 15.4.4 with App Router
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (to be added)
- **HTTP Client**: Native fetch API
- **UI Components**: Origin UI components with shadcn/ui utilities
- **Languages**: TypeScript
- **Package Manager**: pnpm

## Architecture Patterns

### Authentication Flow
1. Single login page handling both patient and professional authentication
2. JWT tokens stored securely with automatic refresh
3. Role-based navigation and component rendering
4. Protected routes with middleware

### State Management (Zustand)
```javascript
// Auth store pattern
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  userType: null, // 'patient' | 'professional' | 'admin'
  login: (credentials) => { /* login logic */ },
  logout: () => { /* logout logic */ },
}))
```

### API Layer Structure
- Base API configuration with interceptors
- Token refresh handling
- Error handling with user-friendly messages
- Multi-language error responses

## Key Features to Implement

### Phase 1: Authentication & Patient Focus
- Unified login/register page with role selection
- Patient dashboard with feedback capabilities
- Profile management
- Multi-language support (French/English priority)

### Phase 2: Professional Features
- Professional dashboard
- Patient management interface
- Analytics and reporting

### Required Dependencies to Add
```bash
pnpm add zustand @tanstack/react-query axios
```

## UI Component Structure

Using Origin UI components with consistent patterns:
- Form components with validation
- Dashboard layouts with sidebar navigation
- Modal/dialog components for actions
- Loading states and error boundaries
- Mobile-responsive design

## Multi-language Considerations

Support for:
- French (primary)
- English (secondary)  
- Local Cameroonian languages (dua, bas, ewo)

Contact method preferences:
- SMS, voice calls, WhatsApp integration

## Security Requirements

- Input validation on all forms
- Secure token storage (httpOnly cookies preferred)
- CORS configuration for API communication
- No sensitive data in localStorage
- Error handling without exposing system details