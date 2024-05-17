// client/src/components/SignUp.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faExclamationCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error when input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:8000/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        // Reset form data
        setFormData({
          email: '',
          password: '',
          confirmPassword: ''
        });

        // Navigate to Home page
        navigate(`/men?email=${formData.email}`);

      } catch (error) {
        console.error('Signup failed:', error.message);
        setErrors({ email: error.message }); // Set error message for email field
      }
    } else {
      // Form is invalid, display errors
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
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className='all'>
      <div className="signup-container">
      <h2 onClick={reloadPage}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /> Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required/>
          {errors.email && <span className="error"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password"><FontAwesomeIcon icon={faLock} /> Password:</label>
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required/>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="input-icon" onClick={togglePasswordVisibility} />
          {errors.password && <span className="error"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FontAwesomeIcon icon={faLock} className='confirmlock'/> Confirm Password:</label>
            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required/>
            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} className="input-icon" onClick={toggleConfirmPasswordVisibility} />
          {errors.confirmPassword && <span className="error"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.confirmPassword}</span>}
        </div>
        <button type="submit"><FontAwesomeIcon/> Sign Up</button>
      </form>
      <div className="signin-link">
        Already a user? <a href="/signin">Sign In</a>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
