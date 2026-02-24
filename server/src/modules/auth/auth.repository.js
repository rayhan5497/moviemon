const User = require('../users/user.model');

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
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

async function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, updates, { new: true });
}

module.exports = {
  findByEmail,
  createUser,
  findByVerificationToken,
  findByEmailChangeToken,
  updateUser,
};
