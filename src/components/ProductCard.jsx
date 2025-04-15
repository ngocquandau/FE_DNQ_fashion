// src/components/ProductCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        <div className="border rounded-lg p-4 shadow-md text-center">
            <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded mb-4" />
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.price.toLocaleString('vi-VN')} VND</p>
            <div className="flex justify-center gap-3">
                <button
                    onClick={handleAddToCart}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    Thêm vào giỏ
                </button>
                <Link
                    to={`/products/${product.id}`}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;