import { useEffect, useRef } from 'react';
import {
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { BotMessageSquare, RefreshCw, Send } from 'lucide-react';
import AIChatMessage from './components/AIChatMessage';
import TypingIndicator from './components/TypingIndicator';

const AIChatDialog = ({
  messages,
  input,
  setInput,
  sendMessage,
  isPending,
  clearChat,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        width: 'min(380px, calc(100vw - 24px))',
        height: 'min(600px, 70vh)',
        minHeight: '0px',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(8, 8, 18, 0.93)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow:
          '0 24px 64px rgba(0,0,0,0.7), 0 4px 24px rgba(249,115,22,0.18)',
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <BotMessageSquare size={19} color="#f97316" />
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.01em',
            }}
          >
            AI Movie Assistant
          </Typography>
        </Stack>

        <Tooltip title="Clear chat" placement="left">
          <IconButton
            size="small"
            onClick={clearChat}
            sx={{
              color: 'rgba(255,255,255,0.35)',
              '&:hover': { color: 'rgba(255,255,255,0.75)' },
            }}
          >
            <RefreshCw size={15} />
          </IconButton>
        </Tooltip>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar">
        {messages.map((msg) => (
          <AIChatMessage key={msg.id} message={msg} />
        ))}

        {isPending && (
          <div className="flex justify-start mb-3">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="px-3 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={3}
            size="small"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.875rem',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(249,115,22,0.35)' },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(249,115,22,0.65)',
                  borderWidth: '1px',
                },
              },
              '& .MuiInputBase-input': {
                color: 'rgba(255,255,255,0.9)',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.3)',
                  opacity: 1,
                },
              },
            }}
          />

          <IconButton
            onClick={sendMessage}
            disabled={isPending || !input.trim()}
            sx={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: 'white',
              borderRadius: '12px',
              width: 40,
              height: 40,
              flexShrink: 0,
              '&:hover': {
                background: 'linear-gradient(135deg, #fb923c, #f97316)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <Send size={17} />
          </IconButton>
        </Stack>
      </div>
    </div>
  );
};

export default AIChatDialog;
