// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart } from 'react-icons/fa'; // Biểu tượng giỏ hàng
import '../styles/Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { getCartCount } = useCart();

    useEffect(() => {
        axios.get('https://be-dnq-fashion.vercel.app/api/products')
            .then(res => {
                setProducts(res.data);
                setFilteredProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    if (loading) return <div className="text-center text-xl mt-10">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow p-5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Danh sách sản phẩm</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border rounded-lg py-2 px-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <Link to="/cart" className="relative">
                                <FaShoppingCart className="text-2xl text-gray-800 hover:text-blue-500 transition-colors duration-300" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="text-center text-gray-600 col-span-full">Không tìm thấy sản phẩm nào.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Products;