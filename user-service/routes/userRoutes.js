const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');
const {
  validate,
  registerRules,
  loginRules,
  updateProfileRules,
  changePasswordRules
} = require('../middleware/validation');

// Public routes
router.post('/register', validate(registerRules), userController.register);
router.post('/login', validate(loginRules), userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/refresh-token', userController.refreshToken);
router.get('/verify-email/:token', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerification);

// Protected routes (require authentication)
router.get('/me', auth, userController.getProfile);
router.put('/me', auth, validate(updateProfileRules), userController.updateProfile);
router.post('/change-password', auth, validate(changePasswordRules), userController.changePassword);
router.get('/me/stats', auth, userController.getUserStats);
router.post('/logout', auth, userController.logout);
router.delete('/me', auth, userController.deleteAccount);

// Admin routes
router.get('/all', adminAuth, userController.getAllUsers);
router.get('/:id', adminAuth, userController.getUserById);

module.exports = router;