// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Cart.css';

const Cart = () => {
    const { user } = useAuth();
    const { cart, updateQuantity, removeFromCart } = useCart();
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Thêm navigate để chuyển hướng

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (!user) {
            setError('Vui lòng đăng nhập để thanh toán.');
            return;
        }
        navigate('/checkout'); // Chuyển hướng đến trang Thanh toán
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-5">
                    <p className="text-red-500">Vui lòng đăng nhập để xem giỏ hàng.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow p-5">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Giỏ hàng của bạn</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {cart.length === 0 ? (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
                            <Link
                                to="/products"
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center border-b py-4 last:border-b-0"
                                    >
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-24 h-24 object-cover rounded mr-4"
                                                onError={(e) => {
                                                    console.error(`Failed to load image: ${item.image_url}`);
                                                    e.target.src = '/images/fallback.jpg';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded mr-4">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold">{item.name}</h2>
                                            <p className="text-gray-600">
                                                Đơn giá: {item.price.toLocaleString('vi-VN')} VND
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product_id, item.quantity - 1)
                                                    }
                                                    className="bg-gray-300 text-black px-2 py-1 rounded-l hover:bg-gray-400"
                                                >
                                                    -
                                                </button>
                                                <span className="border px-4 py-1">{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product_id, item.quantity + 1)
                                                    }
                                                    className="bg-gray-300 text-black px-2 py-1 rounded-r hover:bg-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-gray-800 font-semibold mt-2">
                                                Tổng: {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Tổng giá trị đơn hàng: {totalPrice.toLocaleString('vi-VN')} VND
                                </h2>
                                <div className="flex justify-between items-center">
                                    <Link
                                        to="/products"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Tiếp tục mua sắm
                                    </Link>
                                    <button
                                        onClick={handleCheckout} // Thêm sự kiện chuyển hướng
                                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                                    >
                                        Thanh toán
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cart;