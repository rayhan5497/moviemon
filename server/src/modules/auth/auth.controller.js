const asyncHandler = require('../../shared/utils/asyncHandler');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(
    req.query.token,
    req.query.email
  );
  res.json(result);
});

const resendVerification = asyncHandler(async (req, res) => {
  const result = await authService.resendVerification(req.body.email);
  res.json(result);
});

const approveEmailChange = asyncHandler(async (req, res) => {
  const result = await authService.approveEmailChange(req.query.token);
  res.json(result);
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body.email);
  res.json(result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(
    req.body.token,
    req.body.password
  );
  res.json(result);
});

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  approveEmailChange,
  requestPasswordReset,
  resetPassword,
};
