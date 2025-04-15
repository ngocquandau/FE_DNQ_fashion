// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import '../styles/Orders.css';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        if (!user) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${user.id}`);
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err.response?.data);
            setError(err.response?.data?.message || 'Không thể tải đơn hàng. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const handleReceived = async (orderId) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
                status: 'Đã nhận hàng',
            });
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? { ...order, status: 'Đã nhận hàng' } : order
                )
            );
        } catch (err) {
            console.error('Error updating order status:', err.response?.data);
            setError(err.response?.data?.message || 'Cập nhật trạng thái thất bại. Vui lòng thử lại.');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-5">
                    <p className="text-red-500">Vui lòng đăng nhập để xem đơn hàng.</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-5">
                    <p className="text-gray-600">Đang tải...</p>
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đơn hàng của bạn</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {orders.length === 0 ? (
                        <p className="text-center text-gray-600">Bạn chưa có đơn hàng nào.</p>
                    ) : (
                        orders.map((order, index) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Đơn hàng #{index + 1}</h2>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            order.status === 'Đang giao hàng'
                                                ? 'bg-yellow-200 text-yellow-800'
                                                : 'bg-green-200 text-green-800'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-gray-600">
                                    Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
                                </p>
                                <p className="text-gray-600">Người nhận: {order.receiver_name}</p>
                                <p className="text-gray-600">Địa chỉ: {order.address}</p>
                                <p className="text-gray-600">Số điện thoại: {order.phone_number}</p>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Sản phẩm:</h3>
                                    {order.items.map((item) => (
                                        <div
                                            key={item.product_id}
                                            className="flex items-center border-b py-4 last:border-b-0"
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded mr-4"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-md font-semibold">{item.name}</h4>
                                                <p className="text-gray-600">
                                                    {item.price.toLocaleString('vi-VN')} VND x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-lg font-bold mt-4">
                                    Tổng cộng: {order.total_amount.toLocaleString('vi-VN')} VND
                                </p>
                                {order.status === 'Đang giao hàng' && (
                                    <button
                                        onClick={() => handleReceived(order.id)}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Tôi đã nhận hàng
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Orders;