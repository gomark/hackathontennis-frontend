# Google Tennis 2025 - Tennis Court Booking App

A modern, responsive web application for booking tennis courts built for Hackathon 2025.

## 🎾 Features

### Authentication
- **Google Login Integration**: Secure authentication using Firebase Auth
- **Automatic Session Management**: Persistent login state across sessions
- **User Profile Display**: Shows user name/email in header

### Court Booking System
- **Date Selection**: 7-day calendar picker for booking dates
- **Court Selection**: Choose from multiple courts (Hard, Clay, Grass)
- **Time Slot Management**: Hour-based booking system with color-coded states:
  - 🟢 **Green**: Available slots
  - 🔴 **Red**: Booked by others
  - 🔵 **Blue**: Your existing bookings
  - ⚫ **Gray**: Outside operation hours
- **Multi-slot Booking**: Select multiple time slots in one booking
- **Real-time Updates**: Automatic refresh after successful bookings

### User Interface
- **Mobile Responsive**: Optimized for both desktop and mobile browsers
- **Modern Design**: Clean, Shadcn UI components with Tailwind CSS
- **Loading States**: Visual feedback during API operations
- **Interactive Elements**: Smooth animations and hover effects

### AI Assistant
- **Floating Chat Icon**: Bottom-right corner assistant (appears after login)
- **Chatbot Interface**: Real-time messaging with tennis assistant
- **Contextual Help**: Assistance with bookings, availability, and tennis rules

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: Firebase Auth with Google Provider
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Date Handling**: date-fns library
- **Build Tool**: Vite 7
- **Linting**: ESLint with TypeScript support

## 📱 Responsive Design

The application is fully responsive and supports:
- **Desktop**: Full-featured layout with sidebar booking summary
- **Tablet**: Adaptive grid layouts
- **Mobile**: Optimized touch interface with stacked layouts

## 🔌 API Integration

### Endpoints Used
- `GET /api/courts` - Fetch available courts
- `GET /api/courts/{id}/timeslots?date={date}` - Get time slots for specific court/date
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/{id}` - Cancel booking
- `PATCH /api/bookings/{id}` - Update booking
- `GET /api/bookings/user` - Get user's bookings
- `POST /api/chat` - Send message to AI assistant

### Authentication
All API calls use Firebase ID tokens via the existing `authService.callAPIWithAccessToken()` method.

## 🎯 Key Components

### `/src/App.tsx`
Main application component handling authentication flow and routing.

### `/src/components/LoginPage.tsx`
Google authentication interface with Firebase integration.

### `/src/components/BookingPage.tsx`
Main booking interface with date/court/time selection.

### `/src/components/ChatBot.tsx`
AI assistant chat interface with floating icon.

### `/src/services/apiService.ts`
API service layer with TypeScript interfaces and error handling.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Type checking
npx tsc -b

# Build for production
npm run build
```

## 🌟 Hackathon Features

- **Rapid Development**: Built with modern tooling for fast iteration
- **Production Ready**: Proper error handling, loading states, and TypeScript
- **Extensible Architecture**: Clean component structure for easy feature additions
- **User Experience**: Intuitive interface requiring minimal learning curve

## 📋 Usage Flow

1. **Login**: User authenticates with Google account
2. **Select Date**: Choose booking date from calendar
3. **Choose Court**: Pick from available tennis courts
4. **Select Times**: Click time slots to book (multi-select supported)
5. **Confirm Booking**: Review summary and complete booking
6. **Get Help**: Use AI assistant for questions or support

The application provides a complete tennis court booking experience with modern web standards and excellent user experience for the hackathon demonstration.