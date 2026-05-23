import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        localStorage.removeItem('adminToken');
                        setAdmin(null);
                    } else {
                        await fetchAdmin();
                    }
                } catch (err) {
                    localStorage.removeItem('adminToken');
                    setAdmin(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await axios.get('/api/auth/user', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            if (res.data.role !== 'Admin') throw new Error("Not an admin");
            setAdmin(res.data);
        } catch (err) {
            localStorage.removeItem('adminToken');
            setAdmin(null);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        if (res.data.user.role !== 'Admin') throw new Error("Access denied: Not an Admin");
        localStorage.setItem('adminToken', res.data.token);
        setAdmin(res.data.user);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AuthContext);
