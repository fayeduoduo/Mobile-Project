import express from 'express';
import { authUser, delteUser, getUserById, getUserProfile, getUsers, registerUser, updateUser, updateUserProfile } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

//create new user
router.route('/').post(registerUser).get(protect, admin, getUsers);

//router.route('/login').post(authUser)
router.post('/login', authUser)

//route can change route place
//protect to auth login authoruzation
//put() -> edit user info root
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

//delete/edit user
router.route('/:id').delete(protect, admin, delteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)

export default router;