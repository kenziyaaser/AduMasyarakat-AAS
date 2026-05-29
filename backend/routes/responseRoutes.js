const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { createResponse } = require('../controllers/responseController');

// POST /responses (Admin only)
router.post('/', authenticateToken, isAdmin, createResponse);

module.exports = router;
