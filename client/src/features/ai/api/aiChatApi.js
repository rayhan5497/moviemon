const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || '';

/**
 * @param {{ role: 'user' | 'assistant'; content: string }[]} messages
 * @returns {Promise<{ message: string; movies: Array<{ id: number; title: string; poster_path: string | null; media_type: string; vote_average: number | null; release_date: string | null }> }>}
 */
export const sendAIMessage = async (messages) => {
  const res = await fetch(`${API_BASE}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Failed to get AI response');
  }

  return res.json();
};
