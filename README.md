# Doctor Appointment Booking System

An intelligent appointment booking system built with React, TypeScript, and Calendly integration. This application provides a conversational flow for patients to book appointments with doctors.

## Features

### 1. Calendly Integration
- Fetch doctor's schedule (working hours, existing appointments)
- Get available time slots dynamically
- Create new appointments
- Handle different appointment types with durations:
  - General Consultation: 30 minutes
  - Follow-up: 15 minutes
  - Physical Exam: 45 minutes
  - Specialist Consultation: 60 minutes

### 2. Intelligent Conversation Flow

#### Phase 1: Understanding Needs
- Warm greeting
- Understand reason for visit
- Determine appointment type
- Ask about preferred date/time

#### Phase 2: Slot Recommendation
- Show 3-5 available slots based on preferences
- Explain why slots are suggested
- Handle "none of these work" gracefully
- Offer alternative dates/times

#### Phase 3: Booking Confirmation
- Collect necessary information:
  - Patient name
  - Phone number
  - Email
  - Reason for visit
- Confirm all details before booking
- Create appointment via Calendly
- Provide confirmation details

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Assesment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
Create a `.env` file in the root directory:
```env
VITE_CALENDLY_TOKEN=your_calendly_token
VITE_CALENDLY_USER_URI=your_calendly_user_uri
```

Note: If these environment variables are not set, the application will use mock data for development purposes.

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── phases/
│   │   ├── GreetingPhase.tsx
│   │   ├── UnderstandingNeedsPhase.tsx
│   │   ├── AppointmentTypePhase.tsx
│   │   ├── PreferredTimePhase.tsx
│   │   ├── SlotRecommendationPhase.tsx
│   │   ├── BookingConfirmationPhase.tsx
│   │   ├── CompletedPhase.tsx
│   │   └── Phase.css
│   ├── ConversationFlow.tsx
│   └── ConversationFlow.css
├── config/
│   └── appointmentTypes.ts
├── services/
│   └── calendlyService.ts
├── types/
│   └── index.ts
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```

## Calendly API Setup

To use the real Calendly API:

1. Create a Calendly account
2. Generate an API token from your Calendly settings
3. Get your user URI
4. Add them to your `.env` file

For more information, visit: https://developer.calendly.com/

## Technologies Used

- React 18
- TypeScript
- Vite
- Axios
- CSS3

## License

MIT

