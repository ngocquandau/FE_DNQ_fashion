// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Thêm useAuth
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();
    const { user } = useAuth(); // Lấy user từ AuthContext
    const navigate = useNavigate(); // Để chuyển hướng

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log(`Fetching product with id: ${id}`);
                const response = await axios.get(`https://be-dnq-fashion.vercel.app/api/products/${id}`);
                console.log('Product response:', response.data);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err.response?.data);
                setError(err.response?.data?.message || 'Lỗi khi tải sản phẩm. Vui lòng thử lại.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        // Kiểm tra trạng thái đăng nhập
        if (!user) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
            return;
        }

        if (product) {
            addToCart(product);
            alert(`${product.name} đã được thêm vào giỏ hàng!`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-5">
                    <p className="text-center text-xl text-gray-600">Đang tải...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-5">
                    <div className="text-center">
                        <p className="text-xl text-red-500">{error || 'Sản phẩm không tồn tại'}</p>
                        <Link
                            to="/products"
                            className="mt-4 inline-block bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                        >
                            Quay lại danh sách sản phẩm
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow p-5">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row gap-6">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full md:w-1/2 h-64 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-lg text-gray-600 mb-4">{product.price.toLocaleString('vi-VN')} VND</p>
                            <p className="text-gray-700 mb-4">{product.description || 'Mô tả sản phẩm sẽ được cập nhật.'}</p>
                            <p className="text-gray-700 mb-4">Số lượng còn lại: {product.stock}</p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Thêm vào giỏ hàng
                                </button>
                                <Link
                                    to="/products"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                                >
                                    Quay lại
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;