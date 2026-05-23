import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ResponsiveH2 } from '../components/LandingHeading';

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-teal-600/5 to-orange-600/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <ResponsiveH2>Ready to Start Streaming?</ResponsiveH2>
        <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto text-wrap wrap-break-word">
          Join MovieMon and start streaming, watch HD trailers, get AI-powered
          recommendations, and build a personal library of movies and TV shows.
        </p>

        <Link
          to="/home"
          className="inline-flex items-center gap-3 px-8 py-3 sm:px-10 sm:py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-base sm:text-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-teal-500/25 group"
        >
          <img
            src="/siteLogo.png"
            alt="MovieMon"
            className="w-5 h-5 brightness-200 rounded-full"
          />
          Get Started Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="mt-4 text-sm text-gray-500">
          No account required. Start exploring immediately.
        </p>
      </motion.div>
    </section>
  );
};

export default CtaSection;
