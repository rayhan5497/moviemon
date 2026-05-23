import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {ResponsiveH2} from '../components/LandingHeading';


const faqs = [
  {
    question: 'What is MovieMon?',
    answer:
      'MovieMon is a modern movie discovery platform. Search for movies, watch HD trailers, view ratings from IMDb and TMDB, get AI-powered recommendations, save to your watchlist, and more — all in one place.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No! You can browse movies, watch trailers, and explore content without an account. Creating an account lets you save movies to your watchlist, track your watch history, and get personalized recommendations.',
  },
  {
    question: 'Where does the movie data come from?',
    answer:
      'MovieMon pulls data from TMDB (The Movie Database) and IMDb, including ratings, descriptions, cast information, trailers, and more.',
  },
  {
    question: 'Can I watch full movies on MovieMon?',
    answer:
      'MovieMon is a discovery platform — it provides trailers, ratings, and information. Full movie playback depends on available sources and your region.',
  },
  {
    question: 'How does the AI recommendation work?',
    answer:
      'Our AI assistant analyzes your preferences and suggests movies based on your taste. You can describe what you are looking for in natural language, and it will recommend relevant titles.',
  },
  {
    question: 'Is MovieMon free?',
    answer:
      'Yes! MovieMon is completely free to use. All features including search, trailers, ratings, watchlist, and AI recommendations are available at no cost.',
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <ResponsiveH2>
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
              Questions
            </span>
          </ResponsiveH2>
          <p className="text-gray-400 text-sm sm:text-lg">
            Everything you need to know about MovieMon.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-gray-800/40 overflow-hidden transition-colors duration-200 hover:border-white/10"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-sm text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
