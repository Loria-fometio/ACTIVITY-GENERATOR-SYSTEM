const User = require('../models/sql/user');

// const UserHistory = require('../models/mongo/UserHistory');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const db = require('../config/db'); 
// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

// Helper to create safe user object
const toSafeObject = (user) => {
  const safeUser = { ...user };
  delete safeUser.password_hash;
  delete safeUser.reset_token;
  delete safeUser.verification_token;
  delete safeUser.reset_expires;
  delete safeUser.verification_expires;
  return safeUser;
};

// 1. REGISTER


exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const conn = await db.getConnection(); // mysql2 pool connection

  try {
    await conn.beginTransaction();

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      await conn.release();
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user (inside transaction)
    const result = await User.create({ name, email, password }, conn);
    const user = result.user;
    const verificationToken = result.verificationToken;

    // Generate JWT
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `<a href="${verificationUrl}">Verify Email</a>`
    });

    await conn.commit();
    await conn.release();

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      token,
      refreshToken,
      user: toSafeObject(user)
    });
  } catch (error) {
    await conn.rollback();
    await conn.release();
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};


// 2. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await User.comparePassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update login stats
    await User.updateLoginStats(user.id);

    // Update MongoDB history (if using)
    /*
    await UserHistory.findOneAndUpdate(
      { sqlUserId: user.id },
      {
        $push: {
          loginHistory: {
            timestamp: new Date(),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
          }
        }
      }
    );
    */

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: toSafeObject(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// 3. GET CURRENT USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get MongoDB history stats if using
    /*
    const history = await UserHistory.findOne({ sqlUserId: req.user.id });
    
    const profile = {
      ...toSafeObject(user),
      stats: history ? history.activityStats : null,
      streak: history ? history.streak : null
    };
    */

    res.json(toSafeObject(user));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// 4. UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, avatar_url, preferences } = req.body;
    const userId = req.user.id;

    // Get current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is being changed and if it's taken
    if (email && email !== currentUser.email) {
      const emailExists = await User.findByEmail(email);
      if (emailExists && emailExists.id !== userId) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Build updates object
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (avatar_url) updates.avatar_url = avatar_url;
    if (preferences) updates.preferences = JSON.stringify(preferences);

    // If email changed, require re-verification
    if (email && email !== currentUser.email) {
      updates.is_verified = false;
    }

    // Update user
    const updatedUser = await User.update(userId, updates);

    res.json({
      message: 'Profile updated successfully',
      user: toSafeObject(updatedUser)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// 5. CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password hash
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await User.comparePassword(user, currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    await User.updatePassword(userId, newPassword);

    // Send notification email
    await sendEmail({
      to: user.email,
      subject: 'Password Changed',
      html: '<p>Your password has been successfully changed.</p>'
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// 6. FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal user existence
      return res.json({ 
        message: 'If an account exists, a reset email has been sent' 
      });
    }

    // Generate and set reset token
    const resetToken = await User.setResetToken(email);

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    res.json({ 
      message: 'Password reset email sent',
      // In development, return token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

// 7. RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }

    // Verify reset token
    const tokenResult = await User.verifyResetToken(token);
    if (!tokenResult) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update password
    await User.updatePassword(tokenResult.id, newPassword);

    // Send confirmation email
    const user = await User.findById(tokenResult.id);
    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Successful',
        html: '<p>Your password has been successfully reset.</p>'
      });
    }

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// 8. VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const verifiedUser = await User.verifyEmailToken(token);
    if (!verifiedUser) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

// 9. RESEND VERIFICATION EMAIL
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // In your User class, you need to add a method to resend verification
    // For now, we'll create a new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // You need to implement this in your User class:
    // await User.updateVerificationToken(user.id, verificationToken);

    // Send email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `
    });

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

// 10. REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// 11. LOGOUT
exports.logout = async (req, res) => {
  try {
    // For JWT, client should remove tokens
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// 12. DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await User.comparePassword(user, password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Delete user
    await User.delete(userId);

    // await UserHistory.deleteOne({ sqlUserId: userId });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

// 13. GET USER STATS 
exports.getUserStats = async (req, res) => {
  try {
    /*
    const history = await UserHistory.findOne({ sqlUserId: req.user.id });
    
    if (!history) {
      return res.status(404).json({ error: 'User history not found' });
    }

    res.json({
      stats: history.activityStats,
      preferences: {
        categories: history.categoryPreferences
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        difficulty: history.difficultyPreferences
      },
      streak: history.streak,
      recentActivities: history.recentActivities.slice(0, 10)
    });
    */
    
    res.json({ message: 'MongoDB stats not implemented yet' });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
};

// 14. GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Implement pagination, filtering, etc. as needed
    res.json({ 
      message: 'Get all users not implemented yet',
      users: [],
      pagination: {
        total: 0,
        page: 1,
        totalPages: 0
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// 15. GET USER BY ID (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get MongoDB history if using
    /*
    const history = await UserHistory.findOne({ sqlUserId: user.id });
    */

    res.json({
      user: toSafeObject(user),
      history: null // history || null
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};