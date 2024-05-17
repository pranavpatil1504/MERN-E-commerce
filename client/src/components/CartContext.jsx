// client/src/components/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [addedToCart, setAddedToCart] = useState([]);
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        if (userEmail) {
            const savedCart = localStorage.getItem(`cartItems_${userEmail}`);
            const savedAddedToCart = localStorage.getItem(`addedToCart_${userEmail}`);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
            setAddedToCart(savedAddedToCart ? JSON.parse(savedAddedToCart) : []);
        }
    }, [userEmail]);

    useEffect(() => {
        if (userEmail) {
            localStorage.setItem(`cartItems_${userEmail}`, JSON.stringify(cartItems));
            localStorage.setItem(`addedToCart_${userEmail}`, JSON.stringify(addedToCart));
        }
    }, [cartItems, addedToCart, userEmail]);

    const addItemToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addedToCart, setAddedToCart, addItemToCart }}>
            {children}
        </CartContext.Provider>
    );
};
