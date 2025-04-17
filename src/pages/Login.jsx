// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            // Đăng nhập
            console.log('Login data:', { username, password, role });
            try {
                const response = await axios.post('https://be-dnq-fashion.vercel.app/api/users/login', {
                    username,
                    password,
                    role,
                });
                console.log('Login response:', response.data);
                const userData = response.data; // userData sẽ chứa { id, username, role }
                login(userData); // Lưu id, username, role vào AuthContext
                navigate('/'); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
            } catch (err) {
                console.error('Login error:', err.response?.data);
                setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } else {
            // Đăng ký
            console.log('Register data:', { username, email, password });
            try {
                const response = await axios.post('https://be-dnq-fashion.vercel.app/api/users/register', {
                    username,
                    email,
                    password,
                });
                console.log('Register response:', response.data);
                setIsLogin(true);
                setError('Đăng ký thành công! Vui lòng đăng nhập.');
            } catch (err) {
                console.error('Register error:', err.response?.data);
                setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center p-5">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </h2>
                    {error && (
                        <p className="text-red-500 text-center mb-4">{error}</p>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        {!isLogin && (
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        {isLogin && (
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Vai trò</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="user"
                                            checked={role === 'user'}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="mr-2"
                                        />
                                        Người dùng
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="admin"
                                            checked={role === 'admin'}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="mr-2"
                                        />
                                        Quản trị viên
                                    </label>
                                </div>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-blue-500 hover:underline"
                        >
                            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
                        </button>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;