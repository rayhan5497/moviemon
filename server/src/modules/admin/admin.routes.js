const express = require('express');
const adminController = require('./admin.controller');

const router = express.Router();

router.get('/stats', adminController.getStats);

module.exports = router;
