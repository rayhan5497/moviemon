const mongoose = require('mongoose');

const MediaExternalMappingSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], required: true },
    imdbId: { type: String, default: null, index: true },
    imdbRating: { type: Number, default: null },
    imdbVoteCount: { type: Number, default: null },
    lastTmdbSyncAt: { type: Date, default: null },
    lastImdbSyncAt: { type: Date, default: null },
  },
  { timestamps: true }
);

MediaExternalMappingSchema.index({ tmdbId: 1, mediaType: 1 }, { unique: true });

module.exports =
  mongoose.models.MediaExternalMapping ||
  mongoose.model('MediaExternalMapping', MediaExternalMappingSchema);
