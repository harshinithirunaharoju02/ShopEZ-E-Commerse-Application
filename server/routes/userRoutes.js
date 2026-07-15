import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for register (POST) and getting all users (GET)
router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

// Route for login
router.post('/login', authUser);

// Route for profile access (GET & PUT)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
