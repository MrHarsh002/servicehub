const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);

// Admin routes (can be protected later)
router.post('/', serviceController.createService);

module.exports = router;
