const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');

// All complaint routes require authentication
router.use(authenticateToken);

// GET /complaints (User gets own, Admin gets all)
router.get('/', getAllComplaints);

// POST /complaints (User submits complaint with optional image upload)
router.post('/', upload.single('image'), createComplaint);

// GET /complaints/:id (Get detailed view)
router.get('/:id', getComplaintById);

// PUT /complaints/:id/status (Admin updates complaint status)
router.put('/:id/status', isAdmin, updateComplaintStatus);

// DELETE /complaints/:id (Admin deletes complaint)
router.delete('/:id', isSuperAdmin, deleteComplaint);

module.exports = router;
