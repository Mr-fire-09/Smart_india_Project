# Digital Governance Platform

## Overview
A smart digital governance platform that provides transparent application processing with AI-powered monitoring, blockchain verification, and guaranteed 30-day auto-approval.

## Purpose
Enable citizens to submit government applications online, track their progress in real-time, and receive timely updates while ensuring accountability through AI monitoring and blockchain verification.

## Tech Stack
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for state management
- **Backend**: Express.js with TypeScript
- **Authentication**: JWT with role-based access control
- **UI Components**: Shadcn UI with Tailwind CSS
- **Storage**: In-memory storage (MemStorage)
- **AI Monitoring**: Automated delay detection and auto-approval system

## User Roles
1. **Citizen**: Submit applications, track status, provide feedback
2. **Official**: Accept assignments, update application status, manage workload
3. **Admin**: Monitor system performance, view analytics, manage officials

## Core Features

### Citizen Features
- Submit applications with detailed forms
- Track applications using unique tracking ID
- View application progress with status timeline
- Receive real-time notifications
- Submit OTP-verified feedback and ratings
- View blockchain verification certificates

### Official Features
- View unassigned applications
- Accept and work on applications
- Update application status with comments
- Receive delay alerts
- Track personal performance metrics

### Admin Features
- Monitor all applications system-wide
- View official performance metrics
- Track delayed applications
- System analytics dashboard

### AI & Automation
- **Delay Detection**: Automatically detects applications pending for >7 days
- **Auto-Approval**: Applications automatically approved after 30 days
- **Notification System**: Real-time alerts for all stakeholders
- **Blockchain Simulation**: SHA-256 hash generation for approved applications

## Project Structure

### Frontend (`client/src/`)
- **pages/**: All page components (Landing, Login, Register, Dashboards)
  - `landing.tsx`: Hero section with features
  - `login.tsx` & `register.tsx`: Authentication
  - `citizen/`: Citizen dashboard, submit, track, application details
  - `official/`: Official dashboard with sidebar
  - `admin/`: Admin dashboard with analytics
- **components/**: Reusable UI components
  - `application-card.tsx`: Application display card
  - `status-stepper.tsx`: Progress timeline
  - `otp-modal.tsx`: OTP verification
  - `rating-component.tsx`: 5-star rating system
  - `blockchain-hash.tsx`: Hash display with verification
  - `notification-bell.tsx`: Notification dropdown
  - `stats-card.tsx`: Dashboard statistics
  - `theme-toggle.tsx`: Dark/light mode switcher
- **contexts/**: React contexts for global state
  - `auth-context.tsx`: User authentication state
- **lib/**: Utility functions
  - `queryClient.ts`: TanStack Query configuration with auth headers

### Backend (`server/`)
- `routes.ts`: All API endpoints with authentication middleware
  - Auth: `/api/auth/register`, `/api/auth/login`
  - Applications: `/api/applications/*`
  - Feedback: `/api/feedback`
  - OTP: `/api/otp/generate`, `/api/otp/verify`
  - Notifications: `/api/notifications`
  - Users: `/api/users/officials`
- `storage.ts`: In-memory data storage with complete CRUD operations
- AI Monitoring Service: Runs every hour to check delays and trigger auto-approvals

### Shared (`shared/`)
- `schema.ts`: Complete data models and Zod validation schemas
  - User, Application, ApplicationHistory, Feedback, OTPRecord, BlockchainHash, Notification

## Application Workflow

1. **Submission**: Citizen submits application → Receives unique tracking ID
2. **Assignment**: Official accepts application → Status: Assigned
3. **Processing**: Official updates status → Status: In Progress
4. **Completion**: Official approves/rejects → Blockchain hash generated (if approved)
5. **Feedback**: Citizen provides OTP-verified rating and feedback
6. **Auto-Approval**: If no action for 30 days → Auto-approved with notification

## Key Design Decisions

### Authentication
- JWT tokens stored in localStorage
- Bearer token sent in Authorization header
- Role-based middleware for protected routes

### AI Monitoring
- Interval-based checking every hour
- Detects delays (>7 days since last update)
- Auto-approves applications after 30 days
- Sends notifications to relevant stakeholders

### Blockchain Simulation
- SHA-256 hash of application ID + timestamp
- Sequential block numbering
- Generated only for approved applications
- Immutable record with copy-to-clipboard functionality

### Notification System
- Created for all major events (submission, assignment, delays, approvals)
- User-specific with read/unread status
- Categorized by type (approval, delay, assignment, feedback)

## Recent Changes (Latest Session)

### Data Schema
- Defined complete data models for all entities
- Added proper TypeScript types and Zod schemas
- Implemented auto-approval date calculation

### Frontend Implementation
- Built all pages and components following Material Design guidelines
- Implemented government-themed color scheme (professional blue palette)
- Created responsive layouts with Shadcn sidebar components
- Added dark mode support with theme toggle
- Implemented protected routes with role-based access

### Backend Implementation
- Complete REST API with JWT authentication
- Role-based authorization middleware
- AI monitoring service with auto-approval
- OTP generation and verification
- Blockchain hash simulation
- Comprehensive notification system

### Integration
- Connected frontend to backend with proper auth headers
- Implemented error handling and loading states
- Set up TanStack Query for data fetching and caching

## Environment Variables
- `SESSION_SECRET`: JWT signing secret (available in secrets)

## Running the Application
The application runs on port 5000 and is started automatically via the "Start application" workflow.

Access different user portals:
- Landing: `/`
- Citizen Dashboard: `/citizen/dashboard`
- Official Dashboard: `/official/dashboard`
- Admin Dashboard: `/admin/dashboard`

## Testing Strategy
- E2E testing for complete user journeys
- Test all three user roles independently
- Verify AI monitoring triggers correctly
- Confirm OTP verification flow
- Validate blockchain hash generation
