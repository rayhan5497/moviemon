const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verifyEmail);
router.post('/verify/resend', authController.resendVerification);
router.get('/email-change/approve', authController.approveEmailChange);

module.exports = router;
