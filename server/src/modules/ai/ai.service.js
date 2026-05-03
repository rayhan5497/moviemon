const { env } = require('../../config/env');
const { fetchMovies } = require('../movies/movies.integration');
const AppError = require('../../shared/errors/AppError');

const SYSTEM_PROMPT = `You are a helpful movie and TV show recommendation assistant for Moviemon, a streaming platform.
When users describe what they want to watch, suggest relevant titles.
ALWAYS respond with valid JSON in this exact format:
{
  "message": "Your friendly, conversational response here",
  "titles": ["array of titles"]
}
  
Do Not respond with with text outside the JSON format.
If the user is asking a general question (not requesting recommendations), set titles to an empty array and set message to a impression that - you can only help with movies and tv shows recommendation.
Be concise, enthusiastic, and specific about why each pick matches what the user wants. You can recommend both movies and TV shows.`;

// ── Provider: OpenAI ────────────────────────────────────────────────────────

async function callOpenAI(messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      response_format: { type: 'json_object' },
      max_tokens: 600,
      temperature: 0.75,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `OpenAI error ${res.status}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content);
}

// ── Provider: Cohere ────────────────────────────────────────────────────────

async function callCohere(messages) {
  // Cohere chat API expects the latest message as `message`
  // and prior turns as `chat_history` with USER / CHATBOT roles
  const lastMsg = messages[messages.length - 1];
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? 'USER' : 'CHATBOT',
    message: m.content,
  }));

  const res = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'command-a-03-2025',
      preamble:
        SYSTEM_PROMPT +
        '\n\nIMPORTANT: Your entire response must be a single, raw JSON object — no markdown, no code fences.',
      message: lastMsg.content,
      chat_history: history,
      temperature: 0.75,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.message || `Cohere error ${res.status}`);
  }

  const data = await res.json();
  console.log('data: ', data);
  let text = (data.text || '').trim();

  // Strip accidental markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) text = fenceMatch[1].trim();

  // Ensure the response is valid JSON
  if (!text.startsWith('{')) {
    throw new Error(
      `Cohere returned non-JSON response: ${text.substring(0, 100)}...`
    );
  }

  try {
    return JSON.parse(text);
  } catch (parseErr) {
    throw new Error(
      `Cohere returned invalid JSON: ${
        parseErr.message
      }. Response: ${text.substring(0, 200)}...`
    );
  }
}

// ── TMDB lookup ─────────────────────────────────────────────────────────────

function normalizeTitle(title) {
  return String(title || '')
    .replace(/\s*\(\d{4}\)$/, '')
    .replace(/[“”]/g, '"')
    .replace(/['‘’]/g, "'")
    .replace(/\s*:\s*/g, ': ')
    .trim();
}

async function searchMovieByTitle(title) {
  const normalized = normalizeTitle(title);
  const candidates = [title, normalized].filter(
    (candidate) => candidate && candidate !== title
  );
  candidates.unshift(title);

  for (const candidate of candidates) {
    const searchData = await fetchMovies(
      `/search/multi?query=${encodeURIComponent(candidate)}&include_adult=false`
    );
    const result = searchData.results?.find(
      (r) => r.media_type === 'movie' || r.media_type === 'tv'
    );
    if (result) {
      return result;
    }
  }

  return null;
}

async function fetchMovieSuggestions(titles) {
  if (!Array.isArray(titles) || titles.length === 0) {
    return [];
  }

  const settled = await Promise.allSettled(
    titles.slice(0, 10).map(async (title) => {
      const result = await searchMovieByTitle(title);
      if (!result) return null;
      return {
        id: result.id,
        title: result.title || result.name || normalizeTitle(title),
        poster_path: result.poster_path || null,
        media_type: result.media_type,
        vote_average: result.vote_average || null,
        release_date: result.release_date || result.first_air_date || null,
      };
    })
  );

  return settled
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value);
}

// ── Main handler ─────────────────────────────────────────────────────────────

async function chat(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new AppError('Messages array is required', 400);
  }

  if (!env.OPENAI_API_KEY && !env.COHERE_API_KEY) {
    throw new AppError('AI service is not configured', 503);
  }

  let parsed;

  // 1. Try OpenAI
  if (env.OPENAI_API_KEY) {
    try {
      parsed = await callOpenAI(messages);
    } catch (openAIErr) {
      console.warn(
        '[AI] OpenAI failed, falling back to Cohere:',
        openAIErr.message
      );
    }
  }

  // 2. Fallback to Cohere
  if (!parsed && env.COHERE_API_KEY) {
    try {
      parsed = await callCohere(messages);
    } catch (cohereErr) {
      console.error('[AI] Cohere fallback also failed:', cohereErr.message);
    }
  }

  if (!parsed) {
    // Bulletproof fallback: provide default recommendations
    parsed = {
      message:
        "I'm sorry, but I'm having trouble generating personalized recommendations right now."
    };
  }

  const message = String(parsed.message || '');
  const rawTitles = Array.isArray(parsed.titles)
    ? parsed.titles
        .filter((title) => typeof title === 'string')
        .map((title) => title.trim())
        .filter(Boolean)
    : [];

  const movies = await fetchMovieSuggestions(rawTitles);

  return { message, movies, titles: rawTitles };
}

module.exports = { chat };
