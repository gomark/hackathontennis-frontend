# Tennis Booking App - Frontend

A React TypeScript frontend application for tennis court booking, built as part of a hackathon project. The application provides user authentication, court booking functionality, and an integrated chatbot for assistance.

## Features

- 🎾 Tennis court booking system
- 🔐 User authentication and login
- 🤖 Integrated chatbot for user assistance
- 📅 Date picker for booking selection
- 🎨 Modern UI with Tailwind CSS
- 🔥 Firebase integration for backend services

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Lucide React
- **Backend**: Firebase/Firestore
- **Routing**: React Router DOM
- **Date Handling**: date-fns
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
src/
├── components/
│   ├── BookingPage.tsx      # Tennis court booking interface
│   ├── ChatBot.tsx          # AI chatbot component
│   ├── LoginPage.tsx        # User authentication
│   └── ui/                  # Reusable UI components
├── services/
│   └── apiService.ts        # API communication layer
├── shared/
│   └── services/
│       ├── authService.ts   # Authentication logic
│       └── utils.ts         # Shared utilities
└── lib/
    └── utils.ts             # Utility functions
```

## API Configuration

The application is configured to work with different API endpoints:

- **Development**: Proxies `/api/*` requests to `http://localhost:8080/api/*`
- **Production**: API calls go to `/api/*` on the same domain

## Contributing

This is a hackathon project. For development:

1. Follow the existing code style and TypeScript practices
2. Run `npm run lint` before committing
3. Ensure all type checks pass with the build command

## License

This project was created for hackathon purposes.
