import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Checkout.css';

const Checkout = () => {
    const { user } = useAuth();
    const { cart, setCart } = useCart();
    const navigate = useNavigate();
    const [receiverName, setReceiverName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!receiverName || !address || !phoneNumber) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/orders', {
                user_id: user.id,
                receiver_name: receiverName,
                address,
                phone_number: phoneNumber,
                total_amount: totalPrice,
                items: cart,
            });
            console.log('Order created:', response.data);
            setCart([]);
            navigate('/orders');
        } catch (err) {
            console.error('Error creating order:', err.response?.data);
            setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
        }
    };

    if (!user) {
        return (
            <div className="container">
                <Header />
                <main className="main-content">
                    <p className="error-text">Vui lòng đăng nhập để thanh toán.</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container">
                <Header />
                <main className="main-content">
                    <p className="empty-text">Giỏ hàng của bạn đang trống.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <div className="content-wrapper">
                    <h1 className="page-title">Thanh toán</h1>
                    {error && <p className="error-text">{error}</p>}
                    <div className="checkout-grid">
                        {/* Thông tin giao hàng */}
                        <div className="delivery-form">
                            <h2 className="section-title">Thông tin giao hàng</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="receiverName" className="form-label">
                                        Tên người nhận
                                    </label>
                                    <input
                                        type="text"
                                        id="receiverName"
                                        value={receiverName}
                                        onChange={(e) => setReceiverName(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address" className="form-label">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber" className="form-label">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <button type="submit" className="confirm-button">
                                    Xác nhận
                                </button>
                            </form>
                        </div>
                        {/* Thông tin đơn hàng */}
                        <div className="order-summary">
                            <h2 className="section-title">Thông tin đơn hàng</h2>
                            {cart.map((item) => (
                                <div key={item.id} className="order-item">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="item-image"
                                    />
                                    <div className="item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-price">
                                            {item.price.toLocaleString('vi-VN')} VND x {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="order-total">
                                <h3 className="total-text">
                                    Tổng cộng: {totalPrice.toLocaleString('vi-VN')} VND
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;