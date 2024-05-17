// client/src/components/SignIn.jsx
import React, { useState, useContext } from 'react';
import './SignUp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

const SignIn = () => {
  const { setCartItems } = useContext(CartContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:8000/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        if (responseData.cartItems) {
          setCartItems(responseData.cartItems);
        }

        setFormData({ email: '', password: '' });
        // Pass the email as a query parameter to the Men page
        navigate(`/men?email=${formData.email}`);
        console.log('Sign in successful');
      } catch (error) {
        console.error('Signin failed:', error.message);
        setErrors({ email: error.message });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }
    if (!data.password.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    return errors;
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className='all'>
      <div className="signup-container">
        <h2 onClick={reloadPage}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <span className="error"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} /> Password </label>
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required />
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="input-icon" onClick={togglePasswordVisibility} />
            {errors.password && <span className="error"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.password}</span>}
          </div>
          <button type="submit"><FontAwesomeIcon/> Sign In</button>
        </form>
        <div className="signup-link">
          Don't have an account? <a href="/">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
