const User = require('../users/user.model');

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function findByEmailOrPendingEmail(email) {
  const normalized = email.toLowerCase().trim();
  return User.findOne({
    $or: [{ email: normalized }, { pendingEmail: normalized }],
  });
}

async function createUser({ email, name, passwordHash }) {
  return User.create({ email: email.toLowerCase(), name, passwordHash });
}

async function findByVerificationToken(token) {
  return User.findOne({ verificationToken: token });
}

async function findByEmailChangeToken(token) {
  return User.findOne({ pendingEmailApprovalToken: token });
}

async function findByPasswordResetToken(token) {
  return User.findOne({ passwordResetToken: token });
}

async function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, updates, { new: true });
}

module.exports = {
  findByEmail,
  findByEmailOrPendingEmail,
  createUser,
  findByVerificationToken,
  findByEmailChangeToken,
  findByPasswordResetToken,
  updateUser,
};
