// Import necessary modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Create a schema and model for cart items
const cartItemSchema = new mongoose.Schema({
    name: String,
    description: [String],
    price: String,
    userEmail: String, // Add userEmail field
    // Add more fields as needed
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// Password hashing function
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
    return await bcrypt.hash(password, salt);
};

// Express app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// Signup route
app.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Send success response (without password)
        res.status(201).json({ message: 'User created successfully', user: newUser.toObject({ virtuals: true }) });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Signin route
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Retrieve cart items for the user from MongoDB
        const cartItems = await CartItem.find({ userEmail: email });

        // Send success response with userEmail and cartItems
        res.json({ message: 'Signin successful', userEmail: email, cartItems });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



// Route to handle adding items to the cart
app.post( '/cart', async (req, res) => {
    try {
        const { image, name, description, price } = req.body;
        const userEmail = req.body.userEmail; // Extract userEmail from the request body

        // Create a new cart item with userEmail
        const newCartItem = new CartItem({
            image,
            name,
            description,
            price,
            userEmail, // Assign userEmail to the cart item
            // Add more fields as needed
        });

        // Save the cart item to the database
        await newCartItem.save();

        res.status(201).json({ message: 'Cart item added successfully' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
