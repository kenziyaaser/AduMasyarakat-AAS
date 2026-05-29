import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const AuthContext = createContext(null);

// NOTE: For Android Emulator, use 'http://10.0.2.2:5000'
// For iOS Simulator / Web Browser / localhost, use 'http://localhost:5000'
// For Physical Device, use your computer's local IP (e.g., 'http://192.168.1.10:5000')
export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.warn('Failed to restore auth state', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (jwtToken, userProfile) => {
    try {
      setToken(jwtToken);
      setUser(userProfile);
      await AsyncStorage.setItem('token', jwtToken);
      await AsyncStorage.setItem('user', JSON.stringify(userProfile));
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } catch (e) {
      console.error('Failed to save login session', e);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    } catch (e) {
      console.error('Failed to clear login session', e);
    }
  };

  const updateUser = async (newProfile) => {
    try {
      setUser(newProfile);
      await AsyncStorage.setItem('user', JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to update user session', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
