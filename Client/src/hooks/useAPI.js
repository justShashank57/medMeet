import { useState, useCallback } from 'react';
import { useToast } from '../components/Toast';

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const execute = useCallback(async (apiCall, successMessage, errorMessage, silent = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      if (!silent && successMessage) {
        addToast({ message: successMessage, type: 'success' });
      }
      
      return result;
    } catch (err) {
      const errorMsg = errorMessage || err.message || 'An error occurred';
      setError(errorMsg);
      
      if (!silent) {
        addToast({ message: errorMsg, type: 'error' });
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return { execute, loading, error };
}

// Specific hooks for different operations
export function useAuth() {
  const { execute, loading, error } = useAPI();
  
  const signup = useCallback(async (apiCall, identity) => {
    const message = `Successfully registered as ${identity}! Redirecting...`;
    return execute(apiCall, message, 'Registration failed');
  }, [execute]);

  const login = useCallback(async (apiCall) => {
    return execute(apiCall, 'Successfully logged in!', 'Login failed');
  }, [execute]);

  const logout = useCallback(async (apiCall) => {
    return execute(apiCall, 'Successfully logged out!', 'Logout failed');
  }, [execute]);

  return { signup, login, logout, loading, error };
}

export function useProfile() {
  const { execute, loading, error } = useAPI();

  const fetchProfile = useCallback(async (apiCall) => {
    return execute(apiCall, null, 'Failed to load profile', true);
  }, [execute]);

  const updateProfile = useCallback(async (apiCall) => {
    return execute(apiCall, 'Profile updated successfully!', 'Failed to update profile');
  }, [execute]);

  return { fetchProfile, updateProfile, loading, error };
}

export function useAppointments() {
  const { execute, loading, error } = useAPI();

  const fetchAppointments = useCallback(async (apiCall) => {
    return execute(apiCall, null, 'Failed to load appointments', true);
  }, [execute]);

  const bookAppointment = useCallback(async (apiCall) => {
    return execute(apiCall, 'Appointment booked successfully!', 'Failed to book appointment');
  }, [execute]);

  const confirmAppointment = useCallback(async (apiCall) => {
    return execute(apiCall, 'Appointment confirmed!', 'Failed to confirm appointment');
  }, [execute]);

  const cancelAppointment = useCallback(async (apiCall) => {
    return execute(apiCall, 'Appointment cancelled successfully!', 'Failed to cancel appointment');
  }, [execute]);

  return { fetchAppointments, bookAppointment, confirmAppointment, cancelAppointment, loading, error };
}

export function useDoctors() {
  const { execute, loading, error } = useAPI();

  const fetchDoctors = useCallback(async (apiCall) => {
    return execute(apiCall, null, 'Failed to load doctors', true);
  }, [execute]);

  return { fetchDoctors, loading, error };
}
