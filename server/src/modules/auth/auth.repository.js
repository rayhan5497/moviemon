const User = require('../users/user.model');

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function createUser({ email, name, passwordHash }) {
  return User.create({ email: email.toLowerCase(), name, passwordHash });
}

module.exports = { findByEmail, createUser };
