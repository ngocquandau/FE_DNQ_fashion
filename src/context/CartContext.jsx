// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useAuth();

    const fetchCart = async () => {
        if (!user) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
            setCart(response.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (product) => {
        if (!user) {
            console.error('User must be logged in to add to cart');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/cart/`, {
                user_id: user.id,
                product_id: product.id,
                quantity: 1,
            });
            console.log('Add to cart response:', response.data);
            fetchCart();
        } catch (err) {
            console.error('Error adding to cart:', err.response?.data);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (!user) {
            console.error('User must be logged in to update cart');
            return;
        }

        if (newQuantity < 1) {
            console.error('Quantity must be greater than 0');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/cart/${user.id}/${productId}`,
                { quantity: newQuantity }
            );
            console.log('Update quantity response:', response.data);
            setCart(
                cart.map((item) =>
                    item.product_id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (err) {
            console.error('Error updating quantity:', err.response?.data);
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) {
            console.error('User must be logged in to remove from cart');
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/cart/${user.id}/${productId}`
            );
            console.log('Remove from cart response:', response.data);
            setCart(cart.filter((item) => item.product_id !== productId));
        } catch (err) {
            console.error('Error removing from cart:', err.response?.data);
        }
    };

    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{ cart, setCart, addToCart, updateQuantity, removeFromCart, getCartCount }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);