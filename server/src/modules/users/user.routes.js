const express = require('express');
const userController = require('./user.controller');

const authMiddleware = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

router.patch(
  '/me',
  authMiddleware,
  upload.single('avatar'),
  userController.updateProfile
);

module.exports = router;
