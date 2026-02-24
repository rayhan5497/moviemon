const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verifyEmail);
router.post('/verify/resend', authController.resendVerification);
router.get('/email-change/approve', authController.approveEmailChange);
router.post('/password/forgot', authController.requestPasswordReset);
router.post('/password/reset', authController.resetPassword);

module.exports = router;
