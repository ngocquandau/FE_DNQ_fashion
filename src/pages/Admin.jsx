// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import '../styles/Admin.css';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', image_url: '' });
    const [editProduct, setEditProduct] = useState(null);

    const fetchOrders = async () => {
        if (!user || !user.id) {
            setError('Không tìm thấy thông tin người dùng.');
            setLoading(false);
            return;
        }

        try {
            console.log('Fetching orders with user_id:', user.id); // Log để kiểm tra
            const response = await axios.get(`https://be-dnq-fashion.vercel.app/api/orders?user_id=${user.id}`);
            console.log('Orders response:', response.data); // Log để kiểm tra dữ liệu trả về
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err.response?.data);
            setError(err.response?.data?.message || 'Không thể tải đơn hàng. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            console.log('Fetching products'); // Log để kiểm tra
            const response = await axios.get('https://be-dnq-fashion.vercel.app/api/products');
            console.log('Products response:', response.data); // Log để kiểm tra dữ liệu trả về
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err.response?.data);
            setError(err.response?.data?.message || 'Không thể tải sản phẩm. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId) => {
        try {
            await axios.put(`https://be-dnq-fashion.vercel.app/api/orders/${orderId}/status`, {
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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://be-dnq-fashion.vercel.app/api/products', {
                ...newProduct,
                user_id: user.id,
            });
            setProducts([...products, { ...newProduct, id: response.data.productId }]);
            setNewProduct({ name: '', price: '', image_url: '' });
        } catch (err) {
            console.error('Error adding product:', err.response?.data);
            setError(err.response?.data?.message || 'Thêm sản phẩm thất bại. Vui lòng thử lại.');
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://be-dnq-fashion.vercel.app/api/products/${editProduct.id}`, {
                ...editProduct,
                user_id: user.id,
            });
            setProducts(
                products.map((product) =>
                    product.id === editProduct.id ? editProduct : product
                )
            );
            setEditProduct(null);
        } catch (err) {
            console.error('Error updating product:', err.response?.data);
            setError(err.response?.data?.message || 'Cập nhật sản phẩm thất bại. Vui lòng thử lại.');
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`https://be-dnq-fashion.vercel.app/api/products/${productId}`, {
                data: { user_id: user.id },
            });
            setProducts(products.filter((product) => product.id !== productId));
        } catch (err) {
            console.error('Error deleting product:', err.response?.data);
            setError(err.response?.data?.message || 'Xóa sản phẩm thất bại. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'admin') {
            setError('Chỉ admin mới có quyền truy cập.');
            navigate('/');
            return;
        }

        if (tab === 'orders') {
            fetchOrders();
        } else {
            fetchProducts();
        }
    }, [user, navigate, tab]);

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
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Trang Quản Trị</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setTab('orders')}
                            className={`px-4 py-2 mr-2 rounded-lg ${
                                tab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Quản lý đơn hàng
                        </button>
                        <button
                            onClick={() => setTab('products')}
                            className={`px-4 py-2 rounded-lg ${
                                tab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Quản lý sản phẩm
                        </button>
                    </div>

                    {tab === 'orders' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h2>
                            {orders.length === 0 ? (
                                <p className="text-center text-gray-600">Chưa có đơn hàng nào.</p>
                            ) : (
                                orders.map((order, index) => (
                                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold">Đơn hàng #{index + 1} (ID: {order.id})</h3>
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
                                        <p className="text-gray-600">Người đặt: {order.username}</p>
                                        <p className="text-gray-600">
                                            Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
                                        </p>
                                        <p className="text-gray-600">Người nhận: {order.receiver_name}</p>
                                        <p className="text-gray-600">Địa chỉ: {order.address}</p>
                                        <p className="text-gray-600">Số điện thoại: {order.phone_number}</p>
                                        <div className="mt-4">
                                            <h4 className="text-lg font-semibold">Sản phẩm:</h4>
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
                                                        <h5 className="text-md font-semibold">{item.name}</h5>
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
                                                onClick={() => handleUpdateStatus(order.id)}
                                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                            >
                                                Xác nhận đã giao hàng
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {tab === 'products' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h3>
                                <form onSubmit={handleAddProduct}>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-gray-700 mb-2">
                                            Tên sản phẩm
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={newProduct.name}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, name: e.target.value })
                                            }
                                            className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-gray-700 mb-2">
                                            Giá (VND)
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={newProduct.price}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, price: e.target.value })
                                            }
                                            className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="image_url" className="block text-gray-700 mb-2">
                                            URL ảnh
                                        </label>
                                        <input
                                            type="text"
                                            id="image_url"
                                            value={newProduct.image_url}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, image_url: e.target.value })
                                            }
                                            className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                                    >
                                        Thêm sản phẩm
                                    </button>
                                </form>
                            </div>

                            {products.length === 0 ? (
                                <p className="text-center text-gray-600">Chưa có sản phẩm nào.</p>
                            ) : (
                                products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                                        {editProduct && editProduct.id === product.id ? (
                                            <form onSubmit={handleEditProduct}>
                                                <div className="mb-4">
                                                    <label htmlFor="edit_name" className="block text-gray-700 mb-2">
                                                        Tên sản phẩm
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="edit_name"
                                                        value={editProduct.name}
                                                        onChange={(e) =>
                                                            setEditProduct({ ...editProduct, name: e.target.value })
                                                        }
                                                        className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="edit_price" className="block text-gray-700 mb-2">
                                                        Giá (VND)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="edit_price"
                                                        value={editProduct.price}
                                                        onChange={(e) =>
                                                            setEditProduct({ ...editProduct, price: e.target.value })
                                                        }
                                                        className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="edit_image_url" className="block text-gray-700 mb-2">
                                                        URL ảnh
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="edit_image_url"
                                                        value={editProduct.image_url}
                                                        onChange={(e) =>
                                                            setEditProduct({
                                                                ...editProduct,
                                                                image_url: e.target.value,
                                                            })
                                                        }
                                                        className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="submit"
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditProduct(null)}
                                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex items-center">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded mr-4"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                                    <p className="text-gray-600">
                                                        Giá: {product.price.toLocaleString('vi-VN')} VND
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setEditProduct(product)}
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Admin;