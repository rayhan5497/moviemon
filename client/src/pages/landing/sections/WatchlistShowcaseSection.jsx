import { motion } from 'framer-motion';
import { Bookmark, Heart, Clock } from 'lucide-react';
import { ResponsiveH2 } from '../components/LandingHeading';
import libraryImage from '@/shared/assets/image/library.webp';

const WatchlistShowcaseSection = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <ResponsiveH2>
              Build Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                Streaming Library
              </span>
            </ResponsiveH2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
              Save titles to your personal collection and queue them to stream
              later. Track your watch history, favorite picks, and never lose a
              great recommendation.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Smart Watchlist</h3>
                  <p className="text-sm text-gray-400">
                    Save movies with one click. Organize by what you want to
                    watch next.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Favorites</h3>
                  <p className="text-sm text-gray-400">
                    Mark your favorites and quickly find them again.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Watch History</h3>
                  <p className="text-sm text-gray-400">
                    Automatically track what you have watched. Never rewatch
                    accidentally.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-2xl bg-gray-800 sm:p-6 overflow-hidden">
              <img
                src={libraryImage}
                alt="Watchlist Showcase"
                className="rounded-lg w-full h-auto object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WatchlistShowcaseSection;
