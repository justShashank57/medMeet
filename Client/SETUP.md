# Med-Meet Client Setup Guide

## Frontend Setup

### Environment Variables
The frontend uses a centralized API configuration in `src/services/webcalls.js`. The API base URL is currently set to `http://localhost:5500`.

### Running the Client

1. Navigate to the Client directory:
   ```bash
   cd Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will start on `http://localhost:3000`.

## Features Implemented

### Authentication
- Patient registration and login
- Doctor registration and login
- Role-based authentication (Patient/Doctor)
- Token-based authentication with Redux state management

### Patient Features
- View available doctors
- Book appointments
- View appointment history
- Update profile information

### Doctor Features
- View patient appointments
- Confirm/cancel appointments
- Update profile information
- Toggle availability status

### API Integration
- Centralized API calls in `services/webcalls.js`
- Proper error handling
- Token management
- Automatic retries

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── login.jsx       # Login form
│   ├── SignUp.jsx      # Registration form
│   ├── profile.jsx     # User profile component
│   ├── booking.js      # Appointment booking logic
│   └── bookingsTable.jsx # Appointment display table
├── Pages/              # Page components
│   ├── Doctors.jsx     # Doctors listing page
│   └── Appointment.jsx  # Appointment booking page
├── redux/              # State management
│   ├── slices/         # Redux slices
│   └── store.js        # Redux store configuration
└── services/           # API services
    └── webcalls.js     # Centralized API calls
```

## State Management

The application uses Redux for state management with the following slices:

- `userSlice`: Manages user profile data
- `tokenSlice`: Manages authentication tokens
- `identitySlice`: Manages user role (Patient/Doctor)

## API Integration

All API calls are centralized in the `webcalls.js` file which provides:

- Authentication endpoints (login/signup for both patients and doctors)
- Patient-specific endpoints (profile, appointments, bookings)
-Doctor-specific endpoints (profile, appointments, confirmation)
- Admin endpoints (doctor management)

## Notes

- Make sure the backend server is running on port 5500
- The application supports both patient and doctor workflows
- All protected routes require authentication
- Profile data is fetched automatically upon login
