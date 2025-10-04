# Med-Meet Server Setup Guide

## Environment Variables Setup

Before running the server, you need to set up environment variables. Create a `.env` file in the Server directory with the following content:

```
PORT=5500
MONGODB_URL=mongodb://localhost:27017/med-meet
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. For local installation, make sure MongoDB is running on the default port 27017
3. For MongoDB Atlas, replace `localhost:27017` with your Atlas connection string

### Running the Server

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on port 5500 by default.

## Testing the API

You can test the API endpoints using tools like Postman or curl:

### Patient Endpoints
- POST `/patient/signup` - Register a new patient
- POST `/patient/login` - Patient login
- GET `/patient/profile` - Get patient profile (requires auth)
- GET `/patient/getDoctors` - Get all doctors
- POST `/patient/create-appointment` - Book an appointment

### Doctor Endpoints
- POST `/doctor/signup` - Register a new doctor
- POST `/doctor/login` - Doctor login
- GET `/doctor/profile` - Get doctor profile (requires auth)
- GET `/doctor/appointments` - Get doctor's appointments
- GET `/doctor/confirm-appointment/:id` - Confirm appointment

### Admin Endpoints
- GET `/admin/doctors` - Get all doctors
- POST `/admin/doctor` - Create a new doctor
- DELETE `/admin/doctor/:id` - Delete a doctor

## Notes
- All protected endpoints require Authentication header with Bearer token
- Change JWT_SECRET to a secure random string in production
- MongoDB is required for the application to work
