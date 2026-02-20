const mongoose = require('mongoose');
const { env } = require('./env');
const logger = require('./logger');

async function connectMongo(uri = env.MONGO_URI) {
  if (!uri) {
    throw new Error('MONGO_URI is not configured.');
  }
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
  logger.info('MongoDB connected');
  return mongoose.connection;
}

async function disconnectMongo() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

module.exports = { connectMongo, disconnectMongo };
