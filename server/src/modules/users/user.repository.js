const User = require('./user.model');

async function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, updates, { new: true });
}

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

module.exports = {
  updateUser,
  findByEmail,
};
