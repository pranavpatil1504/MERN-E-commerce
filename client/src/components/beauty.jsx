// client/src/components/beauty.jsx

import './men.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { CartContext } from './CartContext';
import beauty from './data/beautydata';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 22,
    p: 4,
    borderRadius: 5,
};

const Beauty = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [priceDetails, setPriceDetails] = useState({ basePrice: 0, cgst: 0, sgst: 0, totalPrice: 0 });
    const { cartItems, setCartItems, addedToCart, setAddedToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        setAddedToCart(beauty.map(product => cartItems.some(cartItem => cartItem.id === product.id)));
    }, [cartItems, setAddedToCart]);

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const calculateTotalPrice = (price) => {
        const basePrice = parseFloat(price.slice(1)); // Remove the '₹' symbol and convert to number
        const cgst = basePrice * 0.05; // CGST 5%
        const sgst = basePrice * 0.05; // SGST 5%
        const totalPrice = basePrice + cgst + sgst; // Total price including taxes
        return { basePrice, cgst, sgst, totalPrice };
    };

    const handleBuyNow = (product) => {
        const priceDetails = calculateTotalPrice(product.price);
        setSelectedProduct(product);
        setPriceDetails(priceDetails);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOrderModalOpen(false);
    };

    const handleOrderNow = () => {
        setOpen(false);
        setOrderModalOpen(true);
    };

    const handleOrderClose = () => {
        setOrderModalOpen(false);
    };

    const handleAddToCart = (product, index) => {
        const updatedAddedToCart = [...addedToCart];
        updatedAddedToCart[index] = true; // Mark product as added to cart
        setAddedToCart(updatedAddedToCart); // Update state
        setCartItems([...cartItems, product]); // Add product to cart
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    const filteredProducts = beauty.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.some(desc => desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.price.includes(searchQuery)
    );

    // Calculate delivery date as one day after the current date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const deliveryDateString = deliveryDate.toLocaleDateString('en-GB');
    const deliveryTimeString = deliveryDate.toLocaleTimeString();

    return (
        <div className="home">
            <nav>
                <img className='logo' src="https://www.pingrow.in/uploads/admin/product/unnamed_1594364636.jpg" alt="logo" />
                <ul>
                    <li><NavLink exact activeClassName="active" className='men' to="/men">MEN</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='women' to="/women">WOMEN</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='kids' to="/kids">KIDS</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='homeliving' to="/home&living">HOME & LIVING</NavLink></li>
                    <li><NavLink exact activeClassName="active" className='beauty' to="/beauty">BEAUTY</NavLink></li>
                    <li>
                        <IconButton aria-label="cart" color="inherit" onClick={handleCartClick}>
                            <ShoppingCartIcon />
                            <span>{cartItems.length}</span>
                        </IconButton>
                    </li>
                </ul>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleChange}
                    />
                </div>
            </nav>
            <div className='main'>
            {filteredProducts.map((product, index) => (
                    <Card key={product.id} sx={{ width: 350, borderRadius: 3 }}>
                        <CardMedia
                            sx={{ height: 450 }}
                            image={product.image}
                            title={product.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <ul>
                                    {product.description.map((desc, index) => (
                                        <li key={index}>{desc}</li>
                                    ))}
                                </ul>
                                <div>
                                    <strong>Price: {product.price}</strong>
                                </div>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => handleBuyNow(product)}>Buy Now</Button>
                            <Button 
                                size="small" 
                                onClick={() => handleAddToCart(product, index)} 
                                disabled={addedToCart[index]}
                            >
                                {addedToCart[index] ? 'Added to Cart' : 'Add to Cart'}
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {selectedProduct?.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Base Price: ₹{priceDetails.basePrice.toFixed(2)}<br />
                        CGST (5%): ₹{priceDetails.cgst.toFixed(2)}<br />
                        SGST (5%): ₹{priceDetails.sgst.toFixed(2)}<br />
                        <strong>Total Price: ₹{priceDetails.totalPrice.toFixed(2)}</strong>
                    </Typography>
                    <Button onClick={handleOrderNow} sx={{ mt: 2 }}>Order Now</Button>
                    <Button onClick={handleClose} sx={{ mt: 2, ml: 2 }}>Close</Button>
                </Box>
            </Modal>
            <Modal
                open={orderModalOpen}
                onClose={handleOrderClose}
                aria-labelledby="order-modal-title"
                aria-describedby="order-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="order-modal-title" variant="h6" component="h2">
                        <span style={{ color: 'green' }}>Order Placed Successfully!!</span>
                    </Typography>
                    <Typography id="order-modal-description" sx={{ mt: 2 }}>
                        Your order will be delivered on {deliveryDateString} at {deliveryTimeString}.
                    </Typography>
                    <Button onClick={handleOrderClose} sx={{ mt: 2 }}>Close</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Beauty;
