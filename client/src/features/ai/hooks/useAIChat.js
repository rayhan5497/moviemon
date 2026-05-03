import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendAIMessage } from '../api/aiChatApi';

const INITIAL_MESSAGE = {
  id: 'initial',
  role: 'assistant',
  content:
    "What mood are you in for tonight? 🎬 Tell me what kind of movie or show you'd like to watch, and I'll suggest some great picks!",
  movies: [],
};

export const useAIChat = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: sendAIMessage,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}_ai`,
          role: 'assistant',
          content: data.message,
          movies: data.movies || [],
          titles: data.titles || [],
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}_err`,
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting right now. Please try again.",
          movies: [],
          isError: true,
        },
      ]);
    },
  });

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const userMsg = {
      id: `${Date.now()}_user`,
      role: 'user',
      content: trimmed,
      movies: [],
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    // Build API payload — role + content only, skip the UI-only initial message
    const apiMessages = newMessages
      .filter((m) => m.id !== 'initial')
      .map(({ role, content }) => ({ role, content }));

    mutate(apiMessages);
  }, [input, isPending, messages, mutate]);

  const clearChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
  }, []);

  return { messages, input, setInput, sendMessage, isPending, clearChat };
};
