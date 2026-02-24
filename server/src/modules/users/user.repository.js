const User = require('./user.model');

async function updateUser(userId, updates) {
  return User.findByIdAndUpdate(userId, updates, { new: true });
}

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function findById(userId, select = null) {
  return User.findById(userId, select);
}

async function updateUserMovieList(userId, listField, movieId, state) {
  const update = state
    ? { $addToSet: { [listField]: movieId } }
    : { $pull: { [listField]: movieId } };

  return User.findByIdAndUpdate(userId, update, { new: true });
}

async function deleteUser(userId) {
  return User.findByIdAndDelete(userId);
}

module.exports = {
  updateUser,
  findByEmail,
  findById,
  updateUserMovieList,
  deleteUser,
};
