# Med-Meet - Medical Appointment System

A full-stack medical appointment booking system built with React.js frontend and Node.js/Express backend.

## 🚀 Features

### Patient Features
- ✅ User Registration & Authentication
- ✅ View Available Doctors
- ✅ Book Appointments
- ✅ View Appointment History
- ✅ Update Profile Information

### Doctor Features
- ✅ Doctor Registration & Authentication
- ✅ View Patient Appointments
- ✅ Confirm/Cancel Appointments
- ✅ Update Profile Information
- ✅ Toggle Availability Status

### Admin Features
- ✅ Manage Doctors
- ✅ View All System Data

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Axios** - HTTP Client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password Hashing

## 📋 Prerequisite

- **Node.js** (v14 or higher)
- **MongoDB** (Local installation or MongoDB Atlas)
- **Git**

## 🚀 Quick Start

### 1. Server Setup

```bash
# Navigate to server directory
cd Server

# Install dependencies
npm install

# Create .env file with following variables:
PORT=5500
MONGODB_URL=mongodb://localhost:27017/med-meet
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Start server
npm start
```

### 2. Client Setup

```bash
# Navigate to client directory
cd Client

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5500

## 📁 Project Structure

```
med-meet/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── Pages/          # Page components
│   │   ├── redux/          # State management
│   │   ├── services/       # API services
│   │   └── data/           # Static data
│   ├── public/             # Static assets
│   └── SETUP.md           # Frontend setup guide
├── Server/                 # Node.js Backend
│   ├── controllers/        # Route controllers
│   ├── Models/            # Database models
│   ├── Routes/            # API routes
│   ├── services/          # Core services
│   ├── middlewares/       # Custom middleware
│   ├── utility/           # Utility functions
│   ├── config.js          # Configuration
│   └── setup-guide.md     # Backend setup guide
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the Server directory:

```env
PORT=5500
MONGODB_URL=mongodb://localhost:27017/med-meet
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### API Endpoints

#### Authentication
- `POST /patient/signup` - Patient registration
- `POST /patient/login` - Patient login
- `POST /doctor/signup` - Doctor registration
- `POST /doctor/login` - Doctor login

#### Patient Endpoints
- `GET /patient/profile` - Get patient profile
- `PATCH /patient/profile` - Update patient profile
- `GET /patient/getDoctors` - Get all doctors
- `POST /patient/create-appointment` - Book appointment
- `GET /patient/appointments` - Get patient appointments

#### Doctor Endpoints
- `GET /doctor/profile` - Get doctor profile
- `PATCH /doctor/profile` - Update doctor profile
- `GET /doctor/appointments` - Get doctor appointments
- `GET /doctor/confirm-appointment/:id` - Confirm appointment
- `POST /doctor/update-status` - Update appointment status
- `GET /doctor/service` - Toggle availability

#### Admin Endpoints
- `GET /admin/doctors` - Get all doctors
- `POST /admin/doctor` - Create doctor
- `DELETE /admin/doctor/:id` - Delete doctor

## 📱 Usage

### For Patients
1. Register as a patient
2. Login to access features
3. Browse available doctors
4. Book appointments
5. View appointment history

### For Doctors
1. Register as a doctor
2. Login to access dashboard
3. View patient appointments
4. Confirm/cancel appointments
5. Update profile and availability

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and endpoints
- Input validation and sanitization
- CORS configuration

## 🌐 API Integration

The frontend uses a centralized API service (`src/services/webcalls.js`) that provides:
- Centralized API management
- Automatic token handling
- Error handling
- Type-safe API calls

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Payment integration
- [ ] Email notifications
- [ ] Real-time chat
- [ ] Video consultation
- [ ] Mobile app
- [ ] Admin dashboard UI

---

**Note**: This is a development version. Make sure to configure proper environment variables and security settings for production use.
