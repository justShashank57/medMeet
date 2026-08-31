import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://medmeet-1.onrender.com';

// Get token from localStorage
const getAuthToken = () => localStorage.getItem('jwt');

// Admin key is kept in sessionStorage (cleared when the tab closes) since it's
// a shared secret, not a per-user credential.
const getAdminKey = () => sessionStorage.getItem('adminKey');
const setAdminKey = (key) => sessionStorage.setItem('adminKey', key);
const clearAdminKey = () => sessionStorage.removeItem('adminKey');
const hasAdminKey = () => Boolean(getAdminKey());

// Export reusable API functions
export const api = {
  // Auth functions
  auth: {
    patientSignup: async (userData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/patient/signup`, userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    patientLogin: async (credentials) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/patient/login`, credentials);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    doctorSignup: async (doctorData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/doctor/signup`, doctorData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    doctorLogin: async (credentials) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/doctor/login`, credentials);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    logout: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patient/logout`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    }
  },

  // Patient functions
  patient: {
    getProfile: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patient/profile`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    updateProfile: async (profileData) => {
      try {
        const response = await axios.patch(`${API_BASE_URL}/patient/profile`, profileData, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    getDoctors: async ({ search, speciality, page, limit = 100 } = {}) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patient/getDoctors`, {
          params: { search, speciality, page, limit },
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    getDoctorById: async (doctorId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patient/getDoctor/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    bookAppointment: async (appointmentData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/patient/create-appointment`, appointmentData, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    getAppointments: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patient/appointments`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    getAppointmentById: async (appointmentId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patient/appointment/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    }
  },

  // Doctor functions
  doctor: {
    getProfile: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctor/profile`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    updateProfile: async (profileData) => {
      try {
        const response = await axios.patch(`${API_BASE_URL}/doctor/profile`, profileData, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    getAppointments: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctor/appointments`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    confirmAppointment: async (appointmentId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctor/confirm-appointment/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    updateAppointmentStatus: async (appointmentData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/doctor/update-status`, appointmentData, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    
    toggleAvailability: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctor/service`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    }
  },

  // Admin functions
  admin: {
    setKey: setAdminKey,
    clearKey: clearAdminKey,
    hasKey: hasAdminKey,

    getDoctors: async ({ page, limit = 100 } = {}) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/doctors`, {
          params: { page, limit }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    getDoctorById: async (doctorId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/doctor/${doctorId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    createDoctor: async (doctorData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/doctor`, doctorData, {
          headers: { 'x-admin-key': getAdminKey() }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    deleteDoctor: async (doctorId) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/admin/doctor/${doctorId}`, {
          headers: { 'x-admin-key': getAdminKey() }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    }
  }
};

export default api;
