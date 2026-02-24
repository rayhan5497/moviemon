const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    verificationExpires: { type: Date, default: null },
    pendingEmail: { type: String, default: '' },
    pendingEmailVerified: { type: Boolean, default: false },
    pendingEmailApprovalToken: { type: String, default: '' },
    pendingEmailApprovalExpires: { type: Date, default: null },
    pendingPasswordHash: { type: String, default: '' },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Date, default: null },

    avatar: {
      type: String,
      default: '',
    },

    saved: {
      movies: {
        type: [Number],
        default: [],
      },
      tv: {
        type: [Number],
        default: [],
      },
    },

    watchLater: {
      movies: {
        type: [Number],
        default: [],
      },
      tv: {
        type: [Number],
        default: [],
      },
    },

    watchHistory: {
      type: [
        {
          mediaId: { type: Number, required: true },
          mediaType: { type: String, default: '' },
          timestamp: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
