# GrowthTracker - Personal Development Hub

## Overview

GrowthTracker is a comprehensive personal development application built with a modern full-stack architecture. It provides users with tools to track habits, set goals, maintain a journal, and monitor side project finances, all enhanced with AI-powered insights and recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with custom shadcn/ui styling
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **PWA Support**: Service worker and manifest for Progressive Web App features

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **AI Integration**: OpenAI API for generating insights and recommendations

### Key Components

1. **Authentication System**
   - Uses Replit's OpenID Connect authentication
   - Session-based authentication with PostgreSQL session store
   - Automatic redirect handling for unauthorized users

2. **Database Schema**
   - Users table for authentication data
   - Goals table for personal objectives tracking
   - Habits table for recurring activities
   - Habit completions for tracking daily progress
   - Journal entries for reflection and mood tracking
   - Transactions for side project finance tracking
   - AI insights for storing generated recommendations
   - Sessions table for authentication sessions

3. **AI-Powered Features**
   - Daily summary generation using OpenAI
   - Goal recommendations based on user data
   - Habit completion analysis and suggestions
   - Mood and productivity tracking insights

4. **Mobile-First Design**
   - Responsive layout with bottom navigation
   - Floating action button for quick actions
   - PWA capabilities for mobile app-like experience
   - Touch-friendly interface with proper spacing

## Data Flow

1. **Authentication Flow**
   - User authenticates via Replit OAuth
   - Session stored in PostgreSQL
   - User data retrieved and cached via React Query

2. **Data Management**
   - All API calls go through centralized query client
   - Optimistic updates for better UX
   - Automatic cache invalidation on mutations
   - Error handling with user-friendly messages

3. **AI Integration**
   - Periodic analysis of user data
   - Summary generation on demand
   - Recommendation storage for future reference
   - Context-aware insights based on habits and goals

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI components
- **openai**: AI integration for insights
- **express**: Web server framework
- **passport**: Authentication middleware

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **vite**: Frontend build tool and dev server
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Development Environment
- Uses Vite dev server with HMR
- TSX for running TypeScript server files
- Automatic database migrations with Drizzle
- Replit-specific development plugins

### Production Build
- Frontend: Vite builds to `dist/public` directory
- Backend: esbuild bundles server to `dist/index.js`
- Static file serving from Express in production
- Environment variables for configuration

### Database Management
- Schema defined in `shared/schema.ts`
- Migrations generated in `migrations/` directory
- Database URL configuration via environment variables
- Automatic schema synchronization in development

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types between frontend and backend for type safety
2. **Drizzle ORM**: Chosen for type safety and PostgreSQL compatibility over alternatives like Prisma
3. **React Query**: Selected for robust server state management and caching capabilities
4. **Radix UI**: Provides accessible, unstyled components that can be customized with Tailwind
5. **OpenAI Integration**: Enables AI-powered insights without requiring complex ML infrastructure
6. **PWA Architecture**: Provides native app-like experience while maintaining web accessibility
7. **Session-based Auth**: Uses Replit's authentication system for simplified user management

The application follows a clean separation of concerns with shared types, centralized error handling, and a consistent API structure that makes it easy to extend and maintain.