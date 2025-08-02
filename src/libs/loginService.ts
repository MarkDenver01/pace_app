import api from './api';
import { type LoginRequest } from './models/request/LoginRequest';

export async function login(request: LoginRequest) {
  try {
    const response = await api.post('/user/public/login', request);
    
    // Save token to localStorage or cookie
    const username = response.data.username;
    const role = response.data.role;
    const token = response.data.jwtToken;
    if (token) {
      localStorage.setItem('jwtToken', token);
    }
    if (role) {
      localStorage.setItem('authorized_role', role);
    }
    if (username) {
      localStorage.setItem('authorized_username', username);
    }

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Login failed' };
  }
}

