const AppError = require('../../shared/errors/AppError');
const { hashPassword } = require('../../shared/utils/hash');
const {
  uploadAvatar,
  deleteAvatar,
  deleteAvatarsByPrefix,
  cleanupAvatarsByPrefix,
} = require('../../shared/utils/cloudinary');
const userRepository = require('./user.repository');

async function updateProfile(userId, data, file) {
  const updates = {};

  if (data.name) {
    updates.name = data.name;
  }

  if (data.email) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing && existing.id !== userId) {
      throw new AppError('Email already in use', 409);
    }
    updates.email = data.email;
  }

  if (data.password) {
    updates.passwordHash = await hashPassword(data.password);
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

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };
}

module.exports = {
  updateProfile,
};
