import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import siteLogo from '/siteLogo.png';

const CtaSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-teal-600/5 to-orange-600/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Start Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
            Movie Journey?
          </span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Join MovieMon today and discover thousands of movies, watch HD
          trailers, get AI recommendations, and build your personal library.
        </p>

        <Link
          to="/home"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-teal-500/25 group"
        >
          <img
            src={siteLogo}
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
