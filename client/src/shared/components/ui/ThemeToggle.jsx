import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

import { useSnackbar } from '@/shared/context/SnackbarProvider';

const toggleVariants = {
  light: { x: 0 },
  dark: { x: 24 },
};

export default function ThemeToggle() {
  const { showSnackbar } = useSnackbar();

  const [theme, setTheme] = useState('dark'); // default dark

  // Initialize theme from localStorage or default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // default dark
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      showSnackbar('Dark Mode enabled !');
    } else {
      document.documentElement.classList.remove('dark');
      showSnackbar('Light Mode enabled !');
    }

    localStorage.setItem('theme', newTheme); // save user preference
  };

  return (
    <Tooltip
      title={`${
        theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      }`}
    >
      <motion.button
        onClick={toggleTheme}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-7 rounded-full bg-accent p-1 cursor-pointer"
      >
        {/* Toggle knob */}
        <motion.div
          className="w-5 h-5 rounded-full bg-primary shadow-md flex items-center justify-center text-md"
          variants={toggleVariants}
          animate={theme === 'dark' ? 'dark' : 'light'}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </motion.span>
        </motion.div>
      </motion.button>
    </Tooltip>
  );
}

