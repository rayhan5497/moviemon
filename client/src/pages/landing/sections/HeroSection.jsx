import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import siteLogo from '/siteLogo.png';

const ResponsiveDiv = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 mb-8"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          Your Ultimate Movie Companion
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="mb-6 text-[clamp(1rem,6vw,3rem)] font-bold leading-tight">
            Discover Movies & TV Shows
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
              Stream & Watch Trailers
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Search, stream, and save titles. MovieMon shows ratings, trailers,
          subtitle support, and personalized AI recommendations so you can watch
          what matters to you — movies and TV shows included.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/home"
            className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-base sm:text-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-teal-500/25"
          >
            <img
              src={siteLogo}
              alt="MovieMon"
              className="w-5 h-5 brightness-200 rounded-full"
            />
            Explore & Stream
          </Link>

          <a
            href="#features"
            className="inline-flex items-center gap-3 px-10 py-3 sm:px-12 sm:py-4 rounded-xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300"
          >
            Learn More
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-white/10 pt-8"
        >
          <ResponsiveDiv className="text-center text-[clamp(0.8rem,5vw,1.5rem)] font-bold leading-tight">
            10K+
            <ResponsiveDiv className="font-normal text-gray-500 text-[clamp(0.6rem,5vw,1rem)] leading-tight">
              Movies
            </ResponsiveDiv>
          </ResponsiveDiv>
          <ResponsiveDiv className="text-center text-[clamp(0.8rem,5vw,1.5rem)] font-bold leading-tight">
            HD
            <ResponsiveDiv className="font-normal text-gray-500 text-[clamp(0.6rem,5vw,1rem)] leading-tight">
              Trailers
            </ResponsiveDiv>
          </ResponsiveDiv>
          <ResponsiveDiv className="text-center text-[clamp(0.8rem,5vw,1.5rem)] font-bold leading-tight">
            AI
            <ResponsiveDiv className="font-normal text-gray-500 text-[clamp(0.6rem,5vw,1rem)] leading-tight">
              Recommendations
            </ResponsiveDiv>
          </ResponsiveDiv>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
