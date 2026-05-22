import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';

const AiRecommendationSection = () => {
  return (
    <section className="py-24 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl bg-gradient-to-br from-teal-500/10 to-purple-600/10 border border-white/10 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">MovieMon AI</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 max-w-[85%]">
                  <p className="text-sm text-gray-300">
                    Looking for something like "Inception" — mind-bending sci-fi
                    with a twist?
                  </p>
                </div>
                <div className="bg-gradient-to-r from-teal-500/10 to-teal-500/5 rounded-xl p-4 max-w-[90%] ml-auto">
                  <p className="text-sm text-gray-200">
                    Try "The Prestige" (2006), "Tenet" (2020), or "Arrival"
                    (2016). They share the intricate storytelling and
                    thought-provoking themes.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                <MessageCircle className="w-3 h-3" />
                Powered by AI
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              AI-Powered{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                Recommendations
              </span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6">
              Not sure what to stream? Our AI assistant learns your taste and
              recommends movies and TV shows, prioritizing available trailers,
              streaming availability, and similar titles you’ll love.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>
                  Describe what you're in the mood for in natural language
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>Get curated suggestions with ratings and trailers</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>Discover movies based on your watch history</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AiRecommendationSection;
