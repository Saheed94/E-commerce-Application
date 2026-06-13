const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {
  generateToken
} = require('../services/tokenService');

const {
  getRedisClient
} = require('../config/redis');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email and password required'
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message:
        'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token =
      generateToken(user._id);

    const redis =
      getRedisClient();

    await redis.set(
      `session:${user._id}`,
      JSON.stringify({
        userId: user._id,
        email: user.email,
        loginTime:
          new Date().toISOString()
      }),
      'EX',
      86400
    );

    res.json({
      success: true,
      message:
        'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Profile
const profile = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.user.userId
      ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Could not fetch profile'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const redis =
      getRedisClient();

    await redis.del(
      `session:${req.user.userId}`
    );

    res.json({
      success: true,
      message:
        'Logout successful'
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = {
  register,
  login,
  profile,
  logout
};