import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const authContext = createContext();

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isSessionExpired = () => {
        const loginTime = localStorage.getItem('loginTime');
        if (!loginTime) return true;
        const now = new Date().getTime();
        return (now - parseInt(loginTime)) > SESSION_DURATION;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
    };

    const login = (userData, token) => {
        console.log("Login called with:", userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
        localStorage.setItem('loginTime', new Date().getTime().toString());
    };

    // Load user from localStorage when app starts
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && savedUser !== 'undefined' && token) {
            if (isSessionExpired()) {
                console.log("Session expired - logging out");
                logout();
                setLoading(false);
                return;
            }

            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.log("Error parsing user data:", error);
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    // Auto logout timer
    useEffect(() => {
        if (!user) return;

        const loginTime = localStorage.getItem('loginTime');
        if (!loginTime) return;

        const now = new Date().getTime();
        const remaining = SESSION_DURATION - (now - parseInt(loginTime));

        if (remaining <= 0) {
            logout();
            window.location.href = '/login';
            return;
        }

        const timer = setTimeout(() => {
            console.log("Session expired - auto logout");
            logout();
            window.location.href = '/login';
        }, remaining);

        return () => clearTimeout(timer);
    }, [user]);

    // Verify token with backend
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (!token || isSessionExpired()) {
                if (isSessionExpired()) logout();
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/api/auth/verify`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.success) {
                    setUser(res.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                } else {
                    logout();
                }
            } catch (error) {
                console.log("Verification error:", error);
                logout();
            }
        };
        verifyUser();
    }, []);

    return (
        <authContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);

export default ContextProvider;