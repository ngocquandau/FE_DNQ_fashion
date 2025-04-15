import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';
import logo from '../assets/avt.jpg';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <img src={logo} alt="Đ.N.Q fashion" className="logo-image" />
                    Đ.N.Q fashion
                </Link>
                <nav className="header-nav">
                    <Link to="/" className="nav-link">Trang chủ</Link>
                    <Link to="/products" className="nav-link">Sản phẩm</Link>
                    <Link to="/cart" className="nav-link">Giỏ hàng</Link>
                    {user ? (
                        <>
                            <Link to="/orders" className="nav-link">Đơn hàng</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-link">Quản trị</Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">Đăng nhập</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;