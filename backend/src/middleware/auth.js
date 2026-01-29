// src/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// ========================
// CONFIGURATION
// ========================

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'timetable-service-secret-key-change-in-production',
  algorithms: ['HS256'],
  issuer: process.env.JWT_ISSUER || 'timetable-service',
  audience: process.env.JWT_AUDIENCE || 'timetable-client',
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '24h',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
};

// ========================
// TOKEN MANAGEMENT
// ========================

/**
 * Generate JWT tokens
 * @param {Object} user - User data to encode
 * @param {string} type - Token type ('access' or 'refresh')
 * @returns {string} JWT token
 */
function generateToken(user, type = 'access') {
  if (!user || !user.userId) {
    throw new Error('User ID is required to generate token');
  }
  
  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role || 'user',
    permissions: user.permissions || ['read:timetable', 'write:timetable']
  };
  
  const options = {
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
    subject: user.userId.toString()
  };
  
  if (type === 'access') {
    options.expiresIn = JWT_CONFIG.accessTokenExpiry;
  } else if (type === 'refresh') {
    options.expiresIn = JWT_CONFIG.refreshTokenExpiry;
    // Refresh tokens should have minimal payload
    delete payload.email;
    delete payload.role;
    delete payload.permissions;
  }
  
  return jwt.sign(payload, JWT_CONFIG.secret, options);
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
function verifyToken(token) {
  if (!token) {
    throw new Error('Token is required');
  }
  
  return jwt.verify(token, JWT_CONFIG.secret, {
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
    algorithms: JWT_CONFIG.algorithms
  });
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Valid refresh token
 * @returns {Object} New tokens
 */
function refreshTokens(refreshToken) {
  try {
    const decoded = verifyToken(refreshToken);
    
    // Refresh tokens should only contain userId
    if (!decoded.userId) {
      throw new Error('Invalid refresh token payload');
    }
    
    // In a real app, you would fetch user data from database
    const user = {
      userId: decoded.userId,
      email: decoded.email || `${decoded.userId}@example.com`,
      role: decoded.role || 'user'
    };
    
    const newAccessToken = generateToken(user, 'access');
    const newRefreshToken = generateToken({ userId: decoded.userId }, 'refresh');
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: JWT_CONFIG.accessTokenExpiry
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
}

// ========================
// AUTHENTICATION MIDDLEWARE
// ========================

/**
 * Authentication middleware for protected routes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'AUTH_REQUIRED',
      message: 'Authorization header is required',
      code: 'MISSING_AUTH_HEADER'
    });
  }
  
  // Check Bearer token format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN_FORMAT',
      message: 'Authorization header must be in format: Bearer <token>',
      code: 'INVALID_AUTH_FORMAT'
    });
  }
  
  const token = parts[1];
  
  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      error: 'EMPTY_TOKEN',
      message: 'Token cannot be empty',
      code: 'EMPTY_TOKEN'
    });
  }
  
  try {
    // Verify and decode token
    const decoded = verifyToken(token);
    
    // Check token type (if specified)
    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN_TYPE',
        message: 'Access token required, refresh token provided',
        code: 'WRONG_TOKEN_TYPE'
      });
    }
    
    // Check if token is expired (should be caught by verify, but double-check)
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        success: false,
        error: 'TOKEN_EXPIRED',
        message: 'Token has expired',
        code: 'EXPIRED_TOKEN',
        expiredAt: new Date(decoded.exp * 1000).toISOString()
      });
    }
    
    // Add user to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user',
      permissions: decoded.permissions || []
    };
    
    // Add token metadata for logging/auditing
    req.tokenMeta = {
      issuedAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : null,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
      issuer: decoded.iss,
      audience: decoded.aud
    };
    
    // Log authentication (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Authenticated user: ${decoded.userId} (${decoded.role})`);
    }
    
    next();
  } catch (error) {
    // Handle specific JWT errors
    let statusCode = 401;
    let errorCode = 'INVALID_TOKEN';
    let errorMessage = 'Token is not valid';
    
    switch (error.name) {
      case 'TokenExpiredError':
        statusCode = 401;
        errorCode = 'TOKEN_EXPIRED';
        errorMessage = 'Token has expired';
        break;
        
      case 'JsonWebTokenError':
        if (error.message.includes('signature')) {
          errorCode = 'INVALID_SIGNATURE';
          errorMessage = 'Invalid token signature';
        } else if (error.message.includes('malformed')) {
          errorCode = 'MALFORMED_TOKEN';
          errorMessage = 'Token is malformed';
        }
        break;
        
      case 'NotBeforeError':
        statusCode = 401;
        errorCode = 'TOKEN_NOT_ACTIVE';
        errorMessage = 'Token is not yet active';
        break;
    }
    
    // Log authentication failures (security monitoring)
    console.warn(`⚠️  Authentication failed:`, {
      error: error.name,
      message: error.message,
      path: req.path,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    res.status(statusCode).json({
      success: false,
      error: errorCode,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ========================
// AUTHORIZATION MIDDLEWARE
// ========================

/**
 * Role-based authorization middleware
 * @param {Array|string} allowedRoles - Roles that are allowed
 * @returns {Function} Express middleware
 */
const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'AUTH_REQUIRED',
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }
    
    next();
  };
};

/**
 * Permission-based authorization middleware
 * @param {Array|string} requiredPermissions - Permissions required
 * @returns {Function} Express middleware
 */
const requirePermission = (requiredPermissions) => {
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'AUTH_REQUIRED',
        message: 'Authentication required'
      });
    }
    
    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.every(perm => userPermissions.includes(perm));
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Insufficient permissions',
        requiredPermissions: permissions,
        userPermissions: userPermissions
      });
    }
    
    next();
  };
};

/**
 * Owner or admin authorization middleware
 * @param {string} resourceUserIdPath - Path to resource owner's userId in request
 * @returns {Function} Express middleware
 */
const requireOwnershipOrRole = (resourceUserIdPath = 'params.userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'AUTH_REQUIRED',
        message: 'Authentication required'
      });
    }
    
    // Get resource owner ID from request
    const pathParts = resourceUserIdPath.split('.');
    let resourceUserId = req;
    
    for (const part of pathParts) {
      resourceUserId = resourceUserId[part];
      if (resourceUserId === undefined) break;
    }
    
    // Allow if user is resource owner or has admin role
    const isOwner = resourceUserId && resourceUserId.toString() === req.user.userId.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You can only access your own resources unless you are an admin',
        resourceOwner: resourceUserId,
        currentUser: req.user.userId,
        userRole: req.user.role
      });
    }
    
    next();
  };
};

// ========================
// TOKEN BLACKLIST (SIMPLIFIED)
// ========================

// In a production app, use Redis or database for token blacklist
const tokenBlacklist = new Set();

/**
 * Add token to blacklist
 * @param {string} token - Token to blacklist
 */
function blacklistToken(token) {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      // Store token with expiry time
      const expiry = decoded.exp * 1000; // Convert to milliseconds
      tokenBlacklist.add(token);
      
      // Auto-remove after expiry (memory cleanup)
      setTimeout(() => {
        tokenBlacklist.delete(token);
      }, expiry - Date.now());
    }
  } catch (error) {
    console.error('Failed to blacklist token:', error.message);
  }
}

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {boolean} True if blacklisted
 */
function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

/**
 * Logout middleware - blacklists token
 */
const logoutMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    blacklistToken(token);
  }
  
  next();
};

// ========================
// EXPORTS
// ========================

module.exports = {
  // Core middleware
  authMiddleware,
  
  // Authorization middleware
  requireRole,
  requirePermission,
  requireOwnershipOrRole,
  
  // Token management
  generateToken,
  verifyToken,
  refreshTokens,
  
  // Token blacklist
  blacklistToken,
  isTokenBlacklisted,
  logoutMiddleware,
  
  // Configuration
  JWT_CONFIG
};