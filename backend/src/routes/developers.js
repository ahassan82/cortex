const express = require('express');
const { updateProfile, getDeveloperProfile } = require('../controllers/developerController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.put('/profile', authenticate, updateProfile);
router.get('/:id', getDeveloperProfile);

module.exports = router;
