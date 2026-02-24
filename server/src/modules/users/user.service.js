const AppError = require('../../shared/errors/AppError');
const { hashPassword, comparePassword } = require('../../shared/utils/hash');
const {
  sendVerificationEmail,
  sendEmailChangeApprovalEmail,
} = require('../../shared/utils/mailer');
const {
  uploadAvatar,
  deleteAvatar,
  deleteAvatarsByPrefix,
  cleanupAvatarsByPrefix,
} = require('../../shared/utils/cloudinary');
const userRepository = require('./user.repository');
const crypto = require('crypto');

function parseState(value, fieldName) {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new AppError(`Invalid ${fieldName} state`, 400);
}

function parseMovieId(movieId) {
  const id = Number(movieId);
  if (!Number.isFinite(id)) {
    throw new AppError('Invalid movieId', 400);
  }
  return id;
}


async function updateProfile(userId, data, file) {
  const currentUser = await userRepository.findById(
    userId,
    'email isVerified passwordHash'
  );
  const updates = {};
  let requiresVerification = false;
  let requiresApproval = false;

  if (data.name) {
    updates.name = data.name;
  }

  const wantsEmailChange = Boolean(data.email);
  const wantsPasswordChange = Boolean(data.password);

  if (wantsEmailChange) {
    const nextEmail = data.email.toLowerCase();
    const existing = await userRepository.findByEmail(nextEmail);
    if (existing && existing.id !== userId) {
      throw new AppError('Email already in use', 409);
    }

    if (currentUser?.email && currentUser.email !== nextEmail) {
      if (!data.currentPassword) {
        throw new AppError('Current password is required to change email', 400);
      }
      const passwordMatch = await comparePassword(
        data.currentPassword,
        currentUser.passwordHash
      );
      if (!passwordMatch) {
        throw new AppError('Current password is incorrect', 401);
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const approvalToken = crypto.randomBytes(32).toString('hex');
      const approvalExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

      updates.pendingEmail = nextEmail;
      updates.pendingEmailVerified = false;
      updates.pendingEmailApprovalToken = approvalToken;
      updates.pendingEmailApprovalExpires = approvalExpires;
      updates.verificationToken = verificationToken;
      updates.verificationExpires = verificationExpires;
      requiresVerification = true;
      requiresApproval = true;
    }
  }

  if (wantsPasswordChange) {
    if (!data.currentPassword) {
      throw new AppError(
        'Current password is required to change password',
        400
      );
    }
    const passwordMatch = await comparePassword(
      data.currentPassword,
      currentUser.passwordHash
    );
    if (!passwordMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    const pendingPasswordHash = await hashPassword(data.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    updates.pendingPasswordHash = pendingPasswordHash;
    updates.verificationToken = verificationToken;
    updates.verificationExpires = verificationExpires;
    requiresVerification = true;
  }

  if (file) {
    try {
      const avatarBasePublicId = `moviemon/avatars/avatar_${userId}`;
      await deleteAvatarsByPrefix([
        `${avatarBasePublicId}_`,
        avatarBasePublicId,
      ]);
      await deleteAvatar(avatarBasePublicId);
      const result = await uploadAvatar(file.buffer, {
        public_id: `avatar_${userId}`,
        overwrite: true,
        invalidate: true,
      });
      updates.avatar = result.secure_url || result.url;
      try {
        await cleanupAvatarsByPrefix(avatarBasePublicId, result.public_id);
      } catch (cleanupError) {
        console.warn('Avatar cleanup failed', cleanupError);
      }
    } catch (err) {
      throw new AppError('Avatar upload failed', 500);
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError('No data to update', 400);
  }

  const user = await userRepository.updateUser(userId, updates);

  if (requiresVerification) {
    if (user.pendingEmail) {
      await sendVerificationEmail({
        to: user.pendingEmail,
        token: user.verificationToken,
        purpose: 'email_change',
      });
    }
    if (updates.pendingPasswordHash || user.pendingPasswordHash) {
      if (!user.pendingEmail) {
        const targetEmail = currentUser?.email;
        if (targetEmail) {
          await sendVerificationEmail({
            to: targetEmail,
            token: user.verificationToken,
            purpose: 'password_change',
          });
        }
      }
    }
    if (requiresApproval && currentUser?.email) {
      await sendEmailChangeApprovalEmail({
        to: currentUser.email,
        token: user.pendingEmailApprovalToken,
        purpose:
          user.pendingEmail && (updates.pendingPasswordHash || user.pendingPasswordHash)
            ? 'email_password_change'
            : 'email_change',
      });
    }
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    requiresVerification,
    requiresApproval,
    pendingEmail: user.pendingEmail || '',
    message: requiresVerification
      ? 'Verification email sent. Please verify to apply your changes.'
      : 'Profile updated successfully',
  };
}

async function getSavedMovies(userId) {
  const user = await userRepository.findById(userId, 'savedMovies saved');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const saved = user.saved || {};
  return {
    movies: saved.movies || [],
    tv: saved.tv || [],
  };
}

async function getWatchLaterMovies(userId) {
  const user = await userRepository.findById(
    userId,
    'watchLaterMovies watchLater'
  );
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const watchLater = user.watchLater || {};

  return {
    movies: watchLater.movies || [],
    tv: watchLater.tv || [],
  };
}

async function setSavedMovie(userId, movieId, data) {
  const state = parseState(data?.saved, 'saved');
  const id = parseMovieId(movieId);
  const mediaType = data?.mediaType === 'tv' ? 'tv' : 'movies';
  const field = `saved.${mediaType}`;
  const user = await userRepository.updateUserMovieList(
    userId,
    field,
    id,
    state
  );
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const saved = user.saved || {};
  return {
    movies: saved.movies || [],
    tv: saved.tv || [],
  };
}

async function setWatchLaterMovie(userId, movieId, data) {
  const state = parseState(data?.watchLater, 'watchLater');
  const id = parseMovieId(movieId);
  const mediaType = data?.mediaType === 'tv' ? 'tv' : 'movies';
  const field = `watchLater.${mediaType}`;
  const user = await userRepository.updateUserMovieList(
    userId,
    field,
    id,
    state
  );
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const watchLater = user.watchLater || {};

  return {
    movies: watchLater.movies || [],
    tv: watchLater.tv || [],
  };
}

async function getWatchHistory(userId) {
  const user = await userRepository.findById(userId, 'watchHistory');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const history = Array.isArray(user.watchHistory) ? user.watchHistory : [];
  history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  return history;
}

async function addWatchHistory(userId, movieId, data) {
  const id = parseMovieId(movieId);
  const user = await userRepository.findById(userId, 'watchHistory');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const entry = {
    mediaId: id,
    mediaType: data?.mediaType || '',
    timestamp: Number.isFinite(Number(data?.timestamp))
      ? Number(data?.timestamp)
      : Date.now(),
  };

  const history = Array.isArray(user.watchHistory) ? user.watchHistory : [];
  const nextHistory = history.filter((h) => h.mediaId !== id);
  nextHistory.unshift(entry);

  const MAX_HISTORY = 200;
  if (nextHistory.length > MAX_HISTORY) {
    nextHistory.length = MAX_HISTORY;
  }

  const updated = await userRepository.updateUser(userId, {
    watchHistory: nextHistory,
  });

  return updated.watchHistory || [];
}

async function deleteAccount(userId) {
  const user = await userRepository.findById(userId, 'avatar');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.avatar) {
    const avatarBasePublicId = `moviemon/avatars/avatar_${userId}`;
    try {
      await deleteAvatarsByPrefix([
        `${avatarBasePublicId}_`,
        avatarBasePublicId,
      ]);
      await deleteAvatar(avatarBasePublicId);
      await cleanupAvatarsByPrefix(avatarBasePublicId);
    } catch (err) {
      // continue even if cleanup fails
      console.warn('Avatar cleanup failed', err);
    }
  }

  await userRepository.deleteUser(userId);
  return { success: true };
}

module.exports = {
  updateProfile,
  getSavedMovies,
  getWatchLaterMovies,
  setSavedMovie,
  setWatchLaterMovie,
  getWatchHistory,
  addWatchHistory,
  deleteAccount,
};
