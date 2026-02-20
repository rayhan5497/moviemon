const AppError = require('../../shared/errors/AppError');
const { hashPassword, comparePassword } = require('../../shared/utils/hash');
const { signToken } = require('../../shared/utils/jwt');
const authRepository = require('./auth.repository');

const toAuthUserPayload = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar ?? '',
});

async function register({ email, password, name }) {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  const existing = await authRepository.findByEmail(email);
  if (existing) {
    throw new AppError('Email already in use', 409);
  }
  const passwordHash = await hashPassword(password);
  const user = await authRepository.createUser({ email, name: name || '', passwordHash });
  const token = signToken({ sub: user.id, email: user.email });
  return {
    user: toAuthUserPayload(user),
    token
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }
  const match = await comparePassword(password, user.passwordHash);
  if (!match) {
    throw new AppError('Invalid credentials', 401);
  }
  const token = signToken({ sub: user.id, email: user.email });
  return {
    user: toAuthUserPayload(user),
    token
  };
}

module.exports = { register, login };
