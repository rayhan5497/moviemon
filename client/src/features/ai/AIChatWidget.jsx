import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import AIChatDialog from './AIChatDialog';
import { useAIChat } from './hooks/useAIChat';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Lifted so chat state persists when the panel is toggled
  const chatState = useAIChat();

  return (
    <div className="fixed bottom-18 md:bottom-6 right-5 z-[9999] flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <AIChatDialog {...chatState} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB toggle button */}
      <Tooltip
        title={isOpen ? 'Close' : 'AI Movie Assistant'}
        placement="left"
        arrow
      >
        <Fab
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close AI chat' : 'Open AI Movie Assistant'}
          sx={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            '&:hover': {
              background: 'linear-gradient(135deg, #fb923c, #f97316)',
            },
            boxShadow: '0 4px 24px rgba(249,115,22,0.55)',
            width: 52,
            height: 52,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'close' : 'sparkles'}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {isOpen ? (
                <X size={22} color="white" />
              ) : (
                <Sparkles size={22} color="white" />
              )}
            </motion.div>
          </AnimatePresence>
        </Fab>
      </Tooltip>
    </div>
  );
};

export default AIChatWidget;
