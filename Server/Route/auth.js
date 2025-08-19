import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Model/user.model.js';
import { authenticateToken } from '../Middleware/auth.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      userName,
      phoneNumber,
      email,
      password,
      geometry,
      isAdmin = false
    } = req.body;

    console.log('Signup attempt:', { name, userName, email, phoneNumber });

    // Validation
    if (!name || !userName || !phoneNumber || !email || !password) {
      return res.status(400).json({
        message: 'All fields (name, userName, phoneNumber, email, password) are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    // Phone number validation
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        message: 'Phone number must be exactly 10 digits'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { userName: userName },
        { email: email },
        { phoneNumber: phoneNumber }
      ]
    });

    if (existingUser) {
      let conflictField = '';
      if (existingUser.userName === userName) conflictField = 'username';
      else if (existingUser.email === email) conflictField = 'email';
      else if (existingUser.phoneNumber === phoneNumber) conflictField = 'phone number';
      
      return res.status(400).json({
        message: `User already exists with this ${conflictField}`
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name: name.trim(),
      userName: userName.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      geometry: geometry || {
        type: 'Point',
        coordinates: [77.2090, 28.6139] // Default Delhi coordinates
      },
      isAdmin
    });

    const savedUser = await user.save();
    console.log('User created successfully:', savedUser._id);

    // Generate JWT
    const token = jwt.sign(
      { 
        id: savedUser._id, 
        userName: savedUser.userName,
        isAdmin: savedUser.isAdmin 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        userName: savedUser.userName,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
        isAdmin: savedUser.isAdmin,
        geometry: savedUser.geometry
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const fieldName = field === 'userName' ? 'username' : 
                       field === 'phoneNumber' ? 'phone number' : field;
      return res.status(400).json({
        message: `User already exists with this ${fieldName}`
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;

    console.log('Login attempt:', { userName });

    if (!userName || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Demo accounts - check first
    const demoAccounts = {
      'admin': { 
        password: 'admin123', 
        user: {
          id: 'admin-demo-id',
          name: 'Admin Demo',
          userName: 'admin',
          email: 'admin@demo.com',
          phoneNumber: '9999999999',
          isAdmin: true,
          geometry: {
            type: 'Point',
            coordinates: [77.2090, 28.6139]
          }
        }
      },
      'user': { 
        password: 'user123',
        user: {
          id: 'user-demo-id',
          name: 'User Demo',
          userName: 'user',
          email: 'user@demo.com',
          phoneNumber: '8888888888',
          isAdmin: false,
          geometry: {
            type: 'Point',
            coordinates: [77.2090, 28.6139]
          }
        }
      }
    };

    // Check for demo account first
    if (demoAccounts[userName.toLowerCase()]) {
      const demoAccount = demoAccounts[userName.toLowerCase()];
      
      if (demoAccount.password === password) {
        const token = jwt.sign(
          { 
            id: demoAccount.user.id, 
            userName: demoAccount.user.userName,
            isAdmin: demoAccount.user.isAdmin 
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        console.log('Demo login successful:', userName);

        return res.json({
          message: 'Demo login successful',
          token,
          user: demoAccount.user
        });
      }
    }

    // Regular user login
    const user = await User.findOne({ 
      userName: userName.toLowerCase() 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        userName: user.userName,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('Login successful:', user.userName);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        geometry: user.geometry
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token route
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    console.log('Token verification for user:', req.user.id);

    // For demo accounts
    if (req.user.id === 'admin-demo-id' || req.user.id === 'user-demo-id') {
      const demoUser = {
        id: req.user.id,
        name: req.user.id === 'admin-demo-id' ? 'Admin Demo' : 'User Demo',
        userName: req.user.userName,
        email: `${req.user.userName}@demo.com`,
        phoneNumber: req.user.id === 'admin-demo-id' ? '9999999999' : '8888888888',
        isAdmin: req.user.isAdmin,
        geometry: {
          type: 'Point',
          coordinates: [77.2090, 28.6139]
        }
      };

      return res.json({
        message: 'Token valid',
        user: demoUser
      });
    }

    // Regular user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    res.json({
      message: 'Token valid',
      user: {
        id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        geometry: user.geometry
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

export { router as authRouter };
