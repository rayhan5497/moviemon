const asyncHandler = require('../../shared/utils/asyncHandler');
const aiService = require('./ai.service');

const chat = asyncHandler(async (req, res) => {
  const { messages } = req.body;
  const result = await aiService.chat(messages);
  res.json(result);
});

module.exports = { chat };
