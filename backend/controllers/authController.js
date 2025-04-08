import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';
import { sendToken } from '../utils/sendToken.js';
import { getCityFromCoords } from '../utils/geolocation.js';
import TravelPackage from '../models/Package.js';

dotenv.config();

// 📌 Register a new CUSTOMER
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, latitude, longitude } = req.body;

    if (!name || !email || !password || !latitude || !longitude) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const city = await getCityFromCoords(latitude, longitude);
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword, role: 'customer', city });
    await user.save();

    sendToken(user, res, 201, 'Customer registration successful');
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 📌 Register a new AGENT
export const registerAgent = async (req, res) => {
  try {
    const { name, email, password, latitude, longitude } = req.body;

    if (!name || !email || !password || !latitude || !longitude) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const city = await getCityFromCoords(latitude, longitude);
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword, role: 'agent', city });
    await user.save();

    sendToken(user, res, 201, 'Agent registration successful');
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 📌 Login & Update City if Changed
export const login = async (req, res) => {
  try {
    const { email, password, latitude, longitude } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const newCity = await getCityFromCoords(latitude, longitude);
    if (newCity && user.city !== newCity) {
      user.city = newCity;
      await user.save();
    }

    sendToken(user, res, 200, 'Login successful');
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
  
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const customerDashboard =  async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const allPackages = await TravelPackage.find().populate('agentId', 'name city');

    const cityPackages = allPackages.filter(
      pkg => pkg.agentId && pkg.agentId.city === req.user.city
    );

    res.json(cityPackages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dashboard for Agents - Show packages they have created
export const agentDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const packages = await TravelPackage.find({ agentId: req.user._id });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
