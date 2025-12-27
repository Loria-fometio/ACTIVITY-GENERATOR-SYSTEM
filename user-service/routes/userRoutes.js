const express = require('express');
const router = express.Router();
const { getUsers, createUser, loginUser, getProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
