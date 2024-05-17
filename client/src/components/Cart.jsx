// client/src/components/Cart.jsx
import React, { useContext, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { NavLink, useNavigate , useLocation} from 'react-router-dom';
import { CartContext } from './CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import './men.css';

const Cart = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userEmail = queryParams.get('email');
    const { cartItems, setCartItems, addedToCart, setAddedToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const calculateTotalAmount = () => {
        return cartItems.reduce((total, product) => {
            const price = parseFloat(product.price.slice(1)); // Assuming price is in the format "₹100"
            return total + price;
        }, 0).toFixed(2);
    };

    const handleRemoveFromCart = (productIndex) => {
        const updatedCartItems = cartItems.filter((_, index) => index !== productIndex);
        setCartItems(updatedCartItems);
        const updatedAddedToCart = [...addedToCart];
        updatedAddedToCart[productIndex] = false;
        setAddedToCart(updatedAddedToCart);
    };

    const handleCartClick = () => {
        navigate(`/cart?email=${formData.email}`);
    };
    const [formData] = useState({
        userEmail: '',
        password: ''
    });

    return (
        <div className="home">
            <nav>
                <img className='logo' src="https://www.pingrow.in/uploads/admin/product/unnamed_1594364636.jpg" alt="logo" />
                <ul>
                    <li><NavLink exact activeClassName="active" className='men' to={`/men?email=${formData.email}`}>MEN</NavLink></li>
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
            </nav>
            <div className="cart-container">
                <h2>Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p className='no'>Your cart is empty.</p>
                ) : (
                    <>
                        <div className="total-amount">
                            <Typography variant="h5">
                                Total Amount: ₹{calculateTotalAmount()}
                            </Typography>
                        </div>
                        {cartItems.map((product, index) => (
                            <Card key={index} sx={{ display: 'flex', mb: 2 }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 150 }}
                                    image={product.image}
                                    alt={product.name}
                                />
                                <CardContent>
                                    <Typography variant="h5">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {product.description.join(', ')}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Price: {product.price}</strong>
                                    </Typography>
                                    <Button onClick={() => handleRemoveFromCart(index)}>Remove from Cart</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;