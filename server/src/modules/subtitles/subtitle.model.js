const mongoose = require('mongoose');

// const SubtitleSchema = new mongoose.Schema(
//   {
//     // movieId: { type: String, required: true, index: true },
//     // language: { type: String, required: true, default: 'en' },
//     // content: { type: String, required: true },
//     // provider: { type: String, default: 'external' }
//     data: {type: String},
//   },
//   { timestamps: true }
// );

const SubtitleSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed }, // allows any object/array
  },
  { timestamps: true }
);

SubtitleSchema.index({ data: 1, language: 1 });

module.exports = mongoose.model('Subtitles', SubtitleSchema);
