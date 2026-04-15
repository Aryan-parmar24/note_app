import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const authContext = createContext();

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage when app starts
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        //heck if savedUser exists and is not null before parsing
        if (savedUser && savedUser !== 'undefined') {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.log("Error parsing user data:", error);
                localStorage.removeItem('user'); // Clear invalid data
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    const login = (userData, token) => {
        console.log("Login called with:", userData, token);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
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
                    // Also save user to localStorage
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                } else {
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {  
                console.log("Verification error:", error);
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        };
        verifyUser();
    }, []);

    return (
        <authContext.Provider value={{ user, login, logout }}>
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => useContext(authContext);

export default ContextProvider;