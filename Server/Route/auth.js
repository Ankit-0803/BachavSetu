import express from 'express';
import User from '../Model/user.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { userName, password } = req.body;
  
  console.log('Login attempt:', { userName, password }); // Debug log
  
  try {
    // Find user by userName (not email)
    const user = await User.findOne({ userName });
    console.log('User found:', user ? 'Yes' : 'No'); // Debug log
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Use the matchPassword method from your User model
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch); // Debug log
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        userName: user.userName,
        isAdmin: user.isAdmin,
        geometry: user.geometry,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error); // Debug log
    next(error);
  }
});

export { router as authRouter };
