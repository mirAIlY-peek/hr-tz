import { create } from 'zustand';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    error: string | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setError: (error: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    user: null,
    error: null,
    setToken: (token) => {
        set({ token });
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    },
    setUser: (user) => set({ user }),
    setError: (error) => set({ error }),
    login: async (email, password) => {
        try {
            console.log('Attempting login with:', { email, password });
            const { data } = await axios.post('http://localhost:5000/login', { email, password });
            console.log('Login response:', data);
            set({ token: data.token, error: null });
            localStorage.setItem('token', data.token);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Login error:', error.response?.data || error.message);
                set({ error: error.response?.data?.error || 'An error occurred during login' });
            } else {
                console.error('Unexpected error:', error);
                set({ error: 'An unexpected error occurred' });
            }
            throw error;
        }
    },
    register: async (email, password, name) => {
        try {
            console.log('Attempting registration with:', { email, password, name });
            const { data } = await axios.post('http://localhost:5000/register', { email, password, name });
            console.log('Registration response:', data);
            if (data.token) {
                set({ token: data.token, error: null });
                localStorage.setItem('token', data.token);
            } else {
                throw new Error('No token received after registration');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Registration error:', error.response?.data || error.message);
                set({ error: error.response?.data?.error || 'An error occurred during registration' });
            } else {
                console.error('Unexpected error:', error);
                set({ error: 'An unexpected error occurred' });
            }
            throw error;
        }
    },
    fetchProfile: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                console.log('Fetching profile with token:', token);
                const { data } = await axios.get<User>('http://localhost:5000/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Profile data:', data);
                set({ user: data, error: null });
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Fetch profile error:', error.response?.data || error.message);
                    set({ error: error.response?.data?.error || 'An error occurred while fetching profile' });
                } else {
                    console.error('Unexpected error:', error);
                    set({ error: 'An unexpected error occurred while fetching profile' });
                }
                throw error;
            }
        } else {
            console.error('No token found in localStorage');
            set({ error: 'No authentication token found' });
        }
    },
}));
