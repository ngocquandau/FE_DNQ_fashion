// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Khôi phục trạng thái user từ localStorage khi ứng dụng khởi động
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        // Lưu user vào state và localStorage
        const user = { id: userData.id, username: userData.username, role: userData.role };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        // Xóa user khỏi state và localStorage
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);