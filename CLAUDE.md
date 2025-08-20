# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite frontend application for a hackathon tennis project. It's a standard Vite-based React application with TypeScript configuration and ESLint for code quality.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (runs TypeScript compilation followed by Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all TypeScript/TSX files

### Type Checking
- `tsc -b` - Run TypeScript compiler for type checking (included in build process)

## Architecture

### Tech Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7 with React plugin
- **Linting**: ESLint with TypeScript ESLint integration
- **Styling**: CSS (App.css, index.css)

### Project Structure
- `src/` - Main application source code
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
  - `assets/` - Static assets (images, etc.)
- `public/` - Public static files served by Vite
- `dist/` - Build output directory (ignored by ESLint)

### TypeScript Configuration
The project uses a multi-config TypeScript setup:
- `tsconfig.json` - Root configuration with project references
- `tsconfig.app.json` - Application-specific TypeScript config
- `tsconfig.node.json` - Node.js-specific config for build tools

### ESLint Configuration
Uses modern ESLint flat config format with:
- TypeScript ESLint integration
- React Hooks plugin for React-specific rules
- React Refresh plugin for Vite HMR
- Browser globals configuration

## Development Notes

### Build Process
The build command runs TypeScript compilation first (`tsc -b`) then Vite build, ensuring type safety before bundling.

### Hot Module Replacement
Vite provides fast HMR during development. Edit TypeScript/TSX files in `src/` to see immediate updates.

### API Configuration
The project is configured to handle different API endpoints for development and production:

**Development**: 
- Vite dev server proxies `/api/*` requests to `http://localhost:8080/api/*`
- Use relative API calls like `fetch('/api/endpoint')` in your code
- Backend server should run on `localhost:8080`

**Production**:
- API calls to `/api/*` go directly to the same domain
- No proxy configuration needed in production build

**Environment Variables**:
- `.env.development` - Development-specific configuration
- `.env.production` - Production-specific configuration
- Access via `import.meta.env.VITE_API_BASE_URL` in code

### Code Quality
ESLint is configured to enforce TypeScript and React best practices. Run `npm run lint` before committing changes.