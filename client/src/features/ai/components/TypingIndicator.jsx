import { motion } from 'framer-motion';

const TypingIndicator = () => (
  <div className="flex items-center gap-[5px] px-3 py-[10px] bg-gray-800 rounded-2xl rounded-bl-sm w-fit">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-[7px] h-[7px] bg-gray-400 rounded-full block"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.18,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

export default TypingIndicator;
