const AppError = require('../../shared/errors/AppError');
const { hashPassword, comparePassword } = require('../../shared/utils/hash');
const { signToken } = require('../../shared/utils/jwt');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../../shared/utils/mailer');
const authRepository = require('./auth.repository');
const crypto = require('crypto');

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
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  const user = await authRepository.createUser({
    email,
    name: name || '',
    passwordHash,
  });

  await authRepository.updateUser(user.id, {
    isVerified: false,
    verificationToken,
    verificationExpires,
  });

  await sendVerificationEmail({
    to: user.email,
    token: verificationToken,
    purpose: 'verify_email',
  });

  return {
    message: 'Verification email sent',
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw new AppError('No user found with this Email', 404);
  }
  const match = await comparePassword(password, user.passwordHash);
  if (!match) {
    throw new AppError('Invalid password', 401);
  }
  if (!user.isVerified) {
    throw new AppError('Please verify your email', 403);
  }
  const token = signToken({ sub: user.id, email: user.email });
  return {
    user: toAuthUserPayload(user),
    token
  };
}

async function verifyEmail(token, email) {
  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  const normalizedEmail =
    typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedToken) {
    throw new AppError('Verification token is required', 400);
  }

  const user = await authRepository.findByVerificationToken(normalizedToken);
  if (!user) {
    if (normalizedEmail) {
      const existing = await authRepository.findByEmail(normalizedEmail);
      if (existing && existing.isVerified) {
        return {
          message: 'Email already verified',
        };
      }
    }
    throw new AppError('Invalid or expired token', 400);
  }
  if (user.verificationExpires && user.verificationExpires < new Date()) {
    throw new AppError('Invalid or expired token', 400);
  }

  let updated = null;

  if (user.pendingEmail) {
    const existing = await authRepository.findByEmail(user.pendingEmail);
    if (existing && existing.id !== user.id) {
      throw new AppError('Email already in use', 409);
    }

    updated = await authRepository.updateUser(user.id, {
      pendingEmailVerified: true,
      verificationToken: '',
      verificationExpires: null,
    });

    if (updated.pendingEmailVerified && updated.pendingEmailApprovalToken === '') {
      updated = await authRepository.updateUser(user.id, {
        email: updated.pendingEmail,
        pendingEmail: '',
        pendingEmailVerified: false,
      });
    }
  } else {
    updated = await authRepository.updateUser(user.id, {
      isVerified: true,
      verificationToken: '',
      verificationExpires: null,
    });
  }

  if (updated.pendingPasswordHash) {
    updated = await authRepository.updateUser(user.id, {
      passwordHash: updated.pendingPasswordHash,
      pendingPasswordHash: '',
    });
  }

  const authToken = signToken({ sub: updated.id, email: updated.email });
  const isEmailChangePending =
    updated.pendingEmail && updated.pendingEmailApprovalToken !== '';

  return {
    message: isEmailChangePending
      ? 'Email verified. Waiting for approval from your current email.'
      : 'Email verified successfully',
    user: isEmailChangePending ? null : toAuthUserPayload(updated),
    token: isEmailChangePending ? null : authToken,
  };
}

async function resendVerification(email) {
  if (!email) {
    throw new AppError('Email is required', 400);
  }
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (user.isVerified && !user.pendingEmail) {
    return { message: 'Email already verified' };
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await authRepository.updateUser(user.id, {
    verificationToken,
    verificationExpires,
  });

  const targetEmail = user.pendingEmail || user.email;
  await sendVerificationEmail({
    to: targetEmail,
    token: verificationToken,
    purpose: user.pendingEmail ? 'email_change' : 'verify_email',
  });

  return { message: 'Verification email resent' };
}

async function approveEmailChange(token) {
  const normalizedToken = typeof token === 'string' ? token.trim() : '';
  if (!normalizedToken) {
    throw new AppError('Approval token is required', 400);
  }

  const user = await authRepository.findByEmailChangeToken(normalizedToken);
  if (!user) {
    throw new AppError('Invalid or expired token', 400);
  }
  if (user.pendingEmailApprovalExpires && user.pendingEmailApprovalExpires < new Date()) {
    throw new AppError('Invalid or expired token', 400);
  }

  let updated = await authRepository.updateUser(user.id, {
    pendingEmailApprovalToken: '',
    pendingEmailApprovalExpires: null,
  });

  if (updated.pendingPasswordHash) {
    updated = await authRepository.updateUser(user.id, {
      passwordHash: updated.pendingPasswordHash,
      pendingPasswordHash: '',
    });
  }

  if (updated.pendingEmailVerified && updated.pendingEmail) {
    updated = await authRepository.updateUser(user.id, {
      email: updated.pendingEmail,
      pendingEmail: '',
      pendingEmailVerified: false,
    });
  }

  return {
    message: updated.pendingEmail
      ? 'Approval received. Waiting for verification from the new email.'
      : 'Email change approved successfully',
    email: updated.pendingEmail ? '' : updated.email,
  };
}

async function requestPasswordReset(email) {
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  if (!normalizedEmail) {
    throw new AppError('Email is required', 400);
  }
  const user = await authRepository.findByEmailOrPendingEmail(normalizedEmail);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await authRepository.updateUser(user.id, {
    passwordResetToken: resetToken,
    passwordResetExpires: resetExpires,
  });

  const targetEmail =
    user.pendingEmail &&
    user.pendingEmail.toLowerCase() === normalizedEmail.toLowerCase()
      ? user.pendingEmail
      : user.email;
  await sendPasswordResetEmail({ to: targetEmail, token: resetToken });

  return { message: 'Reset link sent. Please check your email.' };
}

async function resetPassword(token, password) {
  if (!token || !password) {
    throw new AppError('Token and new password are required', 400);
  }
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const user = await authRepository.findByPasswordResetToken(token);
  if (!user) {
    throw new AppError('Invalid or expired token', 400);
  }
  if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
    throw new AppError('Invalid or expired token', 400);
  }

  const passwordHash = await hashPassword(password);
  await authRepository.updateUser(user.id, {
    passwordHash,
    passwordResetToken: '',
    passwordResetExpires: null,
  });

  return { message: 'Password reset successfully' };
}

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  approveEmailChange,
  requestPasswordReset,
  resetPassword,
};
